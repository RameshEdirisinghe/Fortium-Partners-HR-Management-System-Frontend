import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { BASE_API_URL } from './app/core/tokens/api.token';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([errorInterceptor])
    ),
    {
      provide: BASE_API_URL,
      useValue: 'http://localhost:8080' // Change this to your actual backend URL
    }
  ]
}).catch(err => console.error(err));