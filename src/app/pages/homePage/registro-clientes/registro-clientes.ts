import { CrearClienteGoogleDto } from './../../../dto/homePage/registro/crear-cliente-google.dto';
import { GoogleAuthService } from './services/google-auth.service';
import { GoogleValidateResponse } from '../../../dto/common/google-validation.dto';
import { CodigoVerificacionDto } from './../../../dto/common/codigo-verificacion.dto';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CrearClienteDto } from '../../../dto/homePage/registro/crear-cliente.dto';
import { TipoCliente } from '../../../dto/homePage/registro/tipo-cliente.enum';
import { UbicacionDto } from '../../../dto/common/ubicacion.dto';
import { UbicacionService } from './services/ubicacion.service';
import { TelefonoService } from './services/telefono.service';
import { Router } from '@angular/router';
import { ClienteService } from '../../../services/homePage/registroCliente.service';
import { ToastService } from '../../../components/toast/service/toast.service';

@Component({
  selector: 'app-registro-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './registro-clientes.html',
  styleUrl: './registro-clientes.css',
})
export class RegistroClientes implements AfterViewInit {
  esClienteNatural: boolean = true;
  formNatural: FormGroup;
  formJuridico: FormGroup;
  formCodigo: FormGroup; // ✅ Formulario para el código de verificación
  ubicacionActual: UbicacionDto | null = null;
  mostrarPassword: boolean = false;
  mostrarVerificacion: boolean = false; // ✅ Toggle para mostrar cuadro de verificación
  emailVerificacion: string = ''; // ✅ correo mostrado en modal
  private googlePayload: { name: string; email: string; picture?: string } | null = null;
  public esGoogle: boolean = false; // ✅ nuevo flag para controlar el bloqueo

  constructor(
    private fb: FormBuilder,
    private ubicacionService: UbicacionService,
    private telefonoService: TelefonoService,
    private router: Router,
    private clienteService: ClienteService,
    private toastService: ToastService,
    private googleAuth: GoogleAuthService,
    private cd: ChangeDetectorRef
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

    // ✅ Formulario para verificar el código
    this.formCodigo = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  cambiarTipo(tipo: 'NATURAL' | 'JURIDICO') {
    this.esClienteNatural = tipo === 'NATURAL';

    // 🔹 Reset de Google
    this.esGoogle = false;
    this.googlePayload = null;

    if (this.esClienteNatural) this.formNatural.reset();
    else this.formJuridico.reset();

    // 🔹 Rehabilitar campos deshabilitados
    this.formNatural.get('nombre')?.enable();
    this.formNatural.get('apellido')?.enable();
    this.formNatural.get('email')?.enable();

    setTimeout(() => this.inicializarGoogleButton(), 0);

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
    } catch (error: any) {
      this.toastService.show(error.message || 'Error al obtener ubicación', 'error');
    }
  }

