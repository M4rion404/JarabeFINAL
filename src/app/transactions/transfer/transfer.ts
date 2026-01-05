import { Component, signal, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../services/transaction.service';

@Component({
    standalone: true,
    selector: 'app-transfer',
    imports: [CommonModule, FormsModule],
    templateUrl: './transfer.html',
})
export class TransferComponent 
{
    // 🧠 Form State
    public targetEmail = signal('');
    public transferAmount = signal<number | null>(null);

    // 📥 Current user email for validation
    @Input({ required: true }) public currentUserEmail!: string;

    // 🎯 UX States
    public isLoading = signal(false);
    public errorMessage = signal<string | null>(null);
    public isTransferSuccessful = signal(false);

    @Output() public transferCompleted = new EventEmitter<void>();

    constructor(private transactionService: TransactionService) 
    {}

    public OnSubmit(): void 
    {
        if (!this.targetEmail()) 
        {
            this.errorMessage.set('The destination account is required');
            return;
        }

        if (this.targetEmail() === this.currentUserEmail) 
        {
            this.errorMessage.set('You cannot transfer funds to your own account');
            return;
        }

        const amountToTransfer = this.transferAmount();
        if (!amountToTransfer || amountToTransfer <= 0) 
        {
            this.errorMessage.set('The amount must be greater than 0');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);
        this.isTransferSuccessful.set(false);

        this.transactionService.Transfer(amountToTransfer, this.targetEmail()).subscribe({
            next: () => 
            {
                this.isTransferSuccessful.set(true);
                this.isLoading.set(false);

                setTimeout(() => 
                {
                    this.transferCompleted.emit();
                }, 1500);
            },
            error: () => 
            {
                this.errorMessage.set('The transfer could not be completed');
                this.isLoading.set(false);
            },
        });
    }
}