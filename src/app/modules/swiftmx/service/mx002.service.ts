import { Injectable } from '@angular/core';
import {PACS_002} from '../../../shared/constant/api.constant';
import {ApiService} from '../../../core/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class Mx002Service extends  ApiService<Mx002Model> {

  constructor() {
    super(PACS_002);
  }
}
