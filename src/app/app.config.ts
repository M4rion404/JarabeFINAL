import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';

export const AppConfiguration: ApplicationConfig = 
{
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([AuthInterceptor])
        ),
        provideAnimationsAsync(),
        provideToastr({
            timeOut: 3000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
            progressBar: true,
            closeButton: true,
        })
    ]
};
