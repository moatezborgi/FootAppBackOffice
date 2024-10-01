import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../Environnements/environment";
import {AuthenticationRequest} from "../model/sharedmodel/AuthenticationRequest";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.baseUrl+"/Authentication/User";

  constructor(private http: HttpClient) {}

  userAuthentication(authenticationRequest:AuthenticationRequest): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.baseUrl+'/userAuthentication',authenticationRequest, { observe: 'response' });
  }
}