  irInicio() {
    this.router.navigate(['/']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getErrorMessage(control: AbstractControl | null): string {
    if (!control?.errors) return '';
    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['pattern']) return 'Formato No Válido';
    if (control.errors['email']) return 'Formato de Correo No Válido';
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
    this.inicializarTelefonos();
    this.inicializarGoogleButton();
  }

  private inicializarGoogleButton() {
    this.googleAuth.initGoogleButton('googleButton', (payload: GoogleValidateResponse) => {
      this.onGoogleData(payload);
    });
  }

  private onGoogleData(payload: any) {
    console.log('📌 Payload recibido:', payload);

    const parts = (payload.name || '').trim().split(' ');
    const nombre = parts.shift() || '';
    const apellido = parts.join(' ') || '';

    this.formNatural.patchValue({
      nombre,
      apellido,
      email: payload.email,
    });

    // 🔹 Bloquea los campos
    this.formNatural.get('nombre')?.disable();
    this.formNatural.get('apellido')?.disable();
    this.formNatural.get('email')?.disable();

    this.esGoogle = true; // ✅ activa el flag de Google
    this.googlePayload = payload;

    this.cd.detectChanges();
    this.emailVerificacion = payload.email;
    this.toastService.show('Google: datos cargados, completa los campos faltantes', 'success');
  }

  onSubmit() {
    // Si es Google, enviamos directo sin verificador
    if (this.esGoogle && this.googlePayload) {
      if (!this.ubicacionActual) {
        this.toastService.show('Debes dar permiso de ubicación antes de registrar.', 'error');
        this.limpiarTelefonos();
        return;
      }

      const dtoGoogle: CrearClienteGoogleDto = {
        nombre: this.googlePayload.name,
        email: this.googlePayload.email,
        ubicacion: this.ubicacionActual!,
        password: this.formNatural.value.password,
        telefono: this.telefonoService.obtenerNumero('telNatural') ?? '',
        codigoPais: this.telefonoService.obtenerCodigoPais('telNatural') ?? '',
        telefonoSecundario: this.telefonoService.obtenerNumero('telNaturalSec') ?? undefined,
        codigoPaisSecundario: this.telefonoService.obtenerCodigoPais('telNaturalSec') ?? undefined,
      };

      this.clienteService.registrarClienteGoogle(dtoGoogle).subscribe({
        next: (res) => {
          this.toastService.show(res.mensaje, 'success');
          this.irInicio(); // 🚀 Redirige directo a la pantalla de inicio
        },
        error: (err) => {
          if (err.status === 400) {
            this.toastService.show(err?.error?.mensaje || 'Error inesperado', 'error');
            // 🔹 Formatear campos del formulario
            if (this.esClienteNatural) {
              this.formNatural.reset(); // limpia todos los campos
              (document.getElementById('telNatural') as HTMLInputElement).value = '';
              (document.getElementById('telNaturalSec') as HTMLInputElement).value = '';
              // 🔹 Bloquea los campos
              this.formNatural.get('nombre')?.enable();
              this.formNatural.get('apellido')?.enable();
              this.formNatural.get('email')?.enable();
            }
          } else if (err.status == 418) {
            this.toastService.show(err?.error?.mensaje || 'Error inesperado', 'error');
            this.limpiarTelefonos();
          } else {
            this.toastService.show(err?.error?.mensaje || 'Error inesperado', 'error');
          }
        },
      });

      return; // No ejecuta el flujo normal
    }

    // Si estamos en verificación → validar código
    if (this.mostrarVerificacion) {
      if (this.formCodigo.invalid) {
        this.toastService.show('Debes ingresar un código válido', 'error');
        return;
      }

      const codigoDto: CodigoVerificacionDto = {
        email: this.emailVerificacion,
        codigo: this.formCodigo.value.codigo,
      };

      this.clienteService.verificarRegistroCliente(codigoDto).subscribe({
        next: (res) => {
          this.toastService.show(res.mensaje, 'success');
          this.irInicio();
        },
        error: (err) => {
          this.toastService.show(err?.error?.mensaje || 'Código inválido', 'error');
        },
      });
      return;
    }

    // 🔹 Flujo normal de registro
    if (this.esClienteNatural) {
      this.formNatural.patchValue({
        telefono: this.telefonoService.obtenerNumero('telNatural'),
        telefonoSecundario: this.telefonoService.obtenerNumero('telNaturalSec'),
      });
    } else {
      this.formJuridico.patchValue({
        telefono: this.telefonoService.obtenerNumero('telJuridico'),
        telefonoSecundario: this.telefonoService.obtenerNumero('telJuridicoSec'),
      });
    }

    if (!this.ubicacionActual) {
      this.toastService.show('Debes dar permiso de ubicación antes de registrar.', 'error');
      this.limpiarTelefonos();
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
      this.emailVerificacion = this.formNatural.value.email;
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
      this.emailVerificacion = this.formJuridico.value.email;
    } else {
      this.toastService.show('Formulario inválido', 'error');
      this.limpiarTelefonos();
      return;
    }

    // 🔹 Enviar registro normal → activa verificador
    this.clienteService.registrarCliente(dto).subscribe({
      next: (res) => {
        this.toastService.show(res.mensaje, 'success');
        this.mostrarVerificacion = true; // ✅ muestra el modal de código
      },
      error: (err) => {
        if (err.status === 400) {
          this.toastService.show(err?.error?.mensaje || 'Error inesperado', 'error');
          // 🔹 Formatear campos del formulario
          if (this.esClienteNatural) {
            this.formNatural.reset(); // limpia todos los campos
            (document.getElementById('telNatural') as HTMLInputElement).value = '';
            (document.getElementById('telNaturalSec') as HTMLInputElement).value = '';
          } else {
            this.formJuridico.reset();
            (document.getElementById('telJuridico') as HTMLInputElement).value = '';
            (document.getElementById('telJuridicoSec') as HTMLInputElement).value = '';
          }
        } else if (err.status == 418) {
          this.toastService.show(err?.error?.mensaje || 'Error inesperado', 'error');
          this.limpiarTelefonos();
        } else {
          this.toastService.show(err?.error?.mensaje || 'Error inesperado', 'error');
        }
      },
    });
  }

  private limpiarTelefonos() {
    if (this.esClienteNatural) {
      this.formNatural.get('telefono')?.reset('');
      this.formNatural.get('telefonoSecundario')?.reset('');
      this.formNatural.get('password')?.reset('');
      (document.getElementById('telNatural') as HTMLInputElement).value = '';
      (document.getElementById('telNaturalSec') as HTMLInputElement).value = '';
    } else {
      this.formJuridico.get('telefono')?.reset('');
      this.formJuridico.get('telefonoSecundario')?.reset('');
      this.formJuridico.get('password')?.reset('');
      (document.getElementById('telJuridico') as HTMLInputElement).value = '';
      (document.getElementById('telJuridicoSec') as HTMLInputElement).value = '';
    }
  }

  confirmarVerificacion() {
    this.onSubmit();
  }

  cancelarVerificacion() {
    this.mostrarVerificacion = false;
    this.formCodigo.reset();

    // 🔹 Resetear el formulario completo
    if (this.formNatural) {
      this.formNatural.reset();
    } else if (this.formJuridico) {
      this.formJuridico.reset();
    }

    // 🔹 Borrar también la ubicación seleccionada
    this.ubicacionActual = null;

    // 🔹 Borrar el código de verificación
    this.emailVerificacion = '';
  }

  forzarMayusculas(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase(); // 🔹 Convierte en mayúsculas
    this.formCodigo.get('codigo')?.setValue(input.value, { emitEvent: false });
  }
}
