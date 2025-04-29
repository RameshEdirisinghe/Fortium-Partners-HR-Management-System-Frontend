import { Routes } from '@angular/router';
<<<<<<< HEAD

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
=======
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';
import { ReportComponent } from './components/report/report.component';

export const routes: Routes = [
  { path: 'employees', component: EmployeeTableComponent },
  { path: 'reports', component: ReportComponent },
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: '**', redirectTo: '/employees' }
>>>>>>> 328473764816f4872dcec0d78b4afe5db8503eb1
];