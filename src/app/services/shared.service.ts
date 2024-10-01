import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../Environnements/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private baseUrl = environment.baseUrl+"/Settings";

  constructor(private http: HttpClient) {}

  getAllNationality(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(this.baseUrl+'/getAllNationality',{ observe: 'response' });
  }


  getAllPosition(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(this.baseUrl+'/getAllPosition',{ observe: 'response' });
  }
}
