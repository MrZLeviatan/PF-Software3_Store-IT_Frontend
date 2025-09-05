import { Component, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearClienteDto } from '../../../dto/homePage/registro/crear-cliente.dto';
import { TipoCliente } from '../../../dto/homePage/registro/tipo-cliente.enum';
import { UbicacionDto } from '../../../dto/common/ubicacion.dto';
import { UbicacionService } from './services/ubicacion.service';
import { TelefonoService } from './services/telefono.service';
import { Router } from '@angular/router';
import { ClienteService } from '../../../services/homePage/registroCliente.service';
import { ToastService } from '../../../components/toast/service/toast.service';
import intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-registro-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-clientes.html',
  styleUrl: './registro-clientes.css',
})
export class RegistroClientes implements AfterViewInit {
  esClienteNatural: boolean = true;
  formNatural: FormGroup;
  formJuridico: FormGroup;
  ubicacionActual: UbicacionDto | null = null;
  mostrarPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ubicacionService: UbicacionService,
    private telefonoService: TelefonoService,
    private router: Router,
    private clienteService: ClienteService,
    private toastService: ToastService // <-- Inyección del servicio toast
  ) {
    // Formulario Cliente Natural
    this.formNatural = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      telefono: ['', [Validators.required]],
      telefonoSecundario: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    // Formulario Cliente Jurídico
    this.formJuridico = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      nit: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      telefono: ['', [Validators.required]],
      telefonoSecundario: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  cambiarTipo(tipo: 'NATURAL' | 'JURIDICO') {
    this.esClienteNatural = tipo === 'NATURAL';
    if (this.esClienteNatural) this.formNatural.reset();
    else this.formJuridico.reset();

    setTimeout(() => this.inicializarTelefonos());
  }

  private inicializarTelefonos() {
    ['telNatural', 'telNaturalSec', 'telJuridico', 'telJuridicoSec'].forEach((id) =>
      this.telefonoService.inicializar(id)
    );
  }

  async obtenerUbicacion() {
    try {
      this.ubicacionActual = await this.ubicacionService.obtenerUbicacionActual();

      navigator.geolocation.getCurrentPosition(
        (position) => console.log('Posición obtenida:', position),
        (error) =>
          this.toastService.show('Error al obtener la posición. Permite ubicación.', 'error')
      );
      console.log('Ubicación obtenida:', this.ubicacionActual);
    } catch (error: any) {
      this.toastService.show(error.message || 'Error al obtener ubicación', 'error');
    }
  }

  irInicio() {
    this.router.navigate(['/']);
  }

  getErrorMessage(control: AbstractControl | null): string {
    if (!control?.errors) return '';
    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['pattern']) return 'Formato inválido';
    if (control.errors['email']) return 'Correo inválido';
    if (control.errors['minlength'])
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['maxlength'])
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    return 'Error en el campo';
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  ngAfterViewInit() {
    ['telNatural', 'telNaturalSec', 'telJuridico', 'telJuridicoSec'].forEach((id) => {
      this.telefonoService.inicializar(id);
    });
  }

  onSubmit() {
    if (this.esClienteNatural) {
      // 🔹 Sincronizar teléfonos en el form natural
      this.formNatural.patchValue({
        telefono: this.telefonoService.obtenerNumero('telNatural'),
        telefonoSecundario: this.telefonoService.obtenerNumero('telNaturalSec'),
      });
    } else {
      // 🔹 Sincronizar teléfonos en el form jurídico
      this.formJuridico.patchValue({
        telefono: this.telefonoService.obtenerNumero('telJuridico'),
        telefonoSecundario: this.telefonoService.obtenerNumero('telJuridicoSec'),
      });
    }

    // ✅ Verificar que la ubicación no sea null
    if (!this.ubicacionActual) {
      this.toastService.show('Debes dar permiso de ubicación antes de registrar.', 'error');
      this.limpiarTelefonos(); // 🔹 limpiar teléfonos si hay error
      return;
    }

    let dto: CrearClienteDto;

    if (this.esClienteNatural && this.formNatural.valid) {
      dto = {
        nombre: `${this.formNatural.value.nombre} ${this.formNatural.value.apellido}`,
        telefono: this.formNatural.value.telefono,
        codigoPais: this.telefonoService.obtenerCodigoPais('telNatural') ?? '',
        telefonoSecundario: this.formNatural.value.telefonoSecundario || null,
        codigoPaisSecundario: this.formNatural.value.telefonoSecundario
          ? this.telefonoService.obtenerCodigoPais('telNaturalSec') ?? undefined
          : undefined,
        user: {
          email: this.formNatural.value.email,
          password: this.formNatural.value.password,
        },
        ubicacion: this.ubicacionActual,
        tipoCliente: TipoCliente.NATURAL,
      };
    } else if (!this.esClienteNatural && this.formJuridico.valid) {
      dto = {
        nombre: this.formJuridico.value.nombre,
        telefono: this.formJuridico.value.telefono,
        codigoPais: this.telefonoService.obtenerCodigoPais('telJuridico') ?? '',
        telefonoSecundario: this.formJuridico.value.telefonoSecundario || null,
        codigoPaisSecundario: this.formJuridico.value.telefonoSecundario
          ? this.telefonoService.obtenerCodigoPais('telJuridicoSec') ?? undefined
          : undefined,
        user: {
          email: this.formJuridico.value.email,
          password: this.formJuridico.value.password,
        },
        ubicacion: this.ubicacionActual,
        tipoCliente: TipoCliente.JURIDICO,
        nit: this.formJuridico.value.nit,
      };
    } else {
      this.toastService.show('Formulario inválido', 'error');
      this.limpiarTelefonos(); // 🔹 limpiar teléfonos si hay error
      console.log('❌ Errores formNatural:', this.formNatural.errors, this.formNatural);
      console.log('❌ Errores formJuridico:', this.formJuridico.errors, this.formJuridico);
      return;
    }

    // ✅ Enviar DTO al backend
    this.clienteService.registrarCliente(dto).subscribe({
      next: (res) => {
        this.toastService.show(res.mensaje, 'success');
        this.limpiarTelefonos(); // 🔹 siempre limpiar después de éxito
      },
      error: (err) => {
        this.toastService.show(err?.error?.mensaje || 'Error inesperado', 'error');
        this.limpiarTelefonos(); // 🔹 siempre limpiar también después de error
      },
    });
  }

  /** 🔹 Método para limpiar los campos de teléfono */
  private limpiarTelefonos() {
    if (this.esClienteNatural) {
      this.formNatural.get('telefono')?.reset('');
      this.formNatural.get('telefonoSecundario')?.reset('');
      (document.getElementById('telNatural') as HTMLInputElement).value = '';
      (document.getElementById('telNaturalSec') as HTMLInputElement).value = '';
    } else {
      this.formJuridico.get('telefono')?.reset('');
      this.formJuridico.get('telefonoSecundario')?.reset('');
      (document.getElementById('telJuridico') as HTMLInputElement).value = '';
      (document.getElementById('telJuridicoSec') as HTMLInputElement).value = '';
    }
  }
}
