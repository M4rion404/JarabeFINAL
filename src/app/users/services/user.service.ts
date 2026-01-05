import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile 
{
    id: string;
    email: string;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class UserService 
{
    private apiUrl = 'http://localhost:3000/users';

    constructor(private http: HttpClient) 
    {}

    /**
     * Retrieves the profile information of the currently authenticated user.
     * @returns An observable containing the UserProfile data.
     */
    public GetProfile(): Observable<UserProfile> 
    {
        return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
    }
}