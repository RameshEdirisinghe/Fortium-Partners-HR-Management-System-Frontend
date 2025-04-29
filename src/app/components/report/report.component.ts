import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { MaterialModule } from '../../material.module';


@Component({
  selector: 'app-report',
  imports: [ MaterialModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  isLoading = false;
  lastDownloaded: string | null = null;

  constructor(private http: HttpClient) {}

  downloadLastMonthReport() {
    this.downloadReport('/report/last-month', 'last_month_report.xlsx');
  }

  downloadLast10DaysReport() {
    this.downloadReport('/report/last-10-days', 'last_10_days_employees.xlsx');
  }

  private downloadReport(endpoint: string, filename: string) {
    this.isLoading = true;
    this.lastDownloaded = filename;

    this.http.get(endpoint, {
      responseType: 'blob',
      observe: 'response'
    }).subscribe(response => {
      const blob = new Blob([response.body!], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, filename);
      this.isLoading = false;
    }, error => {
      console.error('Error downloading report:', error);
      this.isLoading = false;
    });
  }
}