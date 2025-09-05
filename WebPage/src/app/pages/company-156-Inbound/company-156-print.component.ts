import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrintService } from '../../services/print.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import {
  SMALL_BY_WAREHOUSE,
  type Printer,
  type WarehouseCode,
} from '../../printers/printer-catalog';



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

  warehouses: { code: WarehouseCode }[] = [{ code: 'V1' }, { code: 'V2' }, { code: 'M1' }];
  warehouse: WarehouseCode | '' = '';

  filteredPrinters: Printer[] = [];
  printerIp = '';
  port = 9100;

  busy = false;
  message = '';

  constructor(private printService: PrintService, private router: Router) { }

  goToReprint() {
    this.router.navigate(['/company/156/reprint']);
  }

  // Auto-load ETQ printers for the selected warehouse
  onWarehouseChange() {
    this.filteredPrinters = this.warehouse ? SMALL_BY_WAREHOUSE[this.warehouse] : [];
    this.printerIp = this.filteredPrinters[0]?.ip ?? '';
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
