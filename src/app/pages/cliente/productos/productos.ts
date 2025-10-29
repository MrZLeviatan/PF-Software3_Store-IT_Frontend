import { Component, OnInit, OnDestroy } from '@angular/core'; // EN/ES: lifecycle hooks
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FondoAnimadoComponent } from '../../../shared/fondo-animado/fondo-animado.component';
import { ProductoService } from '../../../services/inventario/producto.service';
import { ProductoDto } from '../../../dto/objects/inventario/producto/producto.dto';
import { TipoProducto } from '../../../dto/enum/tipo-producto';
import { timer, Subject, takeUntil, switchMap, catchError, of } from 'rxjs';
import { CarritoCompraService } from '../../../services/compra/carrito-compra.service';
import { TokenService } from '../../../services/token.service';
import { ToastService } from '../../../components/toast/service/toast.service';
import { RegistroItemCompraDto } from '../../../dto/objects/compra/carrito-compra/registro-items-carrito.dto';

//Componente standalone para pasarela de productos
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, FondoAnimadoComponent],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit, OnDestroy {
  // EN/ES: Data containers
  productos: ProductoDto[] = []; // all products from backend / todos los productos del backend
  productosFiltrados: ProductoDto[] = []; // filtered list shown in UI / lista filtrada mostrada
  tipos: string[] = Object.values(TipoProducto); // EN/ES: product types from enum / tipos de producto

  // EN/ES: Filter state
  filtroBusqueda = ''; // search by name or barcode / búsqueda por nombre o código
  filtroTipo = ''; // selected type filter / filtro de tipo seleccionado

  // EN/ES: UI state
  loading = false;
  errorMessage = '';
  showModal = false;
  selected: ProductoDto | null = null;

  // EN/ES: RxJS cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private productoService: ProductoService,
    private carritoCompraService: CarritoCompraService,
    private tokenService: TokenService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // EN/ES: Start polling immediately and every 10 minutes (600000 ms)
    // Starts with immediate emission (0) so we load data on enter
    timer(0, 600000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          this.loading = true;
          this.errorMessage = '';
          // Call service; returns MensajeDto<ProductoDto[]>
          return this.productoService.listarProductos().pipe(
            catchError((err) => {
              // EN/ES: handle error but return an empty response so stream continues
              console.error('Error loading products', err);
              this.errorMessage = 'Error al cargar productos. Intente de nuevo más tarde.';
              this.loading = false;
              return of({ error: true, respuesta: [] as ProductoDto[] });
            })
          );
        })
      )
      .subscribe({
        next: (res: any) => {
          // EN/ES: backend envelope: MensajeDto.respuesta
          this.productos = Array.isArray(res?.mensaje) ? res.mensaje : [];
          this.filtrarProductos(); // EN/ES: update visible list after loading
          this.loading = false;
        },
        error: (err) => {
          // Shouldn't usually arrive here because catchError above handles it
          console.error('Subscription error', err);
          this.errorMessage = 'Error inesperado al cargar productos.';
          this.loading = false;
        },
      });
  }

  // EN/ES: Filter products locally based on search text and type selection
  filtrarProductos(): void {
    const search = (this.filtroBusqueda || '').toLowerCase().trim();
    this.productosFiltrados = this.productos.filter((p) => {
      const matchTipo = !this.filtroTipo || (p.tipoProducto && p.tipoProducto === this.filtroTipo);
      const matchSearch =
        !search ||
        (p.nombre && p.nombre.toLowerCase().includes(search)) ||
        (p.codigoBarras && p.codigoBarras.toLowerCase().includes(search));
      return matchTipo && matchSearch;
    });
  }

  // EN/ES: Open modal with product detail
  verDetalle(p: ProductoDto): void {
    this.selected = p;
    this.showModal = true;
  }

  // EN/ES: Close modal and clear selection
  cerrarModal(): void {
    this.showModal = false;
    this.selected = null;
  }

  ngOnDestroy(): void {
    // EN/ES: Clean up subscriptions when component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }

  agregarAlCarrito(productoId: number): void {
    // Construir el DTO completo en el componente
    const dto: RegistroItemCompraDto = {
      idProducto: productoId,
      cantidad: 1, // siempre 1 producto
      idCliente: this.tokenService.getUserIdFromToken(), // obtener idCliente desde el token
    };

    // Enviar al servicio
    this.carritoCompraService.agregarProducto(dto).subscribe({
      next: (res) => {
        this.toastService.show('Productos agregado correctamente', 'success');
      },
    });
  }
}
