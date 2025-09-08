import { Component, OnInit } from '@angular/core';
import { FondoAnimadoComponent } from '../../../shared/fondo-animado/fondo-animado.component';
import { GestorBodegasService } from '../../../services/gestorBodega/gestor-productos.service';
import { ProductoDto } from '../../../dto/producto/producto.dto';
import { MovimientosProductoDto } from '../../../dto/movimiento/movimiento.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutorizacionProductoDto } from '../../../dto/movimiento/autorizar-movimiento.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../services/token.service';
import { ToastService } from '../../../components/toast/service/toast.service';

@Component({
  selector: 'app-productos-gestor',
  standalone: true,
  imports: [FondoAnimadoComponent, CommonModule, FormsModule],
  templateUrl: './productos-gestor.html',
  styleUrl: './productos-gestor.css',
})
export class ProductosGestor implements OnInit {
  // =============================
  // 1. Estado principal
  // =============================
  productos: ProductoDto[] = [];
  selected:
    | (ProductoDto & {
        movimientos?: (MovimientosProductoDto & {
          showDetail?: boolean;
          descripcionAutorizadoInput?: string;
        })[];
      })
    | null = null;
  showModal = false;

  // Filtros
  filtroCodigo: string = '';
  filtroTipo: string = '';

  // Estados de carga
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private gestorService: GestorBodegasService,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  // =============================
  // 2. Cargar productos
  // =============================
  loadProductos() {
    this.loading = true;
    this.errorMessage = null;
    this.gestorService
      .listarProductos({
        codigoProducto: this.filtroCodigo,
        tipoProducto: this.filtroTipo,
      })
      .subscribe({
        next: (res) => {
          this.productos = res;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Error al cargar productos';
          this.loading = false;
        },
      });
  }

  // =============================
  // 3. Abrir modal detalle
  // =============================
  openDetail(producto: ProductoDto) {
    this.selected = { ...producto, movimientos: [] };
    this.showModal = true;

    // Cargar movimientos del producto
    this.gestorService.obtenerMovimientosProductoEspecifico(producto.codigoProducto).subscribe({
      next: (movs) => {
        if (this.selected) {
          this.selected.movimientos = movs.map((m) => ({
            ...m,
            showDetail: false,
            descripcionAutorizadoInput: '',
          }));
        }
      },
      error: () => {
        if (this.selected) this.selected.movimientos = [];
      },
    });
  }

  closeModal() {
    this.showModal = false;
    this.selected = null;
  }

  // =============================
  // 4. Expandir/cerrar movimiento
  // =============================
  toggleMovimiento(
    mov: MovimientosProductoDto & { showDetail?: boolean; descripcionAutorizadoInput?: string }
  ) {
    mov.showDetail = !mov.showDetail;
  }

  // =============================
  // 5. Verificar movimiento
  // =============================
  verificarMovimiento(mov: MovimientosProductoDto & { descripcionAutorizadoInput?: string }) {
    if (!this.selected) return;

    const dto: AutorizacionProductoDto = {
      codigoProducto: this.selected.codigoProducto,
      idMovimiento: String(mov.id),
      emailPersonalAutorizado: this.tokenService.getEmail() ?? '',
      descripcionAutorizacion: mov.descripcionAutorizadoInput || 'Movimiento aprobado',
      estadoMovimiento: 'VERIFICADO',
    };

    this.gestorService.autorizarMovimiento(dto).subscribe({
      next: () => {
        this.toastService.show('Movimiento aprobado correctamente', 'success');
        this.loadProductos();
        this.closeModal();
      },
    });
  }

  denegarMovimiento(mov: MovimientosProductoDto & { descripcionAutorizadoInput?: string }) {
    if (!this.selected) return;

    const dto: AutorizacionProductoDto = {
      codigoProducto: this.selected.codigoProducto,
      idMovimiento: String(mov.id),
      emailPersonalAutorizado: this.tokenService.getEmail() ?? '',
      descripcionAutorizacion: mov.descripcionAutorizadoInput || 'Movimiento denegado',
      estadoMovimiento: 'DENEGADO',
    };

    this.gestorService.autorizarMovimiento(dto).subscribe({
      next: () => {
        this.toastService.show('Movimiento denegado correctamente', 'success');
        this.loadProductos();
        this.closeModal();
      },
    });
  }

  // Sort movimientos descending by fechaMovimiento
  getMovimientosOrdenados(): any[] {
    if (!this.selected?.movimientos) return [];

    // Clonar y ordenar descendente
    return [...this.selected.movimientos].sort(
      (a, b) => new Date(b.fechaMovimiento).getTime() - new Date(a.fechaMovimiento).getTime()
    );
  }
}
