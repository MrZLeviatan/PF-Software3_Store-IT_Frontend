import { Component } from '@angular/core';
import { ToastService } from './service/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  constructor(public toastService: ToastService) {}
}
