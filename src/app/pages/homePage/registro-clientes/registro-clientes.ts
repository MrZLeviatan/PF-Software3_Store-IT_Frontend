import { ValidarLoginService } from './../login/service/validarLogin.service';
import { routes } from './../../../app.routes';
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
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { RegistroClienteService } from '../../../services/homePage/registroCliente.service';
import { ToastService } from '../../../components/toast/service/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registro-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
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

  email: string = '';
  codigo: string = '';
  verificado: boolean | null = null;

  constructor(
    private fb: FormBuilder,
    private ubicacionService: UbicacionService,
    private telefonoService: TelefonoService,
    private router: Router,
    private clienteService: RegistroClienteService,
    private toastService: ToastService,
    private googleAuth: GoogleAuthService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private location: Location
  ) {
    // Patrón: al menos 8 caracteres, 1 mayúscula, 1 número, 1 minuscula
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // Formulario Cliente Natural
    this.formNatural = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      telefono: ['', [Validators.required]],
      telefonoSecundario: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
    });

    // Formulario Cliente Jurídico
    this.formJuridico = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      nit: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      telefono: ['', [Validators.required]],
      telefonoSecundario: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
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
    if (control.errors['email']) return 'Formato de Correo No Válido';
    if (control.errors['minlength'])
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['maxlength'])
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.errors['pattern']) {
      // Si el control es el password, mostrar mensaje específico
      if (
        control === this.formNatural?.get('password') ||
        control === this.formJuridico?.get('password')
      ) {
        return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minuscula y un número';
      }
      return 'Formato No Válido';
    }

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
          this.irInicio(); // Redirige directo a la pantalla de inicio
        },
        error: (err) => {
          if (err.status === 400) {
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
            this.limpiarTelefonos();
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
        error: (err) => {},
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
          this.limpiarTelefonos();
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

  ngOnInit(): void {
    // Leer la parte del hash de la URL
    const hash = this.location.path(true); // true = incluye query params
    const queryIndex = hash.indexOf('?');
    if (queryIndex !== -1) {
      const queryString = hash.substring(queryIndex + 1);
      const params = new URLSearchParams(queryString);
      this.email = params.get('email') || '';
      this.codigo = params.get('codigo') || '';

      if (this.email && this.codigo) {
        this.verificarLink(this.email, this.codigo); // 🔹 llamar al método modificado
      }
    }
  }

  // Función actualizada para usar GET
  verificarLink(email: string, codigo: string) {
    this.clienteService.verificarLink(email, codigo).subscribe({
      next: (res) => {
        console.log('Cuenta verificada', res);
        this.verificado = true;
        this.toastService.show('Cuenta verificada con éxito', 'success');
      },
      error: (err) => {
        console.error('Error verificando cuenta', err);
        this.verificado = false;
        this.toastService.show('Error al verificar la cuenta', 'error');
      },
    });
  }
}
