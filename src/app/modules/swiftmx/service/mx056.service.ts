import { Injectable } from '@angular/core';
import {ApiService} from "../../../core/service/api.service";
import {PACS_056} from "../../../shared/constant/api.constant";
@Injectable({
  providedIn: 'root'
})
export class Mx056Service extends ApiService<Mx056Model>{

constructor() {
        super(PACS_056); // base path declaration for mx056
    }
}
