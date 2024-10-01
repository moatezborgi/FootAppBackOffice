import { Injectable } from '@angular/core';
import {environment} from "../../Environnements/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {AuthenticationRequest} from "../model/sharedmodel/AuthenticationRequest";
import {Observable} from "rxjs";
import {LeagueDto} from "../model/playermodel/LeagueDto";

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  private baseUrl = environment.baseUrl+"/League";

  constructor(private http: HttpClient) {}

  addLeague(leagueDto:LeagueDto): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.baseUrl+'/addLeague',leagueDto, { observe: 'response' });
  }
  getAllLeagues(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(this.baseUrl+'/getAllLeagues',{ observe: 'response' });
  }

  updateLeague(leagueDto:LeagueDto): Observable<HttpResponse<any>> {
    return this.http.put<any>(this.baseUrl+'/updateLeague',leagueDto, { observe: 'response' });
  }
}
