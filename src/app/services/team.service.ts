import { Injectable } from '@angular/core';
import {environment} from "../../Environnements/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {LeagueDto} from "../model/playermodel/LeagueDto";
import {TeamDto} from "../model/playermodel/TeamDto";

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private baseUrl = environment.baseUrl+"/Team";

  constructor(private http: HttpClient) {}

  getAllTeams(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(this.baseUrl+'/getAllTeams',{ observe: 'response' });
  }
  addTeam(teamDto:TeamDto): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.baseUrl+'/addTeam',teamDto, { observe: 'response' });
  }
  updateTeam(teamDto:TeamDto): Observable<HttpResponse<any>> {
    return this.http.put<any>(this.baseUrl+'/updateTeam',teamDto, { observe: 'response' });
  }
}
