import { Injectable } from '@angular/core';
import { ApiService } from '../../core/service/api.service';
import { API_VERSION, CURRENCY } from '../constant/api.constant';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CurrencyModel } from '../../shared/models/currency.model';
@Injectable({
  providedIn: 'root'
})
export class CurrencyService extends ApiService<any>{
constructor() {
    super(CURRENCY);
  }

  getAllCurrency(): Observable<CurrencyModel[]> {
    debugger;
    var url=`${this.baseUrl}get-all`;
    return this.http.get<CurrencyModel[]>(url);
  }
}
