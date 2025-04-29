import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container navbar-container">
        <a routerLink="/" class="navbar-brand">
          <span class="navbar-logo">HR</span>
          <span class="navbar-title">Fortium Partners</span>
        </a>
        <div class="navbar-menu" [class.active]="isMenuOpen">
          <a routerLink="/employees" routerLinkActive="active" class="navbar-item"
             (click)="toggleMenu()">Employees</a>
          <a routerLink="/reports" routerLinkActive="active" class="navbar-item"
             (click)="toggleMenu()">Reports</a>
        </div>
        <button class="navbar-toggle" (click)="toggleMenu()">
          <span class="menu-icon"></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: var(--primary-color);
      color: white;
      padding: var(--spacing-md) 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .navbar-brand {
      display: flex;
      align-items: center;
      color: white;
      text-decoration: none;
    }
    
    .navbar-logo {
      font-weight: 700;
      font-size: 1.25rem;
      padding: var(--spacing-xs) var(--spacing-sm);
      background-color: white;
      color: var(--primary-color);
      border-radius: var(--border-radius);
      margin-right: var(--spacing-sm);
    }
    
    .navbar-title {
      font-weight: 500;
      font-size: 1.25rem;
    }
    
    .navbar-menu {
      display: flex;
      gap: var(--spacing-lg);
    }
    
    .navbar-item {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      font-weight: 500;
      padding: var(--spacing-xs) 0;
      transition: color 0.2s ease;
      position: relative;
    }
    
    .navbar-item:hover {
      color: white;
    }
    
    .navbar-item.active {
      color: white;
    }
    
    .navbar-item.active:after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--accent-color);
      border-radius: 1.5px;
    }
    
    .navbar-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      width: 30px;
      height: 24px;
      position: relative;
    }
    
    .menu-icon,
    .menu-icon:before,
    .menu-icon:after {
      background-color: white;
      width: 30px;
      height: 3px;
      border-radius: 1.5px;
      position: absolute;
      transition: all 0.2s ease;
    }
    
    .menu-icon {
      top: 50%;
      transform: translateY(-50%);
    }
    
    .menu-icon:before,
    .menu-icon:after {
      content: '';
      left: 0;
    }
    
    .menu-icon:before {
      top: -8px;
    }
    
    .menu-icon:after {
      bottom: -8px;
    }
    
    @media (max-width: 768px) {
      .navbar-menu {
        position: fixed;
        top: 60px;
        right: -100%;
        flex-direction: column;
        width: 100%;
        background-color: var(--primary-color);
        padding: var(--spacing-md);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: right 0.3s ease;
      }
      
      .navbar-menu.active {
        right: 0;
      }
      
      .navbar-toggle {
        display: block;
      }
    }
  `]
})
export class NavbarComponent {
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}