import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <p class="copyright">© {{ currentYear }} Employee Management System</p>
          <p class="credits">Created by Ramesh | Academic Project</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--primary-dark);
      color: rgba(255, 255, 255, 0.8);
      padding: var(--spacing-md) 0;
      margin-top: auto;
    }
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .copyright, .credits {
      margin: 0;
      font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: var(--spacing-xs);
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}