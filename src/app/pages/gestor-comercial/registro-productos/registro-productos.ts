import { Component, OnInit } from '@angular/core';
import { FondoAnimadoComponent } from '../../../shared/fondo-animado/fondo-animado.component';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

// DTO's
import { RegistroProveedorDto } from '../../../dto/users/registro-proveedor.dto';
import { ProveedorDto } from '../../../dto/users/proveedor.dto';
import { RegistroProductoDto } from '../../../dto/objects/inventario/producto/registro-producto';
import { ProductoDto } from '../../../dto/objects/inventario/producto/producto.dto';
import { TipoProducto } from '../../../dto/enum/tipo-producto';
import { RegistroEspacioProductoDto } from '../../../dto/objects/almacen/espacioProducto/registro-espacio-producto.dto';
import { RegistroUnidadAlmacenamientoDto } from '../../../dto/common/unidad-almacenamiento/registro-unidad-almacenamiento.dto';

// Services
import { ProveedorService } from '../../../services/users/proveedor.service';
import { ProductoService } from '../../../services/inventario/producto.service';
import { ToastService } from '../../../components/toast/service/toast.service';
import { EspacioProductoService } from '../../../services/almacen/espacio-producto.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-registro-productos',
  standalone: true,
  imports: [FondoAnimadoComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro-productos.html',
  styleUrls: ['./registro-productos.css'],
})
export class RegistroProductos implements OnInit {
  // === PASOS ===
  pasoActual: number = 1; // 1 = Proveedor, 2 = Producto

  // === PROVEEDORES ===
  proveedores: ProveedorDto[] = [];
  proveedoresFiltrados: ProveedorDto[] = [];
  proveedorSeleccionado: ProveedorDto | null = null;
  busqueda: string = '';
  imagenPreview: string | null = null;
  imagenSeleccionada: File | null = null;
  tiposProducto = Object.values(TipoProducto);

  // Espacio Producto
  idProductoRegistrado!: number;
  idGestor!: number;

  // === FORMULARIOS ===
  formProveedor!: FormGroup;
  formProducto!: FormGroup;
  formEspacio!: FormGroup;

  mostrarFormularioProveedor: boolean = false;

