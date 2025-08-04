import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Mx008Service {

  url: string = 'http://localhost:8095/swiftFusionAPI/';
  http = inject(HttpClient);

  constructor() { }

  save008(model: Mx008Model): Observable<Mx008Model> {
    return this.http.post<Mx008Model>('/api/v1/pacs/mx008/save', model);
  }
}
