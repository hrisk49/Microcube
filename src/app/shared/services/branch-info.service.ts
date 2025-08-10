import { Injectable } from '@angular/core';
import { ApiService } from '../../core/service/api.service';
import { API_VERSION, BRANCH_INFO } from '../constant/api.constant';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchInfoService extends ApiService<any>{
  constructor() {
    super(BRANCH_INFO);
  }
  private endPoint=environment.apiBaseUrl + API_VERSION + BRANCH_INFO ;

  getBySwiftCodePrefix(swiftCode: any): Observable<any> {
    return this.http.get<any>(`${this.endPoint}get-by-swift-prefix?swiftCode=${swiftCode.swiftCode}`);
  }
}
