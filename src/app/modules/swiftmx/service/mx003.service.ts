import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/service/api.service';
import { HttpClient } from '@angular/common/http';
import { PACS_003 } from '../../../shared/constant/api.constant';

@Injectable({
  providedIn: 'root'
})
export class Mx003Service extends ApiService<any>{
  constructor(http: HttpClient) {
    super(PACS_003);
  }
  
}
