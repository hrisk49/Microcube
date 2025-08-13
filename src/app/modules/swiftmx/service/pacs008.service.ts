import {Injectable} from '@angular/core';
import {ApiService} from "../../../core/service/api.service";
import {PACS_008, PACS_009} from "../../../shared/constant/api.constant";

@Injectable({
  providedIn: 'root'
})
export class Pacs008Service extends ApiService<Mx008Model> {

  constructor() {
    super(PACS_008); // base path declaration for pacs008
  }

}
