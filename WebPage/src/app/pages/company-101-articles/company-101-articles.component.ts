import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrintService } from '../../services/print.service';
import { BIG_BY_WAREHOUSE, type Printer, type WarehouseCode } from '../../printers/printer-catalog';

@Component({
  selector: 'app-company-101-articles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './company-101-articles.component.html',
  styleUrls: ['./company-101-articles.component.css']
})
export class Company101ArticlesComponent {
  title = 'Etichetta Articoli';

  // form
  qr = '';
  place = '';
  ean = '';

  // printers (use BIG/ZEBR)
  warehouses: { code: WarehouseCode }[] = [{ code: 'V1' }, { code: 'V2' }, { code: 'M1' }];
  warehouse: WarehouseCode | '' = '';
  filteredPrinters: Printer[] = [];
  printerIp = '';
  port = 9100;

  // ui state
  busy = false;
  canPrint = false;
  toast: { text: string; type: 'success' | 'warning' | 'error' } | null = null;
  private toastTimer: any;

  @ViewChild('eanInput') eanInput!: ElementRef<HTMLInputElement>;
  @ViewChild('qrInput') qrInput!: ElementRef<HTMLInputElement>;
  @ViewChild('placeInput') placeInput!: ElementRef<HTMLInputElement>;
  constructor(private printService: PrintService) { }

  
  private showToast(text: string, type: 'success' | 'warning' | 'error' = 'success', ms = 1800) {
    clearTimeout(this.toastTimer);
    this.toast = { text, type };
    this.toastTimer = setTimeout(() => (this.toast = null), ms);
    if ('vibrate' in navigator) (navigator as any).vibrate(20);
  }

  onWarehouseChange() {
    this.filteredPrinters = this.warehouse ? (BIG_BY_WAREHOUSE[this.warehouse] || []) : [];
    this.printerIp = this.filteredPrinters[0]?.ip ?? '';
  }

  // Shift focus from QR to EAN when user presses Enter or after scan
  goToEan() {
    setTimeout(() => this.eanInput?.nativeElement?.focus(), 0);
  }
  goToQr() {
    setTimeout(() => this.qrInput?.nativeElement?.focus(), 0);
  }

  // Validate QR + EAN against backend 
  validate() {
    if (this.busy) { return; } 
    const qr = this.qr;
    const ean = this.ean.trim();
    if (!qr) { this.showToast('Inserisci/scansiona il QR.', 'warning'); return; }
    if (!ean) { this.showToast('Inserisci/scansiona l’EAN.', 'warning'); return; }

    this.busy = true; this.canPrint = false;
    this.printService.validate101({ qr, ean }).subscribe({
      next: () => {
        this.busy = false;
        this.canPrint = true;
        if (this.warehouse && this.printerIp) {
          this.print();
        } else {
          if (!this.warehouse) this.showToast('Seleziona un magazzino.', 'warning', 2000);
          else if (!this.printerIp) this.showToast('Seleziona una stampante.', 'warning', 2000);
        }
      },
      error: (err: any) => {
        this.busy = false;
        const msg = err?.error || err?.message || 'Validazione non riuscita.';
        this.showToast(msg, 'error', 2200);
      }
    });
  }

  private focusQr() {
    setTimeout(() => this.qrInput?.nativeElement?.focus(), 0);
  } private focusPosition() {
    setTimeout(() => this.placeInput?.nativeElement?.focus(), 0);
  }

  clearFields() {
    this.qr = '';
    this.ean = '';
    this.canPrint = false;
    this.focusQr();
    this.showToast('Campi puliti.', 'success', 1200);
  }

  private resetForNext() {
    this.qr = '';
    this.ean = '';
    this.canPrint = false;
    this.focusQr();
  }

 
  ngAfterViewInit() { this.focusPosition(); }

  print() {
    if (!this.place.trim()) { this.showToast("Inserisci la postazione.", "warning", 2000);return;}
    if (!this.canPrint) { this.showToast('Conferma prima QR ed EAN.', 'warning'); return; }
    if (!this.warehouse) { this.showToast('Seleziona un magazzino.', 'warning'); return; }
    if (!this.printerIp) { this.showToast('Seleziona una stampante.', 'warning'); return; }

    this.busy = true;

    this.printService.print101({
      ip: this.printerIp,
      port: this.port,
      place: this.place.trim(),
      qr: this.qr,
      ean: this.ean.trim()
      
    }).subscribe({
      next: () => {
        this.busy = false;
        this.showToast('Etichetta stampata con successo.', 'success');
        this.resetForNext();
        this.focusQr();

      },
      error: (err: any) => {                    
        this.busy = false;
        const msg = err?.error || err?.message || 'Errore durante la stampa.';
        this.showToast(msg, 'error', 2200);
        this.focusQr();
      }
    });
  }

}
