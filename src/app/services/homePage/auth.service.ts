import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDto } from '../../dto/homePage/login/login.dto';
import { VerificacionCodigoDto } from '../../dto/homePage/login/verificacion-login.dto';
import { TokenDto } from '../../dto/token.dto';
import { map } from 'rxjs/operators';
import { GoogleValidateResponse } from '../../dto/common/google-validation.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth'; // URL del backend

  constructor(private http: HttpClient) {}

  login(loginDto: LoginDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginDto);
  }

  loginConGoogle(idToken: string): Observable<GoogleValidateResponse> {
    return this.http.post<GoogleValidateResponse>(`${this.baseUrl}/login-google`, { idToken });
  }

  verificarLogin(dto: VerificacionCodigoDto): Observable<TokenDto> {
    return this.http
      .post<{ error: boolean; mensaje: TokenDto }>(`${this.baseUrl}/login-verificación`, dto)
      .pipe(
        map((res) => res.mensaje) // extraemos el token dentro de mensaje
      );
  }
}
