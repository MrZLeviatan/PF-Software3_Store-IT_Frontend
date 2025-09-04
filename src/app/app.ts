import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './pages/homePage/home/home';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Home],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('PF-Software3_Store-IT_Frontend');
}
