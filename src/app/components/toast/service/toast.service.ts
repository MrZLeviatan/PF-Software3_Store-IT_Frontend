import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  message: string;
  type: ToastType;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toasts = new BehaviorSubject<Toast[]>([]);
  public readonly toasts$ = this._toasts.asObservable();

  get toasts(): Toast[] {
    return this._toasts.value;
  }

  show(message: string, type: ToastType = 'info', duration: number = 5000) {
    const toast: Toast = { message, type, duration };
    this._toasts.next([...this.toasts, toast]);

    setTimeout(() => this.remove(toast), duration);
  }

  remove(toast: Toast) {
    this._toasts.next(this.toasts.filter((t) => t !== toast));
  }
}
