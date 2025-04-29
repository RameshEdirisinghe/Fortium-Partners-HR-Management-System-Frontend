import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-container" [class.overlay]="overlay">
      <div class="spinner"></div>
      <p *ngIf="message" class="spinner-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-lg);
    }
    
    .spinner-container.overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 1000;
    }
    
    .spinner-message {
      margin-top: var(--spacing-md);
      color: var(--text-secondary);
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message = '';
  @Input() overlay = false;
}