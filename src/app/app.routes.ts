import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/employees', 
    pathMatch: 'full' 
  },
  {
    path: 'employees',
    loadComponent: () => import('./components/employee-management/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
    title: 'Employee Management'
  },
  {
    path: 'employees/add',
    loadComponent: () => import('./components/employee-management/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    title: 'Add Employee'
  },
  {
    path: 'employees/edit/:id',
    loadComponent: () => import('./components/employee-management/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    title: 'Edit Employee'
  },
  {
    path: 'reports',
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent),
    title: 'Reports'
  },
  {
    path: '**',
    loadComponent: () => import('./components/shared/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found'
  }
];