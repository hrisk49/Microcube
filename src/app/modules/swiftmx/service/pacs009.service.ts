import { Injectable } from '@angular/core';
import {ApiService} from '../../../core/service/api.service';
import {PACS_009} from '../../../shared/constant/api.constant';
import {Mx009Model} from '../model/mx009.model';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class Pacs009Service extends ApiService<Mx009Model> {

  constructor() {
    super(PACS_009); // base path declaration for mx009
  }
}
