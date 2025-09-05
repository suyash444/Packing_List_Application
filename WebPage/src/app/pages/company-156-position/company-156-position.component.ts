import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  OrderService,
  OrderResponse,
  ArticleOrder
} from '../../services/order.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-company-156-position',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './company-156-position.component.html',
  styleUrls: ['./company-156-position.component.css']
})
export class Company156PositionComponent {
  
  orderInput: string = '';
  orders: OrderResponse[] = [];
  currentArticles: ArticleOrder[] = [];
  currentIndex: number = 0;
  totalArticles: number = 0;
  errorMsg: string = '';
  userUdc: string = '';

  private scanned = new Set<number>();
  private udcIndex = new Map<string, number>();

  private positionTotals = new Map<string, number>();
  private positionScanned = new Map<string, number>();

  toast: { text: string; type: 'success' | 'warning' | 'error' } | null = null;
  private toastTimer: any = null;

  constructor(private orderService: OrderService) { }

  get completed(): number {
    return this.scanned.size;
  }
  get remaining(): number {
    return Math.max(0, this.totalArticles - this.completed);
  }

  private showMessage(
    text: string,
    type: 'success' | 'warning' | 'error' = 'success',
    ms = 1500
  ) {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { text, type };
    this.toastTimer = setTimeout(() => (this.toast = null), ms);
    if ('vibrate' in navigator) (navigator as any).vibrate(30);
  }

  searchOrder() {
    this.errorMsg = '';
    this.orders = [];
    this.currentArticles = [];
    this.currentIndex = 0;
    this.totalArticles = 0;
    this.scanned.clear();
    this.udcIndex.clear();

    this.positionTotals.clear();
    this.positionScanned.clear();

    this.orderService.getOrderPosition(this.orderInput).subscribe({
      next: (data) => {
        this.orders = data;
        this.currentArticles = this.flattenArticles();
        this.totalArticles = this.currentArticles.length;

        this.currentArticles.forEach((a, i) => {
          if (a?.udc) this.udcIndex.set(a.udc, i);
        });

        this.currentArticles.forEach(a => {
          if (a?.position) this.positionTotals.set(a.position, a.tot ?? 1);
        });
      },
      error: (err) => {
        this.errorMsg = err;
      }
    });
  }

  flattenArticles(): ArticleOrder[] {
    const all = this.orders.flatMap(o => o.articleOrders);
    const positionCount: { [position: string]: number } = {};
    all.forEach(item => {
      const pos = item.position;
      positionCount[pos] = (positionCount[pos] || 0) + 1;
    });
    return all.map(item => ({
      ...item,
      tot: positionCount[item.position]
    }));
  }

  next() {
    if (this.currentIndex < this.totalArticles - 1) {
      this.currentIndex++;
      this.userUdc = '';
    }
  }
  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.userUdc = '';
      if (this.scanned.has(this.currentIndex)) {
        this.showMessage('Articolo già scansionato.', 'warning');
      }
    }
  }
  jumpTo(index: number) {
    if (index >= 0 && index < this.totalArticles) {
      this.currentIndex = index;
      this.userUdc = '';
      if (this.scanned.has(this.currentIndex)) {
        this.showMessage('Articolo già scansionato.', 'warning');
      }
    }
  }
  jumpToFromInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.valueAsNumber;
    if (!isNaN(value)) {
      this.jumpTo(value - 1);
    }
  }

  scanAny() {
    const code = this.userUdc.trim();
    this.userUdc = '';
    if (!code) return;

    const idx = this.udcIndex.get(code);
    if (idx === undefined) {
      this.showMessage('UDC non presente nell’ordine.', 'error');
      return;
    }

    if (this.scanned.has(idx)) {
      this.currentIndex = idx;

      const pos = this.currentArticles[idx].position;
      const totalForPos = this.positionTotals.get(pos) ?? 0;
      const scannedForPos = this.positionScanned.get(pos) ?? 0;

      if (totalForPos > 0 && scannedForPos >= totalForPos) {
        this.showMessage(
          `Tutti gli articoli della posizione ${this.formatPosition(pos)} sono stati scansionati. Passa alla prossima posizione.`,
          'success',
          3000
        );
        this.jumpToNextIncompletePosition(pos);
      } else {
        this.showMessage('Articolo già scansionato.', 'warning');
      }
      return;
    }

    this.scanned.add(idx);

    const posCompleted = this.updatePositionProgress(idx);

    this.currentIndex = idx;

    if (!posCompleted) {
      this.showMessage(`Scansione registrata. Rimasti: ${this.remaining}`, 'success');
    }
  }

  checkUdc() {
    this.scanAny();
  }
  autoAdvance() {
    this.scanAny();
  }

  formatPosition(position: string): string {
    if (!position || position.length !== 9) return position;
    return `${position.substring(0, 2)}-${position[2]}-${position.substring(3, 5)}-${position.substring(5, 8)}-${position[8]}`;
  }

  private updatePositionProgress(idx: number): boolean {
    const pos = this.currentArticles[idx].position;
    const totalForPos = this.positionTotals.get(pos) ?? 0;

    const newCount = (this.positionScanned.get(pos) ?? 0) + 1;
    this.positionScanned.set(pos, newCount);

    if (totalForPos > 0 && newCount === totalForPos) {
      this.showMessage(
        `Tutti gli articoli della posizione ${this.formatPosition(pos)} sono stati scansionati. Passa alla prossima posizione.`,
        'success',
        3000
      );
      this.jumpToNextIncompletePosition(pos);
      return true;
    }

    return false;
  }

  private jumpToNextIncompletePosition(completedPos: string) {
    const n = this.currentArticles.length;
    const start = this.currentIndex;

    for (let step = 1; step <= n; step++) {
      const i = (start + step) % n;
      const pos = this.currentArticles[i].position;

      if (pos === completedPos) continue;

      const total = this.positionTotals.get(pos) ?? 0;
      const scanned = this.positionScanned.get(pos) ?? 0;

      if (total === 0 || scanned < total) {
        this.currentIndex = i;
        return;
      }
    }
  }
}
