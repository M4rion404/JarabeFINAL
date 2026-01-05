import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationService
  ) {}

  logout() {
    this.authService.logout();
    this.notifications.info('Has cerrado sesión correctamente');
    this.router.navigate(['/login']);
  }
}
