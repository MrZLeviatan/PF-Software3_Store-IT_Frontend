import { Toast } from './../../../../components/toast/toast';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FondoAnimadoComponent } from '../../../../shared/fondo-animado/fondo-animado.component';
import { AuxiliarBodegaService } from '../../../../services/auxiliarBodega/auxiliarProductos.service';
import { BodegaDto } from '../../../../dto/bodega/bodega.dto';
import { TokenService } from '../../../../services/token.service';
import { ToastService } from '../../../../components/toast/service/toast.service';

@Component({
  selector: 'app-registrar-productos-auxiliar',
  imports: [CommonModule, ReactiveFormsModule, FondoAnimadoComponent],
  templateUrl: './registrar-productos-auxiliar.html',
  styleUrls: ['./registrar-productos-auxiliar.css'],
})
export class RegistrarProductosAuxiliar implements OnInit {
  productoForm: FormGroup;
  tiposProducto = ['FRAGIL', 'ESTANDAR']; // ejemplo
  dragging = false;
  imagenProducto: File | null = null;
  imagenNombre = '';
  imagenSize = '';
  imagenPreview: string | null = null; //  Vista previa
  bodegas: BodegaDto[] = []; // lista Bodegas

  constructor(
    private fb: FormBuilder,
    private auxiliarService: AuxiliarBodegaService,
    private TokenService: TokenService,
    private toastService: ToastService
  ) {
    this.productoForm = this.fb.group({
      codigoProducto: ['', [Validators.required, Validators.minLength(4)]], // mínimo 4 caracteres
      nombre: ['', Validators.required],
      cantidad: [null, Validators.required],
      descripcion: ['', Validators.required],
      tipoProducto: ['', Validators.required],
      idBodega: ['', Validators.required],
      descripcionMovimiento: [''], // puede quedar vacío
      imagenProducto: [null, Validators.required], // Nueva validación para imagen
    });
  }

  onSubmit() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const dto = {
      ...this.productoForm.value,
      imagenProducto: this.imagenProducto, // file real
      emailPersonalBodega: this.TokenService.getEmail() ?? '',
    };

    this.auxiliarService.registrarProducto(dto).subscribe({
      next: (res) => {
        this.productoForm.reset();
        this.resetFile();
        this.toastService.show(
          'Producto registrado correctamente. Pendiente de autorización.',
          'success'
        );
      },
      error: (err) => {},
    });
  }

  ngOnInit(): void {
    this.cargarBodegas();
  }

  /* Seccion para cargar las bodegas */

  cargarBodegas(): void {
    this.auxiliarService.listarBodegas().subscribe({
      next: (data) => {
        this.bodegas = data;
      },
      error: (err) => {
        console.error('Error al cargar bodegas', err);
      },
    });
  }

  /* Seccion para las imagenes y fotos */
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.setFile(file);
    }
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;
    if (event.dataTransfer?.files.length) {
      this.setFile(event.dataTransfer.files[0]);
    }
  }

  setFile(file: File) {
    this.imagenProducto = file;
    this.imagenNombre = file.name;
    this.imagenSize = (file.size / 1024).toFixed(2) + ' KB';
    this.productoForm.get('imagenProducto')?.setValue(file); // ✅ vincular al form
    this.productoForm.get('imagenProducto')?.markAsTouched();

    // Generar vista previa con FileReader
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  resetFile() {
    this.imagenProducto = null;
    this.imagenNombre = '';
    this.imagenSize = '';
    this.productoForm.get('imagenProducto')?.reset(); // impiar en form
    this.imagenPreview = null;
  }
}
