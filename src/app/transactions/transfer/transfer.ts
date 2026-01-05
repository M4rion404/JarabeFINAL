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
export class TransferComponent {
  // 🧠 Estado del formulario
  toEmail = signal('');
  amount = signal<number | null>(null);

  // 📥 Correo del usuario actual (para validación)
  @Input({ required: true }) currentUserEmail!: string;

  // 🎯 Estados UX
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  @Output() completed = new EventEmitter<void>();

  constructor(private transactionService: TransactionService) {}

  submit(): void {
    // ❌ Validaciones
    if (!this.toEmail()) {
      this.error.set('La cuenta destino es obligatoria');
      return;
    }

    if (this.toEmail() === this.currentUserEmail) {
      this.error.set('No puedes transferirte a ti mismo');
      return;
    }

    const amount = this.amount();
    if (!amount || amount <= 0) {
      this.error.set('El monto debe ser mayor a 0');
      return;
    }

    // 🔄 Estados
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    this.transactionService.transfer(amount, this.toEmail()).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);

        // ⏱️ AUTO CIERRE DEL MODAL
        setTimeout(() => {
          this.completed.emit();
        }, 1500);
      },
      error: () => {
        this.error.set('No se pudo realizar la transferencia');
        this.loading.set(false);
      },
    });
  }
}
