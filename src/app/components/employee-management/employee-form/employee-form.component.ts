import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee, DepartmentType, departmentOptions } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>{{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}</h1>
        <a routerLink="/employees" class="btn btn-secondary">Back to List</a>
      </div>
      
      <div class="card">
        <ng-container *ngIf="!loading; else loadingTemplate">
          <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" class="employee-form">
            <div class="form-group">
              <label for="name" class="form-label">Name</label>
              <input type="text" id="name" formControlName="name" class="form-control"
                    [class.is-invalid]="isFieldInvalid('name')">
              <div *ngIf="isFieldInvalid('name')" class="error-message">
                <span *ngIf="nameControl?.errors?.['required']">Name is required</span>
                <span *ngIf="nameControl?.errors?.['minlength']">Name must be at least 2 characters</span>
                <span *ngIf="nameControl?.errors?.['maxlength']">Name cannot exceed 100 characters</span>
                <span *ngIf="nameControl?.errors?.['pattern']">Name must contain only alphabetic characters and spaces</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" formControlName="email" class="form-control"
                    [class.is-invalid]="isFieldInvalid('email')">
              <div *ngIf="isFieldInvalid('email')" class="error-message">
                <span *ngIf="emailControl?.errors?.['required']">Email is required</span>
                <span *ngIf="emailControl?.errors?.['email']">Please enter a valid email</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="department" class="form-label">Department</label>
              <select id="department" formControlName="department" class="form-control"
                     [class.is-invalid]="isFieldInvalid('department')">
                <option value="" disabled>Select Department</option>
                <option *ngFor="let dept of departmentOptions" [value]="dept.value">{{ dept.label }}</option>
              </select>
              <div *ngIf="isFieldInvalid('department')" class="error-message">
                Department is required
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" routerLink="/employees">Cancel</button>
              <button type="submit" class="btn" [disabled]="employeeForm.invalid || submitting">
                <span *ngIf="submitting" class="spinner-icon"></span>
                {{ isEditMode ? 'Update' : 'Create' }} Employee
              </button>
            </div>
          </form>
        </ng-container>
        
        <ng-template #loadingTemplate>
          <app-loading-spinner message="Loading employee data..."></app-loading-spinner>
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
    
    .employee-form {
      max-width: 600px;
    }
    
    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      margin-top: var(--spacing-xl);
    }
    
    .btn-secondary {
      background-color: #757575;
    }
    
    .btn-secondary:hover {
      background-color: #616161;
    }
    
    .is-invalid {
      border-color: var(--error-color);
    }
    
    .spinner-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s linear infinite;
      margin-right: var(--spacing-sm);
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  employeeForm!: FormGroup;
  loading = false;
  submitting = false;
  isEditMode = false;
  employeeId: number | null = null;
  departmentOptions = departmentOptions;
  
  get nameControl() { return this.employeeForm.get('name'); }
  get emailControl() { return this.employeeForm.get('email'); }
  
  ngOnInit(): void {
    this.initForm();
    
    // Check if we're in edit mode
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.employeeId = +idParam;
      this.loadEmployeeData(this.employeeId);
    }
  }
  
  initForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(100),
        Validators.pattern('^[a-zA-Z\\s]+$')
      ]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required]
    });
  }
  
  loadEmployeeData(id: number): void {
    this.loading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          name: employee.name,
          email: employee.email,
          department: employee.department
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Failed to load employee data. Redirecting to list.');
        this.router.navigate(['/employees']);
      }
    });
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const control = this.employeeForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  
  onSubmit(): void {
    if (this.employeeForm.invalid) return;
    
    this.submitting = true;
    const formData = this.employeeForm.value;
    
    const employee: Employee = {
      name: formData.name,
      email: formData.email,
      department: formData.department as DepartmentType
    };
    
    if (this.isEditMode && this.employeeId) {
      this.updateEmployee(this.employeeId, employee);
    } else {
      this.createEmployee(employee);
    }
  }
  
  createEmployee(employee: Employee): void {
    this.employeeService.createEmployee(employee).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/employees'], { state: { success: 'Employee created successfully' } });
      },
      error: () => {
        this.submitting = false;
        // Error is handled by the HTTP interceptor
      }
    });
  }
  
  updateEmployee(id: number, employee: Employee): void {
    this.employeeService.updateEmployee(id, employee).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/employees'], { state: { success: 'Employee updated successfully' } });
      },
      error: () => {
        this.submitting = false;
        // Error is handled by the HTTP interceptor
      }
    });
  }
}