import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { AuxiliarBodegaService } from '../../../../services/auxiliarBodega/auxiliarProductos.service';
import { ProductoDto } from '../../../../dto/producto/producto.dto';
import { TokenService } from '../../../../services/token.service';
import { FondoAnimadoComponent } from '../../../../shared/fondo-animado/fondo-animado.component';
import { BodegaDto } from '../../../../dto/bodega/bodega.dto';
import { ToastService } from '../../../../components/toast/service/toast.service';

@Component({
  selector: 'app-ver-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FondoAnimadoComponent, FormsModule],
  templateUrl: './ver-productos.html',
  styleUrls: ['./ver-productos.css'],
})
export class VerProductos implements OnInit {
  // ===============================
  // 📌 Propiedades principales
  // ===============================
  productos: ProductoDto[] = [];
  bodegas: BodegaDto[] = [];

  // Paginación
  pagina = 0;
  size = 12;

  // Producto seleccionado + modal
  selected: ProductoDto | null = null;
  showModal = false;

  // Formularios (agregar / retiro)
  addForm!: FormGroup;
  retiroForm!: FormGroup;

  // Filtros de búsqueda
  filtroCodigo = '';
  filtroTipo = '';

  // Estados de carga
  loading = false;
  errorMessage = '';

  constructor(
    private srv: AuxiliarBodegaService,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private toastService: ToastService
  ) {}

  // ===============================
  // 🔄 Ciclo de vida
  // ===============================
  ngOnInit(): void {
    this.loadProductos(); // carga inicial de productos
    this.loadBodegas(); // carga inicial de bodegas
    this.buildForms(); // inicializa formularios
  }

  private buildForms() {
    this.addForm = this.fb.group({
      cantidad: [null, [Validators.required, Validators.min(1)]],
      descripcionMovimiento: [''],
    });

    this.retiroForm = this.fb.group({
      cantidad: [null, [Validators.required, Validators.min(1)]],
      descripcionMovimiento: [''],
    });
  }

  // ===============================
  // 📥 Carga de datos desde backend
  // ===============================
  loadProductos() {
    this.loading = true;
    this.srv
      .listarProductos({
        codigoProducto: this.filtroCodigo || undefined,
        tipoProducto: this.filtroTipo || undefined,
        pagina: this.pagina,
        size: this.size,
      })
      .subscribe({
        next: (data) => {
          this.productos = data || [];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  loadBodegas() {
    this.srv.listarBodegas().subscribe({
      next: (b) => (this.bodegas = b),
      error: (e) => console.error('Error bodegas', e),
    });
  }

  openDetail(product: ProductoDto) {
    this.selected = product;
    this.showModal = true;

    // Reset de formularios al abrir modal
    this.addForm.reset();
    this.retiroForm.reset();
  }

  closeModal() {
    this.showModal = false;
    this.selected = null;
  }

  // ===============================
  // ➕ Acción: agregar cantidad
  // ===============================
  onAddSubmit() {
    if (!this.selected) return;
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const dto = {
      codigoProducto: this.selected.codigoProducto,
      cantidad: this.addForm.value.cantidad,
      emailPersonalBodega: this.tokenService.getEmail() ?? '',
      descripcionMovimiento: this.addForm.value.descripcionMovimiento || undefined,
    };

    this.srv.agregarCantidadProducto(dto).subscribe({
      next: (res) => {
        this.toastService.show('Cantidad solicitada. Pendiente autorización', 'success');
        this.closeModal();
        this.loadProductos(); // refrescar lista
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // ===============================
  // ➖ Acción: retirar producto
  // ===============================
  onRetiroSubmit() {
    if (!this.selected) return;
    if (this.retiroForm.invalid) {
      this.retiroForm.markAllAsTouched();
      return;
    }

    const dto = {
      codigoProducto: this.selected.codigoProducto,
      cantidad: this.retiroForm.value.cantidad,
      emailPersonalBodega: this.tokenService.getEmail() ?? '',
      descripcionMovimiento: this.retiroForm.value.descripcionMovimiento || undefined,
    };

    this.srv.retiroProducto(dto).subscribe({
      next: (res) => {
        this.toastService.show('Retiro registrado correctamente', 'success');
        this.closeModal();
        this.loadProductos();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  fetchDetailFromServer(codigo: string) {
    this.srv.verDetalleProducto(codigo).subscribe({
      next: (p) => {
        this.selected = p; // actualizar con info más completa
      },
      error: (err) => console.error('Error detalle', err),
    });
  }
}