  constructor(
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private espacioProductoService: EspacioProductoService,
    private toastService: ToastService,
    private tokenService: TokenService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();

    // 🇪🇸 Obtener ID del gestor desde el token / 🇺🇸 Get gestor ID from token
    const id = this.tokenService.getUserIdFromToken();
    if (id) {
      this.idGestor = id;
    } else {
      this.toastService.show('No se pudo obtener el ID del gestor.', 'error');
    }

    // Formulario proveedor
    this.formProveedor = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      marca: ['', [Validators.required]],
    });

    // Formulario producto
    this.formProducto = this.fb.group({
      codigoBarras: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z0-9]{4}-[A-Za-z0-9]{3}$/)],
      ],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      valorCompra: ['', [Validators.required, Validators.min(1)]],
      tipoProducto: ['', Validators.required],
      imagenProducto: [null],
    });

    this.formEspacio = this.fb.group({
      largo: ['', [Validators.required, Validators.min(1)]],
      ancho: ['', [Validators.required, Validators.min(1)]],
      alto: ['', [Validators.required, Validators.min(1)]],
      descripcion: [''],
    });
  }

  // === PROVEEDORES ===
  cargarProveedores(): void {
    this.proveedorService.listarProveedores().subscribe({
      next: (res) => {
        this.proveedores = res.mensaje || [];
        this.proveedoresFiltrados = [...this.proveedores];
      },
      error: (err) => console.error('Error al cargar proveedores:', err),
    });
  }

  seleccionarProveedor(proveedor: ProveedorDto): void {
    this.proveedorSeleccionado = proveedor;
  }

  filtrarProveedores(): void {
    const texto = this.busqueda.toLowerCase();
    this.proveedoresFiltrados = this.proveedores.filter(
      (p) => p.nombre.toLowerCase().includes(texto) || p.marca.toLowerCase().includes(texto)
    );
  }

  // === Registrar proveedor ===
  registrarProveedor(): void {
    // 🇪🇸 Validar el formulario / 🇺🇸 Validate form
    if (this.formProveedor.invalid) {
      this.formProveedor.markAllAsTouched();
      return;
    }

    // 🇪🇸 Crear DTO desde el formulario / 🇺🇸 Create DTO from form data
    const dto: RegistroProveedorDto = {
      nombre: this.formProveedor.get('nombre')?.value,
      email: this.formProveedor.get('email')?.value,
      telefono: this.formProveedor.get('telefono')?.value,
      marca: this.formProveedor.get('marca')?.value,
    };

    // 🇪🇸 Llamar al servicio / 🇺🇸 Call the provider service
    this.proveedorService.registrarProveedor(dto).subscribe({
      next: (res) => {
        // 🇪🇸 Mostrar éxito / 🇺🇸 Show success message
        this.toastService.show('Proveedor registrado con éxito.', 'success');

        // 🇪🇸 Actualizar lista de proveedores / 🇺🇸 Refresh providers list
        this.cargarProveedores();

        // 🇪🇸 Cerrar formulario / 🇺🇸 Close form
        this.mostrarFormularioProveedor = false;
        this.formProveedor.reset();

        // 🇪🇸 Seleccionar automáticamente el proveedor recién creado / 🇺🇸 Auto-select new provider
        this.proveedorSeleccionado = res.mensaje;

        // 🇪🇸 Pasar al paso 2 directamente / 🇺🇸 Move to step 2 automatically
        this.pasoActual = 2;
      },
      error: (err) => {
        console.error('Error al registrar proveedor:', err);
        this.toastService.show('Error al registrar el proveedor.', 'error');
      },
    });
  }

  // === ERRORES ===
  getErrorMessage(control: any): string {
    if (!control) return '';
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('minlength')) return 'Debe tener más caracteres.';
    if (control.hasError('email')) return 'Correo inválido.';
    if (control.hasError('pattern')) return 'Formato inválido.';
    if (control.hasError('min')) return 'Debe ser mayor a 0.';
    return '';
  }

  // === CONTROL DE PASOS ===
  continuarPaso2(): void {
    if (!this.proveedorSeleccionado) {
      return;
    }
    this.pasoActual = 2;
  }

  volverPaso1(): void {
    this.pasoActual = 1;
    this.formProducto.reset();
    this.imagenPreview = null;
    this.proveedorSeleccionado = null;
  }

  irPaso3(idProducto: number): void {
    this.idProductoRegistrado = idProducto; // Gurdamos el ID del producto
    this.pasoActual = 3;
  }

  cerrarFormulario(): void {
    this.mostrarFormularioProveedor = false;
    this.formProveedor.reset();
  }

  // === PRODUCTOS ===
  // === Registrar producto ===
  registrarProducto(): void {
    if (this.formProducto.invalid) {
      this.formProducto.markAllAsTouched();
      return;
    }

    if (!this.proveedorSeleccionado) {
      this.toastService.show(
        'Debe seleccionar un proveedor antes de registrar el producto.',
        'error'
      );
      return;
    }

    // === Crear FormData ===
    const formData = new FormData();
    formData.append('codigoBarras', this.formProducto.get('codigoBarras')?.value || '');
    formData.append('nombre', this.formProducto.get('nombre')?.value || '');
    formData.append('valorCompra', this.formProducto.get('valorCompra')?.value || '');
    formData.append('tipoProducto', this.formProducto.get('tipoProducto')?.value || '');
    formData.append('idProveedor', String(this.proveedorSeleccionado.id));

    // 🇪🇸 Adjuntar la imagen si existe / 🇺🇸 Attach image if exists
    if (this.imagenSeleccionada) {
      formData.append('imagenProducto', this.imagenSeleccionada);
    }

    // Llamamos al servicio y al completar, pasamos al paso 3
    this.productoService.registrarProducto(formData).subscribe({
      next: (res) => {
        const idProducto = res.mensaje.id; // Obtenemos el ID del producto registrado
        this.irPaso3(idProducto); // Pasamos al siguiente paso
        this.toastService.show('Producto registrado correctamente.', 'success');
      },
      error: () => this.toastService.show('Error al registrar el producto.', 'error'),
    });
  }

  // Formatea el código de barras mientras el usuario escribe
  formatearCodigoBarras(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/[^a-zA-Z0-9]/g, '');

    // Limitar a 7 dígitos
    if (valor.length > 7) {
      valor = valor.slice(0, 7);
    }

    // Insertar guion después del 4º dígito
    if (valor.length > 4) {
      valor = valor.slice(0, 4) + '-' + valor.slice(4);
    }

    input.value = valor;
    this.formProducto.get('codigoBarras')?.setValue(valor, { emitEvent: false });
  }

  // === Cargar y mostrar vista previa de la imagen ===
  onImagenSeleccionada(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imagenPreview = e.target.result);
      reader.readAsDataURL(file);
      this.formProducto.patchValue({ imagenProducto: file });
    }
  }

  registrarEspacioProducto(): void {
    if (this.formEspacio.invalid) {
      this.formEspacio.markAllAsTouched();
      return;
    }

    const dto: RegistroEspacioProductoDto = {
      unidadAlmacenamiento: {
        largo: this.formEspacio.get('largo')?.value,
        ancho: this.formEspacio.get('ancho')?.value,
        alto: this.formEspacio.get('alto')?.value,
      },
      idSubBodega: this.formEspacio.get('idSubBodega')?.value,
      idGestor: this.idGestor, // ✅ tomado del token
      idProducto: this.idProductoRegistrado,
      descripcion: this.formEspacio.get('descripcion')?.value,
    };

    const formData = new FormData();
    formData.append(
      'espacioProducto',
      new Blob([JSON.stringify(dto)], { type: 'application/json' })
    );

    this.espacioProductoService.registroEspacioProductoDto(formData).subscribe({
      next: () => {
        this.toastService.show('Espacio del producto registrado correctamente.', 'success');
        this.formEspacio.reset();
        this.pasoActual = 1;
      },
      error: () => this.toastService.show('Error al registrar el espacio del producto.', 'error'),
    });
  }
}
