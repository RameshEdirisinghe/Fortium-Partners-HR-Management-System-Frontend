import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="not-found">
      <div class="card not-found-card">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <a routerLink="/" class="btn">Go to Home</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 70vh;
    }
    
    .not-found-card {
      text-align: center;
      max-width: 500px;
      width: 100%;
      padding: var(--spacing-xl);
    }
    
    h1 {
      font-size: 5rem;
      margin-bottom: var(--spacing-sm);
      color: var(--primary-color);
    }
    
    h2 {
      margin-bottom: var(--spacing-md);
      color: var(--text-primary);
    }
    
    p {
      margin-bottom: var(--spacing-lg);
      color: var(--text-secondary);
    }
  `]
})
export class NotFoundComponent {}