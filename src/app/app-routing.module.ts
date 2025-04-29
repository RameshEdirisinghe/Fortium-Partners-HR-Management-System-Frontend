import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';
import { ReportComponent } from './components/report/report.component';

const routes: Routes = [
  { path: 'system', component: EmployeeTableComponent },
  { path: 'reports', component: ReportComponent },
  { path: '', redirectTo: '/system', pathMatch: 'full' } // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }