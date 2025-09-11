import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type FeatureKey = 'packing-list' | 'inbound' | 'position' | 'articles';

@Component({
  selector: 'app-company-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-select.component.html',
  styleUrls: ['./company-select.component.css']
})
export class CompanySelectComponent implements OnInit {

  companies = [
    { id: 142, label: 'Company (142)' },
    { id: 156, label: 'Company (156)' },
    { id: 101, label: 'Company (101)' }
  ];

  allFeatures: { key: FeatureKey; label: string }[] = [
    { key: 'packing-list', label: 'Packing List' },
    { key: 'inbound', label: 'Inbound' },
    { key: 'position', label: 'Position' },
    { key: 'articles', label: 'Etichetta Articoli' }
  ];

  
  availability: Record<number, Record<FeatureKey, boolean>> = {
    142: { 'packing-list': true, inbound: false, position: false, 'articles': false },
    156: { 'packing-list': false, inbound: true, position: true, 'articles': false },
    101: { 'packing-list': false, inbound: false, position: false, 'articles': true }
  };


  routeMap: Record<number, Partial<Record<FeatureKey, string>>> = {
    142: { 'packing-list': '/company/142/print' },
    156: { inbound: '/company/156/print', position: '/company/156/position' },
    101: { 'articles': '/company/101/articles' }
  };

  featureLabel: Record<FeatureKey, string> = {
    'packing-list': 'Packing List',
    inbound: 'Inbound',
    position: 'Position',
    'articles': 'Etichetta Articoli'
  };

  selectedCompanyId = 142;
  selectedFeatureKey: FeatureKey = 'packing-list';

  constructor(private router: Router) { }

  ngOnInit(): void {
   
    this.onCompanyChange();
  }

  // (  if we want to bind the dropdown only to allowed features) like only true in availability table)
  get availableFeatures() {
    const table = this.availability[this.selectedCompanyId] || {};
    return this.allFeatures.filter(f => table[f.key]);
  }

  private firstAvailableFeature(companyId: number): FeatureKey {
    const table = this.availability[companyId];
    for (const f of this.allFeatures) {
      if (table?.[f.key]) return f.key;
    }
    
    return 'packing-list';
  }

  onCompanyChange() {
    const table = this.availability[this.selectedCompanyId] || {};
    if (!table[this.selectedFeatureKey]) {
      this.selectedFeatureKey = this.firstAvailableFeature(this.selectedCompanyId);
    }
  }

  goNext() {
    const company = this.selectedCompanyId;
    const feature = this.selectedFeatureKey;

    const ok = this.availability[company]?.[feature] === true;
    if (!ok) {
      alert(`La funzione "${this.featureLabel[feature]}" non è disponibile per l’azienda ${company}.`);
      return;
    }

    const route = this.routeMap[company]?.[feature];
    if (!route) {
      alert('Percorso non configurato. Contatta il supporto.');
      return;
    }

    this.router.navigateByUrl(route);
  }
}
