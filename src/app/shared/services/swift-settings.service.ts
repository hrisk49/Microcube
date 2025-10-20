import { Injectable } from '@angular/core';
import { ApiService } from '../../core/service/api.service';
import { GET_SETTINGS_LIST, SWIFT_SETTINGS } from '../constant/api.constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwiftSettingsService extends ApiService<any> {
  constructor(){
    super(SWIFT_SETTINGS);
  }
  
  getSwiftSettingsList(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${GET_SETTINGS_LIST}`);
  }
}