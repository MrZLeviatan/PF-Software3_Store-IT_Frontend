import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Services
import { ProductoService } from '../../../services/inventario/producto.service';
import { ProveedorService } from '../../../services/users/proveedor.service';
// DTOs
import { TipoProducto } from './../../../dto/enum/tipo-producto';
import { ProductoDto } from './../../../dto/objects/inventario/producto/producto.dto';
import { ProveedorDto } from './../../../dto/users/proveedor.dto';
// Funcionalidades
import { FondoAnimadoComponent } from '../../../shared/fondo-animado/fondo-animado.component';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule, FondoAnimadoComponent],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class ProductosGestorComcercial implements OnInit {
  // Lista de productos que se mostrarán en la tabla
  productos: ProductoDto[] = [];

  // Producto seleccionado
  productoSeleccionado: ProductoDto | null = null;
  proveedorSeleccionadoDetalles: ProveedorDto | null = null;

  // Lista de proveedores para mostrar en el filtro
  proveedores: ProveedorDto[] = [];

  // Filtro disponibles para los productos
  tipos = Object.values(TipoProducto);

  // Indicador de carga
  cargando = false;

  // Filtros seleccionados
  tipoSeleccionado: string = '';
  proveedorSeleccionado: string = '';

  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarProveedores();
  }

  // Metodo para cargar los productos desde el servicio
  cargarProductos(): void {
    this.cargando = true;
    this.productoService.listarProductos().subscribe({
      next: (respuesta) => {
        this.productos = respuesta.mensaje || [];
        this.cargando = false;
      },
    });
  }

  // Cargar lista de proveedores
  cargarProveedores(): void {
    this.proveedorService.listarProveedores().subscribe({
      next: (respuesta) => {
        this.proveedores = respuesta.mensaje; // según tu MensajeDto
      },
    });
  }

  // Metodo para filtrar los productos por tipo
  filtrarProductos(): void {
    this.cargando = true;
    this.productoService
      .filtrarProductos(this.tipoSeleccionado as TipoProducto, this.proveedorSeleccionado)
      .subscribe({
        next: (resp) => {
          this.productos = resp.mensaje;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al filtrar productos:', err);
          this.cargando = false;
        },
      });
  }

  // Metodo para seleccionar un producto y mostrar sus detalles
  mostrarDetallesProducto(producto: ProductoDto): void {
    this.productoSeleccionado = producto;

    // Consultar el proveedor asociado al Id del dto
    if (producto.idProveedor) {
      this.proveedorService.obtenerProveedorPorId(producto.idProveedor).subscribe({
        next: (resp) => {
          if (resp) {
            this.proveedorSeleccionadoDetalles = resp.mensaje;
          }
        },
      });
    } else {
      this;
    }
  }

  // Cerrar el panel de detalle
  cerrarDetalles(): void {
    this.productoSeleccionado = null;
    this.proveedorSeleccionadoDetalles = null;
  }
}
