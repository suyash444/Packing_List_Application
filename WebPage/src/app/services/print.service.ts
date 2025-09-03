import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Print142Request { ip: string; port: number; listNumber: string; company: string; }
export interface Print156Request { ip: string; port: number; ean: string; baseUdc: string; }
export interface Reprint156Request { ip: string; port: number; udc: string; }

@Injectable({ providedIn: 'root' })
export class PrintService {
 
  private readonly BASE_URL_PARAM = 'http://192.168.36.172:5021';

 
  private readonly purchase142ListEndpoint = `/core/api/Purchase/GetPurchasesByListNumber`;

 
  private readonly print142Endpoint = `/api/PrintLinclalorLabel/PrintLinclalorLabel`;

  // 156: 
  private readonly print156Endpoint = `/api/PrintLabelAcc/printAccBaseUdc`;
  private readonly reprint156Endpoint = `/api/PrintLabelAcc/ReprintLabelAcc`;

  constructor(private http: HttpClient) { }

  
  getPurchasesByList142(idCompany: string, list: string): Observable<any> {
    const url = `${this.purchase142ListEndpoint}/${idCompany}`;
    const params = new HttpParams().set('list', list);
    return this.http.get(url, { params });
  }

  /** 142: print */
  print142(req: Print142Request): Observable<string> {
    const params = new HttpParams()
      .set('baseUrl', this.BASE_URL_PARAM)
      .set('ip', req.ip)
      .set('port', String(req.port))
      .set('listNumber', req.listNumber)
      .set('company', req.company);
    const headers = new HttpHeaders({ Accept: 'text/plain' });
    return this.http.post(this.print142Endpoint, null, { params, headers, responseType: 'text' });
  }

  /** 156: print */
  print156(req: Print156Request): Observable<string> {
    const params = new HttpParams()
      .set('baseUrl', this.BASE_URL_PARAM)
      .set('ip', req.ip)
      .set('port', String(req.port))
      .set('idReceipt', '1')
      .set('Ean', req.ean)
      .set('quant', '1')
      .set('company', '156')
      .set('baseUdc', req.baseUdc)
      .set('autoconfirm', 'true');
    const headers = new HttpHeaders({ Accept: 'text/plain' });
    return this.http.post(this.print156Endpoint, null, { params, headers, responseType: 'text' });
  }

  /** 156: reprint */
  reprint156(req: Reprint156Request): Observable<string> {
    const params = new HttpParams()
      .set('baseUrl', this.BASE_URL_PARAM)
      .set('ip', req.ip)
      .set('port', String(req.port))
      .set('udc', req.udc)
      .set('company', '156');
    const headers = new HttpHeaders({ Accept: 'text/plain' });
    return this.http.post(this.reprint156Endpoint, null, { params, headers, responseType: 'text' });
  }
}
