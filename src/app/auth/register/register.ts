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
export class RegisterComponent 
{
    public name = signal('');
    public email = signal('');
    public password = signal('');
    public isLoading = signal(false);
    public errorMessage = signal<string | null>(null);

    constructor(
        private authService: AuthService,
        private router: Router,
        private notifications: NotificationService,
        private toastr: ToastrService
    ) {}

    public OnSubmit(): void 
    {
        if (!this.name() || !this.email() || !this.password()) 
        {
            this.toastr.warning('Please fill in all fields');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);

        this.authService.Register(this.name(), this.email(), this.password()).subscribe({
            next: () => {
                this.authService.Login(this.email(), this.password()).subscribe({
                    next: loginResponse => {
                        this.authService.SaveToken(loginResponse.accessToken);
                        this.notifications.success('Account created successfully');
                        this.router.navigate(['/dashboard']);
                    },
                    error: errorResponse => {
                        this.notifications.error(
                            errorResponse.error?.message || 'Error logging in after registration'
                        );
                        this.isLoading.set(false);
                    },
                });
            },
            error: () => {
                this.errorMessage.set('Error registering user');
                this.isLoading.set(false);
            },
        });
    }
}