import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Employee, departmentOptions } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Employee Management</h1>
        <a routerLink="/employees/add" class="btn">Add New Employee</a>
      </div>
      
      <div class="card">
        <div class="filters">
          <div class="search-box">
            <input type="text" class="form-control" placeholder="Search employees..." 
                  [(ngModel)]="searchTerm" (input)="applyFilters()">
          </div>
          <div class="filter-box">
            <select class="form-control" [(ngModel)]="departmentFilter" (change)="applyFilters()">
              <option value="">All Departments</option>
              <option *ngFor="let dept of departmentOptions" [value]="dept.value">
                {{ dept.label }}
              </option>
            </select>
          </div>
        </div>
        
        <ng-container *ngIf="!loading; else loadingTemplate">
          <div *ngIf="filteredEmployees.length > 0; else noEmployees">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th (click)="sortBy('id')" class="sortable">
                      ID
                      <span *ngIf="sortColumn === 'id'" class="sort-icon">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                      </span>
                    </th>
                    <th (click)="sortBy('name')" class="sortable">
                      Name
                      <span *ngIf="sortColumn === 'name'" class="sort-icon">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                      </span>
                    </th>
                    <th (click)="sortBy('email')" class="sortable">
                      Email
                      <span *ngIf="sortColumn === 'email'" class="sort-icon">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                      </span>
                    </th>
                    <th (click)="sortBy('department')" class="sortable">
                      Department
                      <span *ngIf="sortColumn === 'department'" class="sort-icon">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                      </span>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let employee of filteredEmployees" class="employee-row" 
                      [class.deleted]="employee.isDeleting">
                    <td>{{ employee.id }}</td>
                    <td>{{ employee.name }}</td>
                    <td>{{ employee.email }}</td>
                    <td>{{ getDepartmentLabel(employee.department) }}</td>
                    <td class="actions">
                      <button class="btn-icon edit" [routerLink]="['/employees/edit', employee.id]">
                        <span class="material-icons">edit</span>
                      </button>
                      <button class="btn-icon delete" (click)="confirmDelete(employee)"
                              [disabled]="employee.isDeleting">
                        <span class="material-icons" *ngIf="!employee.isDeleting">delete</span>
                        <span class="material-icons" *ngIf="employee.isDeleting">hourglass_empty</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ng-container>
        
        <ng-template #loadingTemplate>
          <app-loading-spinner message="Loading employees..."></app-loading-spinner>
        </ng-template>
        
        <ng-template #noEmployees>
          <div class="empty-state">
            <div class="empty-icon">
              <span class="material-icons">people_outline</span>
            </div>
            <h3>No employees found</h3>
            <p>
              {{ searchTerm || departmentFilter 
                ? 'Try adjusting your search or filter criteria' 
                : 'Start by adding a new employee to the system' }}
            </p>
            <a routerLink="/employees/add" class="btn">Add Employee</a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }
    
    .filters {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }
    
    .search-box {
      flex: 2;
    }
    
    .filter-box {
      flex: 1;
    }
    
    .table-responsive {
      overflow-x: auto;
    }
    
    .sortable {
      cursor: pointer;
      user-select: none;
    }
    
    .sort-icon {
      display: inline-block;
      margin-left: var(--spacing-xs);
    }
    
    .actions {
      display: flex;
      gap: var(--spacing-xs);
    }
    
    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .btn-icon.edit {
      background-color: var(--primary-light);
      color: white;
    }
    
    .btn-icon.edit:hover {
      background-color: var(--primary-color);
    }
    
    .btn-icon.delete {
      background-color: var(--error-color);
      color: white;
    }
    
    .btn-icon.delete:hover {
      background-color: #d32f2f;
    }
    
    .btn-icon:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .employee-row {
      transition: opacity 0.3s ease, background-color 0.3s ease;
    }
    
    .employee-row.deleted {
      opacity: 0.5;
      background-color: rgba(244, 67, 54, 0.1);
    }
    
    .empty-state {
      text-align: center;
      padding: var(--spacing-xl) 0;
    }
    
    .empty-icon {
      font-size: 4rem;
      color: var(--text-disabled);
      margin-bottom: var(--spacing-md);
    }
    
    .empty-icon .material-icons {
      font-size: 4rem;
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  
  employees: (Employee & { isDeleting?: boolean })[] = [];
  filteredEmployees: (Employee & { isDeleting?: boolean })[] = [];
  loading = true;
  searchTerm = '';
  departmentFilter = '';
  sortColumn = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  departmentOptions = departmentOptions;
  
  ngOnInit(): void {
    this.loadEmployees();
  }
  
  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  
  applyFilters(): void {
    let filtered = [...this.employees];
    
    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(search) || 
        emp.email.toLowerCase().includes(search)
      );
    }
    
    // Apply department filter
    if (this.departmentFilter) {
      filtered = filtered.filter(emp => emp.department === this.departmentFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const valueA = a[this.sortColumn as keyof Employee];
      const valueB = b[this.sortColumn as keyof Employee];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else {
        // For numerical values
        const numA = valueA as number;
        const numB = valueB as number;
        return this.sortDirection === 'asc' ? numA - numB : numB - numA;
      }
    });
    
    this.filteredEmployees = filtered;
  }
  
  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.applyFilters();
  }
  
  getDepartmentLabel(departmentValue: string): string {
    const dept = this.departmentOptions.find(d => d.value === departmentValue);
    return dept ? dept.label : departmentValue;
  }
  
  confirmDelete(employee: Employee & { isDeleting?: boolean }): void {
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      this.deleteEmployee(employee);
    }
  }
  
  deleteEmployee(employee: Employee & { isDeleting?: boolean }): void {
    if (!employee.id) return;
    
    // Mark as deleting for UI feedback
    employee.isDeleting = true;
    
    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: (success) => {
        if (success) {
          // Remove from array after a short delay for visual feedback
          setTimeout(() => {
            this.employees = this.employees.filter(e => e.id !== employee.id);
            this.applyFilters();
          }, 500);
        } else {
          employee.isDeleting = false;
          alert('Failed to delete employee');
        }
      },
      error: () => {
        employee.isDeleting = false;
        alert('An error occurred while deleting the employee');
      }
    });
  }
}