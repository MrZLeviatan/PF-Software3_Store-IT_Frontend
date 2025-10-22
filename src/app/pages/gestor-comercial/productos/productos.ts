import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Services
import { ProductoService } from '../../../services/inventario/producto.service';
import { ProveedorService } from '../../../services/users/proveedor.service';
import { EspacioProductoService } from '../../../services/almacen/espacio-producto.service';
import { LoteService } from '../../../services/inventario/lote.service';
// DTOs
import { TipoProducto } from './../../../dto/enum/tipo-producto';
import { ProductoDto } from './../../../dto/objects/inventario/producto/producto.dto';
import { ProveedorDto } from './../../../dto/users/proveedor.dto';
import { EspacioProductoDto } from '../../../dto/objects/almacen/espacioProducto/espacio-producto.dto';
import { TokenService } from '../../../services/token.service';
import { RegistroLoteDto } from '../../../dto/objects/inventario/lotes/registro-lotes.dto';
import { ToastService } from '../../../components/toast/service/toast.service';
// Funcionalidades
import { FondoAnimadoComponent } from '../../../shared/fondo-animado/fondo-animado.component';
import { Token } from '@angular/compiler';

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
  espacioProducto: EspacioProductoDto | null = null;

  // Lista de proveedores para mostrar en el filtro
  proveedores: ProveedorDto[] = [];

  // Filtro disponibles para los productos
  tipos = Object.values(TipoProducto);

  // Indicador de carga
  cargando = false;

  // Filtros seleccionados
  tipoSeleccionado: string = '';
  proveedorSeleccionado: string = '';

  // Estado formulario lote
  mostrarFormularioLote = false;

  nuevoLote: RegistroLoteDto = {
    cantidadTotal: 0,
    areaTotal: 0,
    idEspacioProducto: 0,
    idGestorComercial: 0,
    fechaEntra: '',
    observaciones: '',
  };

  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private EspacioProductoService: EspacioProductoService,
    private loteService: LoteService,
    private tokenService: TokenService,
    private toastService: ToastService
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
    }
    // Obtener el espacio ocupado por el producto
    if (producto.id) {
      this.EspacioProductoService.obtenerEspacioOcupadoPorProducto(producto.id).subscribe({
        next: (resp) => {
          this.espacioProducto = resp.mensaje;
        },
      });
    }
  }

  // Cerrar el panel de detalle
  cerrarDetalles(): void {
    this.productoSeleccionado = null;
    this.proveedorSeleccionadoDetalles = null;
    this.espacioProducto = null;
  }

  // Calcular estilo del contenedor interno según porcentaje ocupado
  calcularEstiloOcupacion(): any {
    if (!this.espacioProducto) return {};
    const porcentaje = this.espacioProducto.unidadAlmacenamiento.porcentajeOcupacion;
    return {
      width: `${porcentaje}%`,
      backgroundColor: porcentaje > 75 ? '#ff4d4d' : porcentaje > 50 ? '#ffc107' : '#28a745',
    };
  }

  abrirRegistroLote(): void {
    if (!this.espacioProducto) return;
    const idGestor = this.tokenService.getUserIdFromToken(); // 🇪🇸 Obtener ID del token / 🇺🇸 Get manager ID from token
    this.nuevoLote = {
      cantidadTotal: 0,
      areaTotal: 0,
      idEspacioProducto: this.espacioProducto.id,
      idGestorComercial: idGestor,
      fechaEntra: '',
      observaciones: '',
    };
    this.mostrarFormularioLote = true;
  }

  cerrarFormularioLote(): void {
    this.mostrarFormularioLote = false;
  }

  registrarLote(): void {
    this.loteService.registrarLote(this.nuevoLote).subscribe({
      next: (resp) => {
        this.toastService.show('Lote registrado', 'success');
        this.mostrarFormularioLote = false;
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Pequeña pausa para mostrar el toast antes de recarga
      },
    });
  }

  // Devuelve un color según el nivel de ocupación del espacio
  obtenerColorOcupacion(porcentaje: number): string {
    if (porcentaje < 40) return '#4caf50'; // Verde
    if (porcentaje < 70) return '#ffb300'; // Amarillo
    return '#e53935'; // Rojo
  }
}
