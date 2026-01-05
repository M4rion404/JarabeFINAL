import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Importamos el decodificador

interface LoginResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://localhost:3000/auth';

  // Creamos un Signal para el usuario.
  // Al iniciar, intenta cargar lo que haya en el localStorage.
  private userSignal = signal<any>(this.decodeToken(this.getToken()));

  // Exponemos el usuario como una señal de solo lectura para los componentes
  public user = computed(() => this.userSignal());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { email, password }).pipe(
      tap((res) => this.saveToken(res.accessToken)) // Actualiza el usuario al loguear
    );
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.API_URL.replace('/auth', '/users')}/register`, {
      name,
      email,
      password,
    });
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.userSignal.set(this.decodeToken(token)); // Actualizamos el signal con los nuevos datos
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private decodeToken(token: string | null): any {
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      console.log('Objeto decodificado del token:', decoded); // <--- MIRA ESTO EN LA CONSOLA (F12)

      // Retornamos el objeto tal cual viene del token
      return {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name, // <--- Asegúrate que dice 'name' y no 'userName' o algo así
      };
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return null;
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    this.userSignal.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
