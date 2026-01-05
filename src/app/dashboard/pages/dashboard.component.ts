import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { CommonModule, DatePipe, DecimalPipe, NgClass, UpperCasePipe } from '@angular/common';

import { UserService } from '../../users/services/user.service';
import { AccountService } from '../../users/services/account.service';
import { Transaction, TransactionService } from '../../transactions/services/transaction.service';
import { NavbarComponent } from '../../shared/components/navbar';
import { TransferComponent } from '../../transactions/transfer/transfer';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    DecimalPipe,
    DatePipe,
    NgClass,
    TransferComponent,
    UpperCasePipe,
  ],
  templateUrl: './dashboard.html',
})

export class DashboardComponent implements OnInit {
  // user = signal<{ name: string; email: string } | null>(null);
  private authService = inject(AuthService);
  user = this.authService.user;
  balance = signal<number>(0);
  transactions = signal<Transaction[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  showTransferModal = signal(false);
 
  

  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      // user: this.userService.getProfile().pipe(catchError(() => of(null))),
      balance: this.accountService
        .getBalance()
        .pipe(catchError(() => of({ balance: 0 }))),
      transactions: this.transactionService
        .getTransactions()
        .pipe(catchError(() => of([]))),
    })
      // ⏱️ delay SOLO para ver el skeleton (quítalo en prod)
      .pipe(delay(1200))
      .subscribe({
        next: (res) => {
          // if (!res.user) {
          //   this.error.set('No se pudo cargar el perfil del usuario');
          //   this.loading.set(false);
          //   return;
          // }

          // this.user.set(res.user);
          this.balance.set(res.balance.balance);
          this.transactions.set(res.transactions);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Error inesperado al cargar el dashboard');
          this.loading.set(false);
        },
      });
  }

  openTransfer(): void {
    this.showTransferModal.set(true);
  }

  closeTransfer(): void {
    this.showTransferModal.set(false);
  }

  onTransferCompleted(): void {
    this.showTransferModal.set(false);
    this.loadDashboard();
  }
}
