import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopBar } from '../../components/top-bar/top-bar';

@Component({
  selector: 'app-layout-publico',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopBar],
  templateUrl: './layout-publico.component.html',
})
export class LayoutPublicoComponent {}
