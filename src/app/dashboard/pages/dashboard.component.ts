import { Component, OnInit, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { UserService } from '../../users/services/user.service';
import { AccountService } from '../../users/services/account.service';
import { Transaction, TransactionService } from '../../transactions/services/transaction.service';
import { NavbarComponent } from '../../shared/components/navbar';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { TransferComponent } from '../../transactions/transfer/transfer';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, DecimalPipe, DatePipe, NgClass, CommonModule, TransferComponent],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  user = signal<{ email: string } | null>(null);
  balance = signal<number>(0);
  transactions = signal<Transaction[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadDashboard();
  }

//recargar datos del dashboard una vez realizada una transferencia

loadDashboard(): void {
  this.loading.set(true);

  forkJoin({
    user: this.userService.getProfile(),
    balance: this.accountService.getBalance(),
    transactions: this.transactionService.getTransactions(),
  }).subscribe({
    next: (res) => {
      this.user.set(res.user);
      this.balance.set(res.balance.balance);
      this.transactions.set(res.transactions);
      this.loading.set(false);
    },
    error: () => {
      this.error.set('Error cargando el dashboard');
      this.loading.set(false);
    },
  });
}

//cargar datos del dashboard
  private loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      user: this.userService.getProfile().pipe(catchError(() => of(null))),
      balance: this.accountService.getBalance().pipe(catchError(() => of({ balance: 0 }))),
      transactions: this.transactionService.getTransactions().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (res) => {
        if (!res.user) {
          this.error.set('No se pudo cargar el perfil del usuario');
          return;
        }

        this.user.set(res.user);
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

  showTransferModal = signal(false);

  openTransfer() {
    this.showTransferModal.set(true);
  }

  closeTransfer() {
    this.showTransferModal.set(false);
  }
  onTransferCompleted(): void {
  this.showTransferModal.set(false);
  this.loadDashboard();
}

}
