import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';     
import { Router } from '@angular/router';

interface Company {
  id: number;
  label: string;
  routeKey: string;
}

@Component({
  selector: 'app-company-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-select.component.html',
  styleUrls: ['./company-select.component.css']
})
export class CompanySelectComponent {
  companies: Company[] = [
    { id: 142, label: 'Company (142)', routeKey: '142' },
    { id: 156, label: 'Company (156)', routeKey: '156' },
  ];

  selectedRouteKey = this.companies[0].routeKey;

  constructor(private router: Router) { }

  next() {
    if (this.selectedRouteKey === '142') {
      this.router.navigate(['/company/142/print']);
    } else if (this.selectedRouteKey === '156') {
      this.router.navigate(['/company/156/print']);
    }
  }

}
