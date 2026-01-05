import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse 
{
    accessToken: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService 
{
    private apiUrl = 'http://localhost:3000/auth';

    private userSignal = signal<any>(this.DecodeToken(this.GetToken()));

    public user = computed(() => this.userSignal());

    constructor(private http: HttpClient) 
    {}

    public Login(email: string, password: string): Observable<LoginResponse> 
    {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap(response => this.SaveToken(response.accessToken))
        );
    }

    public Register(name: string, email: string, password: string) 
    {
        return this.http.post(`${this.apiUrl.replace('/auth', '/users')}/register`, {
            name,
            email,
            password,
        });
    }

    public SaveToken(token: string): void 
    {
        localStorage.setItem('access_token', token);
        this.userSignal.set(this.DecodeToken(token));
    }

    public GetToken(): string | null 
    {
        return localStorage.getItem('access_token');
    }

    private DecodeToken(token: string | null): any 
    {
        if (!token) 
        {
            return null;
        }

        try 
        {
            const decodedToken: any = jwtDecode(token);
            console.log('Decoded token object:', decodedToken);

            return {
                id: decodedToken.sub,
                email: decodedToken.email,
                name: decodedToken.name,
            };
        } 
        catch (error) 
        {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    public Logout() 
    {
        localStorage.removeItem('access_token');
        this.userSignal.set(null);
    }

    public IsAuthenticated(): boolean 
    {
        return !!this.GetToken();
    }
}