import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FondoAnimadoComponent } from '../../../../shared/fondo-animado/fondo-animado.component';
import { AuxiliarBodegaService } from '../../../../services/auxiliarBodega/auxiliarProductos.service';
import { BodegaDto } from '../../../../dto/bodega/bodega.dto';

@Component({
  selector: 'app-registrar-productos-auxiliar',
  imports: [CommonModule, ReactiveFormsModule, FondoAnimadoComponent],
  templateUrl: './registrar-productos-auxiliar.html',
  styleUrls: ['./registrar-productos-auxiliar.css'],
})
export class RegistrarProductosAuxiliar implements OnInit {
  productoForm: FormGroup;
  tiposProducto = ['Electrónica', 'Muebles', 'Ropa', 'Otros']; // ejemplo
  dragging = false;
  imagenProducto: File | null = null;
  imagenNombre = '';
  imagenSize = '';
  bodegas: BodegaDto[] = []; // lista Bodegas

  constructor(private fb: FormBuilder, private auxiliarService: AuxiliarBodegaService) {
    this.productoForm = this.fb.group({
      codigoProducto: ['', Validators.required],
      nombre: ['', Validators.required],
      cantidad: [null, Validators.required],
      descripcion: ['', Validators.required],
      tipoProducto: ['', Validators.required],
      idBodega: [''],
      descripcionMovimiento: [''],
    });
  }

  onSubmit() {
    if (this.productoForm.valid) {
      const formData = new FormData();
      Object.keys(this.productoForm.value).forEach((key) => {
        formData.append(key, this.productoForm.value[key]);
      });
      if (this.imagenProducto) {
        formData.append('imagenProducto', this.imagenProducto);
      }

      console.log('Datos a enviar:', formData);
      // Aquí llamas al servicio para enviar el DTO al backend
    }
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
  }

  resetFile() {
    this.imagenProducto = null;
    this.imagenNombre = '';
    this.imagenSize = '';
  }
}
