import { Component, signal, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../services/transaction.service';

@Component({
  standalone: true,
  selector: 'app-transfer',
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer.html',
})
export class TransferComponent {
  // 🧠 Estado del formulario
  toEmail = signal('');
  amount = signal<number | null>(null);

  // 🎯 Estados UX
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  constructor(private transactionService: TransactionService) {}

  submit(): void {
    // ❌ Validaciones frontend
    if (!this.toEmail()) {
      this.error.set('La cuenta destino es obligatoria');
      return;
    }

    const amount = this.amount();
    if (!amount || amount <= 0) {
      this.error.set('El monto debe ser mayor a 0');
      return;
    }

    // 🔄 Estados visuales
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    const payload = {
      toEmail: this.toEmail(),
      amount: Number(this.amount()),
    };

    console.log('TRANSFER PAYLOAD:', payload);

    this.transactionService.transfer(Number(this.amount()!), this.toEmail()).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        this.completed.emit();
        payload.amount,
        payload.toEmail
      },
      error: () => {
        this.error.set('No se pudo realizar la transferencia');
        this.loading.set(false);
      },
    });
  }
  @Output() completed = new EventEmitter<void>();
}
