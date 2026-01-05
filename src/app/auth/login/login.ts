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
export class LoginComponent 
{
    public email = '';
    public password = '';
    public errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private notifications: NotificationService,
        private toastr: ToastrService
    ) {}

    public OnSubmit() 
    {
        this.errorMessage = '';
        this.authService.Login(this.email, this.password).subscribe({
            next: response => {
                this.authService.SaveToken(response.accessToken);
                this.notifications.success('Welcome 🎉', 'Successful login');
                
                console.log('Successful login');
                this.router.navigate(['/dashboard']);
            },
            error: errorResponse => {
                console.error(errorResponse);
                this.notifications.error('Incorrect email or password', 'Please try again');
                
                this.errorMessage = 'Invalid credentials. Please try again.';
            },
        });
    }

    public OnLoginSuccess() 
    {
        this.toastr.success('Welcome 🎉', 'Successful login');
    }

    public OnLoginError() 
    {
        this.toastr.error('Incorrect email or password', 'Error');
    }
}