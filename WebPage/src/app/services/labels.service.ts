import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface PrintPayload {
  ean: string;          // barcode/EAN
  baseUdc: string;      // base UDC
  qty: number;          // number of labels
  lot?: string;         // optional lot/batch
  expiryDate?: string;  // ISO date string (yyyy-MM-dd)
  printer?: string;     // optional printer name
}

/** Payload for 156 reprint */
export interface ReprintPayload {
  jobId: string;        // or whatever your API expects
  copies: number;
}

@Injectable({ providedIn: 'root' })
export class LabelsService {
  // ⬇️ Put your real endpoints here
  private company142Base = 'https://YOUR-142-ENDPOINT'; // e.g. https://api.example.com/142
  private company156Base = 'https://YOUR-156-ENDPOINT'; // e.g. https://api.example.com/156

  private json = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  /** Company 142: print labels */
  print142(payload: PrintPayload): Observable<any> {
    // Example final path: POST {base}/labels/print
    return this.http.post(
      `${this.company142Base}/labels/print`,
      payload,
      { headers: this.json }
    );
  }

  /** Company 156: print labels */
  print156(payload: PrintPayload): Observable<any> {
    // Example final path: POST {base}/labels/print
    return this.http.post(
      `${this.company156Base}/labels/print`,
      payload,
      { headers: this.json }
    );
  }

  /** Company 156: reprint labels */
  reprint156(payload: ReprintPayload): Observable<any> {
    // Example final path: POST {base}/labels/reprint
    return this.http.post(
      `${this.company156Base}/labels/reprint`,
      payload,
      { headers: this.json }
    );
  }
}
