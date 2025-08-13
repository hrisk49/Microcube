import { Injectable } from '@angular/core';
import {ApiService} from "../../../core/service/api.service";
import {PACS_055} from "../../../shared/constant/api.constant";

@Injectable({
  providedIn: 'root'
})
export class Mx055Service extends ApiService<Mx055Model>{

constructor() {
        super(PACS_055); // base path declaration for mx055
    }
}
