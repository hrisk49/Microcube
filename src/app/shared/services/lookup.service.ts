import { Injectable } from "@angular/core";
import { ApiService } from "../../core/service/api.service";
import { GET_BY_TYPE_ID, SMS_LOOKUP } from "../constant/api.constant";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LookupService extends ApiService<any>{
    constructor(){
        super(SMS_LOOKUP);
    }

    getListByTypeId(typeId: number): Observable<any>{
        return this.http.get<any>(`${this.baseUrl}${GET_BY_TYPE_ID}?typeId=${typeId}`);
    }
} 