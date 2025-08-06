import { Injectable } from '@angular/core';
import {ApiService} from '../../../core/service/api.service';
import {Mx002Model} from '../model/mx002.model';
import {PACS_002} from '../../../shared/constant/api.constant';

@Injectable({
  providedIn: 'root'
})
export class Mx002Service extends  ApiService<Mx002Model> {

  constructor() {
    super(PACS_002);
  }
}
