import { Injectable } from '@angular/core';
import { ApiService } from '../../core/service/api.service';
import { GET_LIST, MESSAGE_TYPE } from '../constant/api.constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageTypeService extends ApiService<any> {
  constructor(){
    super(MESSAGE_TYPE);
  }

  getList(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${GET_LIST}`, data);
  }
}
