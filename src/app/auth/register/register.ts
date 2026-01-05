import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent {
  name = signal('');
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationService,
    private toastr: ToastrService
  ) {}

  submit(): void {
    if (!this.name() || !this.email() || !this.password()) {
      this.toastr.warning('Completa todos los campos');
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    this.authService.register(this.name(), this.email(), this.password()).subscribe({
      next: () => {
        this.authService.login(this.email(), this.password()).subscribe({
          next: (res) => {
            this.authService.saveToken(res.accessToken);
            this.notifications.success('Cuenta creada correctamente');
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.notifications.error(
              err.error?.message || 'Error al iniciar sesión después del registro');
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.error.set('Error al registrar usuario');
        this.loading.set(false);
      },
    });
  }
}
