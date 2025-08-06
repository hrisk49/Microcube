import { Injectable } from '@angular/core';
import {ApiService} from '../../../core/service/api.service';
import {PACS_008, PACS_009} from '../../../shared/constant/api.constant';

@Injectable({
  providedIn: 'root'
})
export class Pacs009Service extends ApiService<Mx008Model> {

  constructor() {
    super(PACS_009); // base path declaration for mx009
  }
}
