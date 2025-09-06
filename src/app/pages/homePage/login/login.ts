import { LoginDto } from './../../../dto/homePage/login/login.dto';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/homePage/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  mostrarPassword: boolean = false;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
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
      // Si el formulario es inválido, el interceptor no se activa, por eso aún mostramos un toast manual
      alert('Por favor completa todos los campos correctamente'); // O reemplaza con un toast local si quieres
      return;
    }

    const loginData: LoginDto = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: () => {
        // Ya no es necesario mostrar toast de éxito aquí, el interceptor lo hará
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        // Tampoco necesitamos mostrar error manual, el interceptor lo hará
      },
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  loginWithGoogle() {
    // Lógica para Google OAuth
  }
}
