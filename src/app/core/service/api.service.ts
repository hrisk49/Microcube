import {inject} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {API_VERSION} from '../../shared/constant/api.constant';

export class ApiService<I> {

  protected http = inject(HttpClient);
  private readonly fullBaseUrl: string;

  constructor(basePath: string) {
    this.fullBaseUrl = environment.apiBaseUrl + API_VERSION + basePath;
  }

  save(data: I): Observable<I> {
    return this.http.post<I>(this.fullBaseUrl, data);
  }

  update(i: I): Observable<I> {
    return this.http.put<I>(this.fullBaseUrl, i);
  }

  delete(uuid: any): Observable<I> {
    return this.http.delete<I>(this.fullBaseUrl + '/' + uuid);
  }

}
