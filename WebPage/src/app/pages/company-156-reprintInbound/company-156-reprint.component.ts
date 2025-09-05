import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrintService } from '../../services/print.service';
import { RouterModule } from '@angular/router';
import {
  SMALL_BY_WAREHOUSE,
  type Printer,
  type WarehouseCode,
} from '../../printers/printer-catalog';

@Component({
  selector: 'app-company-156-reprint',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './company-156-reprint.component.html',
  styleUrls: ['./company-156-reprint.component.css']
})
export class Company156ReprintComponent {
  title = 'Inbound Ristampa'; 

  
  udc = '';

  // warehouse + printer selection
  warehouses: { code: WarehouseCode }[] = [{ code: 'V1' }, { code: 'V2' }, { code: 'M1' }];
  warehouse: WarehouseCode | '' = '';
  filteredPrinters: Printer[] = [];
  printerIp = '';
  port = 9100;

 
  busy = false;
  message = '';

  constructor(private printService: PrintService) { }

  // When a warehouse is picked, load ETQ printers for that site
  onWarehouseChange() {
    this.filteredPrinters = this.warehouse ? SMALL_BY_WAREHOUSE[this.warehouse] : [];
    this.printerIp = this.filteredPrinters[0]?.ip ?? '';
  }
  reprint() {
    if (!this.udc.trim()) { alert('Inserisci UDC.'); return; }
    if (!this.warehouse) { alert('Seleziona un magazzino (V1, V2 o M1).'); return; }
    if (!this.printerIp) { alert('Seleziona una stampante.'); return; }

    this.busy = true;
    this.message = '';

    this.printService.reprint156({
      ip: this.printerIp,
      port: this.port,
      udc: this.udc.trim()
    }).subscribe({
      next: () => { this.message = 'Reprint avviato.'; this.busy = false; },
      error: (err) => {
        const msg = err?.error || err?.message || 'Errore sconosciuto.';
        alert('Errore durante il reprint: ' + msg);
        this.message = 'Errore';
        this.busy = false;
      }
    });
  }
}
