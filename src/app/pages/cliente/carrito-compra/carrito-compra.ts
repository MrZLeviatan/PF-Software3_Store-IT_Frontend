import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoCompraService } from '../../../services/compra/carrito-compra.service';
import { TokenService } from '../../../services/token.service';
import { ProductoService } from '../../../services/inventario/producto.service';
import { CarritoCompraDto } from '../../../dto/objects/compra/carrito-compra/carrito-compra.dto';
import { ItemCarritoDto } from '../../../dto/objects/compra/carrito-compra/item-carrito.dto';
import { ModificarCantidadItemsDto } from '../../../dto/objects/compra/carrito-compra/modificar-cantidad-items.dto';
import { EliminarItemsCarritoDto } from '../../../dto/objects/compra/carrito-compra/eliminar-items-carrito.dto';
import { ProductoDto } from '../../../dto/objects/inventario/producto/producto.dto';
import { ToastService } from '../../../components/toast/service/toast.service';
import { FondoAnimadoComponent } from '../../../shared/fondo-animado/fondo-animado.component';
import { CompraService } from '../../../services/compra/compra.service';

@Component({
  selector: 'app-carrito-compra',
  standalone: true,
  imports: [CommonModule, FondoAnimadoComponent, FormsModule],
  templateUrl: './carrito-compra.html',
  styleUrl: './carrito-compra.css',
})
export class CarritoCompra implements OnInit {
  carrito: CarritoCompraDto | null = null;
  productosMap: { [id: number]: ProductoDto } = {};
  cargando = false;
  cantidades: { [id: number]: number } = {};

  constructor(
    private carritoService: CarritoCompraService,
    private productoService: ProductoService,
    private tokenService: TokenService,
    private toastService: ToastService,
    private compraService: CompraService
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

  // ➕ Actualizar cantidad y verificar stock
  actualizarCantidad(item: ItemCarritoDto): void {
    const nuevaCantidad = this.cantidades[item.id];

    if (nuevaCantidad <= 0) {
      this.toastService.show('La cantidad debe ser mayor a 0', 'info');
      return;
    }

    const dto: ModificarCantidadItemsDto = {
      idProducto: item.idProducto,
      idCliente: this.carrito!.idCliente,
      cantidad: nuevaCantidad,
    };

    this.carritoService.modificarCantidad(dto).subscribe({
      next: () => {
        this.toastService.show('Cantidad actualizada correctamente', 'success');
        this.cargarCarrito();
      },
      error: (err) => {
        this.toastService.show(err.error?.mensaje || 'Error al modificar cantidad', 'error');
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

  // Inicia el proceso de pago con Stripe
  iniciarPago(): void {
    if (!this.carrito || this.carrito.itemsCarrito.length === 0) {
      this.toastService.show('Tu carrito está vacío', 'info');
      return;
    }

    this.toastService.show('Redirigiendo a pasarela de pago...', 'info');

    this.compraService.crearSesionPago(this.carrito).subscribe({
      next: (resp) => {
        const url = resp.url;
        if (url) {
          // 🚀 Redirigir al Checkout de Stripe
          window.location.href = url;
        } else {
          this.toastService.show('No se pudo obtener la URL de pago', 'error');
        }
      },
      error: (err) => {
        console.error('❌ Error creando sesión de pago:', err);
        this.toastService.show(err.error?.mensaje || 'Error iniciando pago', 'error');
      },
    });
  }
}
