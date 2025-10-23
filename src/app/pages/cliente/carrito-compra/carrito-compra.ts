// 🧠 CarritoCompra Component
// 🇪🇸 Panel del carrito de compras del cliente
// 🇺🇸 Customer shopping cart panel

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoCompraService } from '../../../services/compra/carrito-compra/carrito-compra.service';
import { TokenService } from '../../../services/token.service';
import { ProductoService } from '../../../services/inventario/producto.service';
import { CarritoCompraDto } from '../../../dto/objects/compra/carrito-compra/carrito-compra.dto';
import { ItemCarritoDto } from '../../../dto/objects/compra/carrito-compra/item-carrito.dto';
import { ModificarCantidadItemsDto } from '../../../dto/objects/compra/carrito-compra/modificar-cantidad-items.dto';
import { EliminarItemsCarritoDto } from '../../../dto/objects/compra/carrito-compra/eliminar-items-carrito.dto';
import { ProductoDto } from '../../../dto/objects/inventario/producto/producto.dto';
import { ToastService } from '../../../components/toast/service/toast.service';
import { FondoAnimadoComponent } from '../../../shared/fondo-animado/fondo-animado.component';

@Component({
  selector: 'app-carrito-compra',
  standalone: true,
  imports: [CommonModule, FondoAnimadoComponent],
  templateUrl: './carrito-compra.html',
  styleUrl: './carrito-compra.css',
})
export class CarritoCompra implements OnInit {
  carrito: CarritoCompraDto | null = null;
  productosMap: { [id: number]: ProductoDto } = {};
  cargando = false;

  constructor(
    private carritoService: CarritoCompraService,
    private productoService: ProductoService,
    private tokenService: TokenService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  // 🔁 Cargar carrito del cliente autenticado
  private cargarCarrito(): void {
    this.cargando = true;
    const idCliente = this.tokenService.getUserIdFromToken();

    // Validación para evitar pasar null
    if (idCliente === null) {
      console.error('❌ No se pudo obtener el ID del cliente desde el token');
      return;
    }

    this.carritoService.obtenerCarritoCliente(idCliente).subscribe({
      next: (resp) => {
        this.carrito = resp.mensaje;
        this.cargarDetallesProductos();
        this.cargando = false;
      },
      error: () => {
        this.toastService.show('Error al cargar el carrito', 'error');
        this.cargando = false;
      },
    });
  }

  // 📦 Cargar información de productos asociados a los items
  private cargarDetallesProductos(): void {
    if (!this.carrito) return;

    this.carrito.itemsCarrito.forEach((item) => {
      this.productoService.obtenerProductoPorId(item.idProducto).subscribe({
        next: (resp) => {
          this.productosMap[item.idProducto] = resp.mensaje;
        },
      });
    });
  }

  // ➕ Aumentar cantidad de un item
  aumentarCantidad(item: ItemCarritoDto): void {
    const dto: ModificarCantidadItemsDto = {
      idProducto: item.idProducto,
      idCliente: this.carrito!.idCliente,
      cantidadAgregar: 1,
    };

    this.carritoService.agregarCantidad(dto).subscribe({
      next: () => {
        this.toastService.show('Cantidad aumentada', 'success');
        this.cargarCarrito();
      },
    });
  }

  // ➖ Disminuir cantidad de un item
  disminuirCantidad(item: ItemCarritoDto): void {
    if (item.cantidad <= 1) {
      this.eliminarItem(item);
      return;
    }

    const dto: ModificarCantidadItemsDto = {
      idProducto: item.idProducto,
      idCliente: this.carrito!.idCliente,
      cantidadAgregar: 1,
    };

    this.carritoService.quitarCantidad(dto).subscribe({
      next: () => {
        this.toastService.show('Cantidad disminuida', 'info');
        this.cargarCarrito();
      },
    });
  }

  // ❌ Eliminar producto del carrito
  eliminarItem(item: ItemCarritoDto): void {
    const dto: EliminarItemsCarritoDto = {
      idProducto: item.idProducto,
      idCliente: this.carrito!.idCliente,
    };

    this.carritoService.eliminarProducto(dto).subscribe({
      next: () => {
        this.cargarCarrito();
      },
    });
  }
}
