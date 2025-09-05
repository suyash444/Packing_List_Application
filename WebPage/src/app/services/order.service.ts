import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ArticleOrder {
  sku: string;
  udc: string;
  position: string;
  qnt: number;
  tot?: number;
}

export interface OrderResponse {
  customerOrder: string;
  status: number;
  salesOrder: string;
  articleOrders: ArticleOrder[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
 
  private baseUrl = '/core/api/PurchaseShort';

  constructor(private http: HttpClient) { }

  getOrderPosition(order: string): Observable<OrderResponse[]> {
    const url = `${this.baseUrl}/getOrderPosition/156`;
    const params = new HttpParams()
      .set('customerOrder', order)
      .set('viewUdc', true)
      .set('sku', true);

    return this.http.get<OrderResponse[]>(url, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 422) {
          return throwError(() => 'Ordine non presente');
        }
        return throwError(() => error.message);
      })
    );
  }
}
