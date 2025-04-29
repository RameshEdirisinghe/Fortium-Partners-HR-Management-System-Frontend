import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: string = 'info'; // success, error, warning, info
  
  icon = '';
  
  ngOnInit(): void {
    this.setIcon();
  }
  
  setIcon(): void {
    switch (this.type) {
      case 'success':
        this.icon = '✓';
        break;
      case 'error':
        this.icon = '✗';
        break;
      case 'warning':
        this.icon = '!';
        break;
      default:
        this.icon = 'i';
        break;
    }
  }
}