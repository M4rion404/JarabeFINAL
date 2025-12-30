import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BalanceResponse {
  balance: number;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private API_URL = 'http://localhost:3000/accounts';

  constructor(private http: HttpClient) {}

  getBalance(): Observable<BalanceResponse> {
    return this.http.get<BalanceResponse>(`${this.API_URL}/balance`);
  }
}
