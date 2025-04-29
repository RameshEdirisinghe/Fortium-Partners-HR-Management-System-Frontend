import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(error => {
      let errorMessage = 'An unknown error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else if (error.status) {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        
        // Handle specific error codes
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad Request: Please check your input';
            break;
          case 401:
            errorMessage = 'Unauthorized: Please log in again';
            break;
          case 403:
            errorMessage = 'Forbidden: You do not have permission to access this resource';
            break;
          case 404:
            errorMessage = 'Not Found: The requested resource does not exist';
            break;
          case 500:
            errorMessage = 'Server Error: Please try again later';
            break;
        }
      }
      
      console.error(errorMessage);
      // You could display the error in a toast or notification here
      
      return throwError(() => new Error(errorMessage));
    })
  );
};