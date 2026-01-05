import { 
    HttpInterceptorFn, 
    HttpRequest, 
    HttpHandlerFn, 
    HttpEvent, 
    HttpErrorResponse 
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
    request: HttpRequest<unknown>, 
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => 
{
    const authService = inject(AuthService);
    const router = inject(Router);
    const sessionToken = authService.GetToken();

    const authenticatedRequest = sessionToken
        ? request.clone({
            setHeaders: { Authorization: `Bearer ${sessionToken}` }
          })
        : request;

    return next(authenticatedRequest).pipe(
        catchError((error: HttpErrorResponse) => 
        {
            if (error.status === 401) 
            {
                ExecuteSessionLogout(authService, router);
            }
            
            return throwError(() => error);
        })
    );
};

function ExecuteSessionLogout(authService: AuthService, router: Router): void 
{
    authService.Logout();
    router.navigate(['/login']);
}