import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app'; 
import { AppConfiguration } from './app/app.config';

bootstrapApplication(AppComponent, AppConfiguration)
    .catch((error) => 
    {
        console.error('Application bootstrap failed:', error);
    });