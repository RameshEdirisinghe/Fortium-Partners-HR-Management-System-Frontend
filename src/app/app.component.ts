import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, EmployeeTableComponent],
  template: `
    <div class="app-container">
      <app-employee-table></app-employee-table>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f8fafc;
      padding: 16px;
    }
  `]
})
export class App {
}