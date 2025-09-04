import { Component } from '@angular/core';
import { FondoAnimadoComponent } from '../../../shared/fondo-animado/fondo-animado.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FondoAnimadoComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private router: Router) {}

  // ✅ Navega a la sección de contacto
  irAContacto() {
    this.router.navigate(['/contacto']);
  }
}
