import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.accessToken);
        this.router.navigate(['/accounts']);
        this.router.navigate(['/dashboard']);
        localStorage.setItem('token', res.accessToken);
        console.log('Login exitoso');
      },
      error: () => {
        this.error = 'Credenciales inválidas';
      },
    });
  }
}
