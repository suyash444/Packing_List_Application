import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrintService } from '../../services/print.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-company-156-print',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './company-156-print.component.html',
  styleUrls: ['./company-156-print.component.css']
})
export class Company156PrintComponent {
  title = 'Inbound';

  
  ean = '';
  baseUdc = '';

  warehouse = '';     
  printerIp = '';
  port = 9100;

  warehouses = [{ code: 'V1' }, { code: 'V2' }, { code: 'M1' }];

  printersByWarehouse: Record<string, { name: string; ip: string }[]> = {
    V1: [
      { name: 'V1 - Printer - Zebr1', ip: '192.168.70.101' },
      { name: 'V1 - Printer - Zebr2', ip: '192.168.70.102' },
      { name: 'V1 - Printer - Zebr3', ip: '192.168.70.103' },
      { name: 'V1 - Printer - Zebr4', ip: '192.168.70.104' },
      { name: 'V1 - Printer - Zebr5', ip: '192.168.70.105' },
      { name: 'V1 - Printer - Zebr6', ip: '192.168.70.106' },
      { name: 'V1 - Printer - Zebr7', ip: '192.168.70.107' },
      { name: 'V1 - Printer - Zebr8', ip: '192.168.70.108' }
    ],
    V2: [
      { name: 'V2 - Printer - Zebr1', ip: '192.168.41.101' },
      { name: 'V2 - Printer - Zebr2', ip: '192.168.41.102' },
      { name: 'V2 - Printer - Zebr3', ip: '192.168.41.103' },
      { name: 'V2 - Printer - Zebr4', ip: '192.168.41.104' },
      { name: 'V2 - Printer - Zebr5', ip: '192.168.41.105' },
      { name: 'V2 - Printer - Zebr6', ip: '192.168.41.106' },
      { name: 'V2 - Printer - Zebr7', ip: '192.168.41.107' },
      { name: 'V2 - Printer - Zebr8', ip: '192.168.41.108' }
    ],
    M1: [
      { name: 'M1 - Printer - Zebr1', ip: '192.168.170.101' },
      { name: 'M1 - Printer - Zebr2', ip: '192.168.170.102' },
      { name: 'M1 - Printer - Zebr3', ip: '192.168.170.103' },
      { name: 'M1 - Printer - Zebr4', ip: '192.168.170.104' },
      { name: 'M1 - Printer - Zebr5', ip: '192.168.170.105' },
      { name: 'M1 - Printer - Zebr6', ip: '192.168.170.106' },
      { name: 'M1 - Printer - Zebr7', ip: '192.168.170.107' },
      { name: 'M1 - Printer - Zebr8', ip: '192.168.170.108' }
    ]
  };

  filteredPrinters: { name: string; ip: string }[] = [];
  busy = false;
  message = '';

  constructor(private printService: PrintService, private router: Router) { }

  goToReprint() {
    this.router.navigate(['/company/156/reprint']);
  }

  onWarehouseChange() {
    this.filteredPrinters = this.warehouse
      ? (this.printersByWarehouse[this.warehouse] || [])
      : [];
    this.printerIp = this.filteredPrinters.length ? this.filteredPrinters[0].ip : '';
  }

  print() {
    if (!this.ean.trim()) { alert('Inserisci EAN.'); return; }
    if (!this.baseUdc.trim()) { alert('Inserisci Base UDC.'); return; }
    if (!this.warehouse) { alert('Seleziona un magazzino (V1, V2 o M1).'); return; }
    if (!this.printerIp) { alert('Seleziona una stampante.'); return; }

    this.busy = true;
    this.message = '';

    this.printService.print156({
      ip: this.printerIp,
      port: this.port,
      ean: this.ean.trim(),
      baseUdc: this.baseUdc.trim()
    }).subscribe({
      next: () => { this.message = 'Stampa avviata.'; this.busy = false; },
      error: (err) => {
        const msg = err?.error || err?.message || 'Errore sconosciuto.';
        alert('Errore durante la stampa: ' + msg);
        this.message = 'Errore';
        this.busy = false;
      }
    });
  }
}
