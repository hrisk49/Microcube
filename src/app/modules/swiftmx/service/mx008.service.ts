import {Injectable} from '@angular/core';
import {ApiService} from "../../../core/service/api.service";
import {PACS008} from "../../../shared/constant/api.constant";

@Injectable({
    providedIn: 'root'
})
export class Mx008Service extends ApiService<Mx008Model> {

    constructor() {
        super(PACS008); // base path declaration for mx008
    }

}
