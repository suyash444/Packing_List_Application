import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('WebPage');

  constructor(private router: Router) { }

  ngOnInit(): void {
    
    const navEntry = (performance.getEntriesByType?.('navigation')?.[0] as PerformanceNavigationTiming | undefined);
    const isReload =
      navEntry?.type === 'reload' || (performance as any)?.navigation?.type === 1; 

    if (isReload && this.router.url !== '/') {
      this.router.navigateByUrl('/');
    }
  }
}
