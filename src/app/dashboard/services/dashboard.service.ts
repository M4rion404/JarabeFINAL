import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DashboardService 
{
    private apiUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) 
    {}

    public GetUserInfo(): Observable<any> 
    {
        return this.http.get(`${this.apiUrl}/users/me`);
    }

    public GetTransactions(): Observable<any[]> 
    {
        return this.http.get<any[]>(`${this.apiUrl}/transactions`);
    }
}