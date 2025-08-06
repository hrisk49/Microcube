import { Injectable } from '@angular/core';
import {ApiService} from "../../../core/service/api.service";
import {PACS_054} from "../../../shared/constant/api.constant";
@Injectable({
  providedIn: 'root'
})
export class Mx054Service extends ApiService<Mx054Model> {
constructor() {
        super(PACS_054); // base path declaration for mx054
    }
}
