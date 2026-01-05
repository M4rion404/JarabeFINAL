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
export class DashboardComponent implements OnInit 
{
    private authService = inject(AuthService);
    
    public currentUser = this.authService.user;
    public accountBalance = signal<number>(0);
    public transactionHistory = signal<Transaction[]>([]);
    public isLoading = signal<boolean>(true);
    public errorMessage = signal<string | null>(null);
    public isTransferModalVisible = signal(false);

    constructor(
        private readonly userService: UserService,
        private readonly accountService: AccountService,
        private readonly transactionService: TransactionService
    ) {}

    public ngOnInit(): void 
    {
        this.LoadDashboardData();
    }

    public LoadDashboardData(): void 
    {
        this.isLoading.set(true);
        this.errorMessage.set(null);

        forkJoin({
            balanceData: this.accountService
                .GetBalance()
                .pipe(catchError(() => of({ balance: 0 }))),
            transactionsData: this.transactionService
                .GetTransactions()
                .pipe(catchError(() => of([]))),
        })
        // ⏱️ Artificial delay to visualize the skeleton loader
        .pipe(delay(1200))
        .subscribe({
            next: (dashboardData) => 
            {
                this.accountBalance.set(dashboardData.balanceData.balance);
                this.transactionHistory.set(dashboardData.transactionsData);
                this.isLoading.set(false);
            },
            error: () => 
            {
                this.errorMessage.set('Unexpected error while loading dashboard');
                this.isLoading.set(false);
            },
        });
    }

    public OpenTransferModal(): void 
    {
        this.isTransferModalVisible.set(true);
    }

    public CloseTransferModal(): void 
    {
        this.isTransferModalVisible.set(false);
    }

    public OnTransferCompleted(): void 
    {
        this.isTransferModalVisible.set(false);
        this.LoadDashboardData();
    }
}