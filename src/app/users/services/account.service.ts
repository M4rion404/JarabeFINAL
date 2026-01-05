import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BalanceResponse 
{
    balance: number;
}

@Injectable({
    providedIn: 'root',
})
export class AccountService 
{
    private apiUrl = 'http://localhost:3000/accounts';

    constructor(private http: HttpClient) 
    {}

    public GetBalance(): Observable<BalanceResponse> 
    {
        return this.http.get<BalanceResponse>(`${this.apiUrl}/balance`);
    }
}
