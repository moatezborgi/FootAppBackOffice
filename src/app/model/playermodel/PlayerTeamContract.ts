import {TeamDto} from "./TeamDto";

export class PlayerTeamContract {
   contractId!:number;
   contractStartDate!:string | null;
   contractEndDate!:string | null;
   contractValue!:number;
   teamDto!:TeamDto;
   isActiveContract!:boolean;
}
