import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private API = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUserInfo(): Observable<any> {
    return this.http.get(`${this.API}/users/me`);
  }

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/transactions`);
  }
}
