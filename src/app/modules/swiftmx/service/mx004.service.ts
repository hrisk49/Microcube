import {Injectable} from '@angular/core';
import {ApiService} from "../../../core/service/api.service";
import {PACS_004} from "../../../shared/constant/api.constant";
import {Mx004Model} from '../model/mx004.model';

@Injectable({
    providedIn: 'root'
})
export class Mx004Service extends ApiService<Mx004Model> {

    constructor() {
        super(PACS_004); // base path declaration for mx004
    }

}
