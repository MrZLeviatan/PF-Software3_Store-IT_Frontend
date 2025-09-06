import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs';
import { ToastService } from '../components/toast/service/toast.service';
import { throwError } from 'rxjs';

export const HttpToastInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    // No hacemos nada en tap, porque no queremos mostrar toasts para respuestas exitosas
    catchError((err) => {
      const body = err.error;
      // Solo mostramos toast si el backend envía MensajeDto con error === true
      if (body && 'error' in body && body.error && 'mensaje' in body) {
        toastService.show(body.mensaje, 'error');
      } else {
        toastService.show('Ocurrió un error inesperado', 'error');
      }
      return throwError(() => err);
    })
  );
};
