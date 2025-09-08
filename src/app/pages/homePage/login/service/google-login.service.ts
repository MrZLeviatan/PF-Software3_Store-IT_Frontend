import { Injectable, NgZone } from '@angular/core';
import { GoogleValidateResponse } from '../../../../dto/common/google-validation.dto';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../../../../services/homePage/auth.service';
import { ToastService } from '../../../../components/toast/service/toast.service';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private clientId = '79690855058-fojmhksrcau0tbvjlvfd10sifun3ght9.apps.googleusercontent.com';

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private ngZone: NgZone // 👈 Importante
  ) {}

  initGoogleButton(elementId: string, callback: (payload: GoogleValidateResponse) => void): void {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) =>
        // 👇 Ejecutamos dentro de Angular
        this.ngZone.run(() => this.handleCredentialResponse(response, callback)),
    });

    google.accounts.id.renderButton(document.getElementById(elementId), {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
    });
  }

  private handleCredentialResponse(
    response: any,
    callback: (payload: GoogleValidateResponse) => void
  ) {
    const idToken = response?.credential;
    if (!idToken) return;

    this.loginWithGoogle(idToken).subscribe({
      next: (payload) => callback(payload),
      error: (err) => {
        // ✅ Ahora Angular sí detecta el cambio y mostrará el toast
        this.ngZone.run(() => {});
      },
    });
  }

  loginWithGoogle(idToken: string): Observable<any> {
    return this.authService.loginConGoogle(idToken).pipe(map((res: any) => res.mensaje));
  }
}
