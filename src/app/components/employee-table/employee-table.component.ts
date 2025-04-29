import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, DepartmentType } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { ToastComponent } from '../toast/toast.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeFormComponent, ToastComponent,RouterModule],
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css']
})
export class EmployeeTableComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  searchId = '';
  showForm = false;
  selectedEmployee: Employee | null = null;
  toastMessage = '';
  toastType = '';
  showToast = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.loading = false;
        this.showToastMessage('Error loading employees', 'error');
      }
    });
  }

  searchEmployee(): void {
    if (!this.searchId || isNaN(Number(this.searchId))) {
      this.showToastMessage('Please enter a valid ID', 'warning');
      return;
    }

    this.loading = true;
    const id = Number(this.searchId);
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employees = employee ? [employee] : [];
        this.loading = false;
        if (!employee) {
          this.showToastMessage(`No employee found with ID: ${id}`, 'warning');
        }
      },
      error: (err) => {
        console.error('Error searching employee:', err);
        this.loading = false;
        this.showToastMessage(`Employee with ID ${id} not found`, 'error');
        this.loadEmployees();
      }
    });
  }

  clearSearch(): void {
    this.searchId = '';
    this.loadEmployees();
  }

  editEmployee(employee: Employee): void {
    this.selectedEmployee = { ...employee };
    this.showForm = true;
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: (result) => {
          if (result) {
            this.loadEmployees();
            this.showToastMessage('Employee deleted successfully', 'success');
          } else {
            this.showToastMessage('Failed to delete employee', 'error');
          }
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          this.showToastMessage('Error deleting employee', 'error');
        }
      });
    }
  }

  addNewEmployee(): void {
    this.selectedEmployee = null;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedEmployee = null;
  }

  handleEmployeeSaved(): void {
    this.loadEmployees();
    this.closeForm();
    this.showToastMessage(
      this.selectedEmployee ? 'Employee updated successfully' : 'Employee added successfully',
      'success'
    );
  }

  showToastMessage(message: string, type: string): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  getDepartmentLabel(dept: DepartmentType): string {
    return DepartmentType[dept] || dept.toString();
  }
}