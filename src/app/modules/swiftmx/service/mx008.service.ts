import {Injectable} from '@angular/core';
import {ApiService} from "../../../core/service/api.service";
import {MX008} from "../../../shared/constant/api.constant";

@Injectable({
    providedIn: 'root'
})
export class Mx008Service extends ApiService<Mx008Model> {

    constructor() {
        super(MX008); // base path declaration for mx008
    }

}
