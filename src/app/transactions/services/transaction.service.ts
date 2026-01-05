import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction 
{
    id: string;
    amount: number;
    type: 'IN' | 'OUT';
    counterparty: {
        name: string;
        email: string;
    };
    createdAt: string;
}

@Injectable({
    providedIn: 'root',
})
export class TransactionService 
{
    private apiUrl = 'http://localhost:3000/transactions';

    constructor(private http: HttpClient) 
    {}

    public GetTransactions(): Observable<Transaction[]> 
    {
        return this.http.get<Transaction[]>(this.apiUrl);
    }

    public Transfer(amount: number, recipientEmail: string): Observable<void> 
    {
        const transferPayload = {
            amount: amount,
            toEmail: recipientEmail
        };

        return this.http.post<void>(`${this.apiUrl}/transfer`, transferPayload);
    }
}