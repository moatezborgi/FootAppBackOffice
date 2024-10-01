import {LeagueDto} from "./LeagueDto";

export class TeamDto {
  teamId!:number;
  teamName!:string;
  teamLogo!:string;
  league!:LeagueDto;
}
