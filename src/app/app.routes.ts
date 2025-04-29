import { Routes } from '@angular/router';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';
import { ReportComponent } from './components/report/report.component';

export const routes: Routes = [
  { path: 'employees', component: EmployeeTableComponent },
  { path: 'reports', component: ReportComponent },
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: '**', redirectTo: '/employees' }
];