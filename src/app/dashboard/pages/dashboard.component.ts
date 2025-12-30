import { Component, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { UserService, UserProfile } from '../../users/services/user.service';
import { AccountService } from '../../users/services/account.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,  NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
  
})
export class DashboardComponent implements OnInit {
  user = signal<{ email: string } | null>(null);
  balance = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private userService: UserService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    forkJoin({
      user: this.userService.getProfile(),
      balance: this.accountService.getBalance(),
    }).subscribe({
      next: (res) => {
        this.user.set(res.user);
        this.balance.set(res.balance.balance);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error cargando el dashboard');
        this.loading.set(false);
      },
    });
  }
}