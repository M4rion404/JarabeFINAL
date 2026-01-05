import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../shared/services/notification.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationService,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.accessToken);
        this.notifications.success('Bienvenido 🎉', 'Login exitoso');
        // this.onLoginSuccess();
        console.log('Login exitoso');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.notifications.error('Correo o contraseña incorrectos', 'Favor de intentarlo de nuevo');
        // this.onLoginError();
        // this.error = 'Credenciales inválidas. Intenta de nuevo.';
      },
    });
  }

  onLoginSuccess() {
    this.toastr.success('Bienvenido 🎉', 'Login exitoso');
  }

  onLoginError() {
    this.toastr.error('Correo o contraseña incorrectos', 'Error');
  }
}
