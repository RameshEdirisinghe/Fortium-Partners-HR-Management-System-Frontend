import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../tokens/api.token';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private baseUrl = inject(BASE_API_URL);
  private apiUrl = `${this.baseUrl}/report`;

  downloadLastMonthReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/last-month`, {
      responseType: 'blob'
    });
  }

  downloadLast10DaysReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/last-10-days`, {
      responseType: 'blob'
    });
  }

  // Helper method to handle file downloads
  downloadFile(data: Blob, filename: string): void {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
  }
}