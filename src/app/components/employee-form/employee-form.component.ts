import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee, DepartmentType } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  @Input() employee: Employee | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  employeeForm!: FormGroup;
  departments = Object.values(DepartmentType);
  submitting = false;
  formErrors: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      name: [this.employee?.name || '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern('^[a-zA-Z\\s]+$')
      ]],
      email: [this.employee?.email || '', [
        Validators.required,
        Validators.email
      ]],
      department: [this.employee?.department || DepartmentType.IT, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched(this.employeeForm);
      return;
    }

    this.submitting = true;
    const employeeData: Employee = this.employeeForm.value;

    if (this.employee?.id) {
      // Update existing employee
      this.employeeService.updateEmployee(this.employee.id, employeeData).subscribe({
        next: () => {
          this.submitting = false;
          this.save.emit();
        },
        error: (err) => {
          console.error('Error updating employee:', err);
          this.submitting = false;
          this.handleError(err);
        }
      });
    } else {
      // Create new employee
      this.employeeService.createEmployee(employeeData).subscribe({
        next: () => {
          this.submitting = false;
          this.save.emit();
        },
        error: (err) => {
          console.error('Error creating employee:', err);
          this.submitting = false;
          this.handleError(err);
        }
      });
    }
  }

  handleError(error: any): void {
    this.formErrors = {};
    
    if (error.error?.message) {
      this.formErrors['general'] = error.error.message;
    }
    
    if (error.error?.errors) {
      for (const err of error.error.errors) {
        const field = err.field.toLowerCase();
        this.formErrors[field] = err.defaultMessage;
      }
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.employeeForm.get(fieldName);
    
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return `${this.formatFieldName(fieldName)} is required`;
      if (control.errors['minlength']) return `${this.formatFieldName(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['maxlength']) return `${this.formatFieldName(fieldName)} cannot exceed ${control.errors['maxlength'].requiredLength} characters`;
      if (control.errors['pattern']) return `${this.formatFieldName(fieldName)} contains invalid characters`;
      if (control.errors['email']) return `${this.formatFieldName(fieldName)} must be a valid email address`;
    }
    
    return this.formErrors[fieldName] || '';
  }

  formatFieldName(fieldName: string): string {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  }

  hasError(fieldName: string): boolean {
    const control = this.employeeForm.get(fieldName);
    return !!((control?.touched && control?.invalid) || this.formErrors[fieldName]);
  }

  closeForm(): void {
    this.close.emit();
  }
}