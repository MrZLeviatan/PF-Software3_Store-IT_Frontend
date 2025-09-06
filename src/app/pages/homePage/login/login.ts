import { ValidarLoginService } from './service/validarLogin.service';
import { VerificacionCodigoDto } from './../../../dto/homePage/login/verificacion-login.dto';
import { TokenDto } from './../../../dto/token.dto';
import { LoginDto } from './../../../dto/homePage/login/login.dto';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../components/toast/service/toast.service';
import { AuthService } from '../../../services/homePage/auth.service';
import { TokenService } from '../../../services/token.service';
import { GoogleAuthService } from './service/google-login.service';
import { GoogleValidateResponse } from '../../../dto/common/google-validation.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements AfterViewInit {
  mostrarPassword: boolean = false;
  loginForm: FormGroup;

  mostrarVerificacion: boolean = false;
  emailVerificacion: string = '';
  formCodigo: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private tokenService: TokenService,
    private validarLoginService: ValidarLoginService,
    private googleAuthService: GoogleAuthService,
    private cd: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.formCodigo = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  ngAfterViewInit(): void {
    this.inicializarBotonGoogle();
  }

  private inicializarBotonGoogle() {
    // Inicializamos el botón Google en el div con id="googleBtn"
    this.googleAuthService.initGoogleButton('googleBtn', (payload: GoogleValidateResponse) => {
      this.loginGoogleData(payload);
    });
  }

  private loginGoogleData(payload: any) {
    // Si Google valida, abrimos la verificación igual que con el login normal
    this.emailVerificacion = payload.email;
    this.mostrarVerificacion = true;
    this.cd.detectChanges();
    this.toastService.show('Se envió un código de verificación a tu correo', 'success');
  }

  irInicio() {
    this.router.navigate(['/']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastService.show('Por favor completa todos los campos correctamente', 'error');
      return;
    }

    const loginData: LoginDto = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: () => {
        this.emailVerificacion = loginData.email;
        this.mostrarVerificacion = true;
        this.toastService.show('Se envió un código de verificación a tu correo', 'success');
      },
      error: () => {
        // Errores capturados por interceptor
      },
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  confirmarVerificacion() {
    if (this.formCodigo.invalid) {
      this.toastService.show('Debes ingresar un código válido', 'error');
      return;
    }

    const dto: VerificacionCodigoDto = {
      email: this.emailVerificacion,
      codigo: this.formCodigo.value.codigo,
    };

    this.authService.verificarLogin(dto).subscribe({
      next: (res: TokenDto) => {
        this.tokenService.saveToken(res.token);
        console.log('Token recibido:', res.token);
        console.log('Decode Token: ', this.tokenService.decodeToken(res.token));

        this.validarLoginService.redirigirSegunRol();
        this.mostrarVerificacion = false;
        this.formCodigo.reset();
        this.loginForm.reset();
        this.toastService.show('Login verificado con éxito', 'success');
      },
    });
  }

  cancelarVerificacion() {
    this.mostrarVerificacion = false;
    this.formCodigo.reset();
    this.loginForm.reset();
    this.toastService.show('Necesita autentificar para iniciar sesión', 'error');
  }

  forzarMayusculas(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.formCodigo.get('codigo')?.setValue(input.value, { emitEvent: false });
  }
}
