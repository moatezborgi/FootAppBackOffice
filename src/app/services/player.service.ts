import { Injectable } from '@angular/core';
import {environment} from "../../Environnements/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {LeagueDto} from "../model/playermodel/LeagueDto";
import {Observable} from "rxjs";
import {PlayerDto} from "../model/playermodel/PlayerDto";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

   private baseUrl = environment.baseUrl+"/Player";

  constructor(private http: HttpClient) {}

  addPlayer(playerDto:PlayerDto): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.baseUrl+'/addPlayer',playerDto, { observe: 'response' });
  }
  getAllPlayers(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(this.baseUrl+'/getAllPlayers',{ observe: 'response' });
  }
  updatePlayer
  (playerDto:PlayerDto): Observable<HttpResponse<any>> {
    return this.http.put<any>(this.baseUrl+'/updatePlayer',playerDto, { observe: 'response' });
  }

  updatePlayerMarketValue  (playerDto:PlayerDto): Observable<HttpResponse<any>> {
    return this.http.put<any>(this.baseUrl+'/updatePlayerMarketValue',playerDto, { observe: 'response' });
  }



  updatePlayerContract  (playerDto:PlayerDto): Observable<HttpResponse<any>> {
    return this.http.put<any>(this.baseUrl+'/updatePlayerContract',playerDto, { observe: 'response' });
  }

}
