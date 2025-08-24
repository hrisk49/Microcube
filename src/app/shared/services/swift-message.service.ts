import { Injectable } from '@angular/core';
import { ApiService } from '../../core/service/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Backend DTO Interface
export interface SwiftMessageRequest {
  branchId: string;
  msgType: number;
  refNo: string | null;
  msgFromDate: string;
  msgToDate: string;
  orgnBrId: string | null;
}

// CBS Data Interface - Updated to match backend response
export interface CBSData {
  msgRefNo: string;
  makeBy: string;
  makeDate: string;
  issueDate: string;
  auth1stBy: string;
  auth1stDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class SwiftMessageService extends ApiService<any> {
  private readonly swiftMessageEndpoint = 'swift-message/';

  constructor() {
    super('swift-message/');
  }

  /**
   * Load Swift messages from backend based on search criteria
   */
  getSwiftMessages(request: SwiftMessageRequest): Observable<CBSData[]> {
    return this.http.post<CBSData[]>(`${environment.apiBaseUrl}${this.swiftMessageEndpoint}get-list`, request);
  }

  /**
   * Load Swift messages from CBS
   */
  getCBSMessages(request: SwiftMessageRequest): Observable<CBSData[]> {
    return this.http.post<CBSData[]>(`${environment.apiBaseUrl}${this.swiftMessageEndpoint}get-cbs-list`, request);
  }

  /**
   * Load Swift messages from SWIFTLINK
   */
  getSwiftLinkMessages(request: SwiftMessageRequest): Observable<CBSData[]> {
    return this.http.post<CBSData[]>(`${environment.apiBaseUrl}${this.swiftMessageEndpoint}get-swiftlink-list`, request);
  }
} 