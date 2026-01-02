import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private API_URL = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.API_URL);
  }

transfer(amount: number, toEmail: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/transfer`, {
      amount,
      toEmail,
    });
  }
}
