import { Injectable } from '@angular/core';
import {ApiService} from '../../../core/service/api.service';
import {Mx053Model} from '../model/mx053.model';
import {PACS_053} from '../../../shared/constant/api.constant';

@Injectable({
  providedIn: 'root'
})
export class Pacs053Service extends ApiService<Mx053Model>{

  constructor() {
    super(PACS_053);
  }
}
