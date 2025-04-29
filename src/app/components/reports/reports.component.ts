import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../core/services/report.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

interface ReportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  downloadFn: () => void;
  loading?: boolean;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Reports</h1>
      </div>
      
      <div class="reports-container">
        <div class="card report-card" *ngFor="let report of reportOptions">
          <div class="report-icon">
            <span class="material-icons">{{ report.icon }}</span>
          </div>
          <div class="report-content">
            <h2>{{ report.title }}</h2>
            <p>{{ report.description }}</p>
          </div>
          <div class="report-action">
            <button 
              class="btn" 
              (click)="report.downloadFn()" 
              [disabled]="report.loading"
            >
              <span *ngIf="report.loading" class="spinner-icon"></span>
              <span *ngIf="!report.loading" class="material-icons">download</span>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: var(--spacing-lg);
    }
    
    .reports-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--spacing-lg);
    }
    
    .report-card {
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .report-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
    
    .report-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background-color: var(--primary-light);
      margin-bottom: var(--spacing-md);
    }
    
    .report-icon .material-icons {
      font-size: 32px;
      color: white;
    }
    
    .report-content {
      flex: 1;
    }
    
    .report-content h2 {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-sm);
    }
    
    .report-content p {
      color: var(--text-secondary);
      margin-bottom: var(--spacing-lg);
    }
    
    .report-action {
      margin-top: auto;
    }
    
    .report-action .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      width: 100%;
    }
    
    .spinner-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .reports-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReportsComponent {
  private reportService = inject(ReportService);
  
  reportOptions: ReportOption[] = [
    {
      id: 'last-month',
      title: 'Last Month Report',
      description: 'Download a comprehensive Excel report of all employee activities from the last month.',
      icon: 'calendar_month',
      downloadFn: () => this.downloadLastMonthReport()
    },
    {
      id: 'last-10-days',
      title: 'Last 10 Days Employee Report',
      description: 'Download an Excel report containing employee data from the last 10 days.',
      icon: 'people',
      downloadFn: () => this.downloadLast10DaysReport()
    }
  ];
  
  downloadLastMonthReport(): void {
    const reportOption = this.findReportOption('last-month');
    if (reportOption) {
      reportOption.loading = true;
      
      this.reportService.downloadLastMonthReport().subscribe({
        next: (data) => {
          this.reportService.downloadFile(data, 'last_month_report.xlsx');
          reportOption.loading = false;
        },
        error: () => {
          reportOption.loading = false;
        }
      });
    }
  }
  
  downloadLast10DaysReport(): void {
    const reportOption = this.findReportOption('last-10-days');
    if (reportOption) {
      reportOption.loading = true;
      
      this.reportService.downloadLast10DaysReport().subscribe({
        next: (data) => {
          this.reportService.downloadFile(data, 'last_10_days_employees.xlsx');
          reportOption.loading = false;
        },
        error: () => {
          reportOption.loading = false;
        }
      });
    }
  }
  
  private findReportOption(id: string): ReportOption | undefined {
    return this.reportOptions.find(option => option.id === id);
  }
}