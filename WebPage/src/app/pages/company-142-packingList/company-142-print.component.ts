import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrintService } from '../../services/print.service';
import { RouterModule } from '@angular/router';
import { BIG_BY_WAREHOUSE, type Printer, type WarehouseCode } from '../../printers/printer-catalog';

@Component({
  selector: 'app-company-142-print',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './company-142-print.component.html',
  styleUrls: ['./company-142-print.component.css']
})
export class Company142PrintComponent {
  title = 'Packing List';

 
  listNumber = '';
  company = '142';

  // warehouse & printer
  warehouses = [{ code: 'V1' }, { code: 'V2' }, { code: 'M1' }];
  warehouse: WarehouseCode | '' = '';
  filteredPrinters: Printer[] = [];
  printerIp = '';
  port = 9100;


  
  busy = false;
  message = '';

  constructor(private printService: PrintService) { }

 

  // When the user selects a warehouse, we auto-load BIG (ZBR) printers for that site
  onWarehouseChange() {
    this.filteredPrinters = this.warehouse ? BIG_BY_WAREHOUSE[this.warehouse] : [];
    this.printerIp = this.filteredPrinters[0]?.ip ?? '';
  }

  
  print() {
    if (!this.listNumber.trim()) { alert('Per favore inserisci il numero lista.'); return; }
    if (!this.warehouse) { alert('Seleziona un magazzino (V1, V2 o M1).'); return; }
    if (!this.printerIp) { alert('Seleziona una stampante.'); return; }

    const list = this.listNumber.trim();
    this.busy = true; this.message = '';

    
    this.printService.getPurchasesByList142(this.company, list).subscribe({
      next: (data) => {
        
        const found = Array.isArray(data) ? data.length > 0 : !!data;
        if (!found) {
          alert('Numero lista non trovato.');
          this.busy = false; return;
        }
        
        this.printService.print142({
          ip: this.printerIp,
          port: this.port,
          listNumber: list,
          company: this.company
        }).subscribe({
          next: () => { this.message = 'Stampa avviata.'; this.busy = false; },
          error: (err) => {
            const status = err?.status ?? 'network';
            const body = typeof err?.error === 'string'
              ? err.error
              : err?.error?.message || err?.message || 'Errore sconosciuto.';
            alert(`Errore stampa (${status}): ${body}`);
            this.message = 'Errore'; this.busy = false;
          }
        });
      },
      error: (err) => {
        const status = err?.status ?? 'network';
        const body = typeof err?.error === 'string'
          ? err.error
          : err?.error?.message || err?.message || 'Errore sconosciuto.';
        alert(`Errore verifica lista (${status}): ${body}`);
        this.busy = false;
      }
    });
  }

}
