import {PositionDto} from "./PositionDto";
import {NationalityDto} from "../sharedmodel/NationalityDto";
import {PlayerMarketValueDto} from "./PlayerMarketValueDto";
import {PlayerTeamContract} from "./PlayerTeamContract";
export class PlayerDto {
  playerId!:number;
  playerFirstName!:string;
  playerLastName!:string;
  playerImage!:string;
  playerGender!:number; //1 homme
  playerHeight!:string;
  playerWeight!:string;
  playerFoot!:number; // 1 pied droit - 2 pied gauche -  3 deux pieds
  positionDto!:PositionDto;
  nationalityDto!:NationalityDto;
  playerBirthDate!:string | null;
  isFreePlayer!:number;
  playerMarketValueDto!:PlayerMarketValueDto;
  playerTeamContractDto!:PlayerTeamContract;
  playerMarketValueDtos!:PlayerMarketValueDto[];
  playerTeamContractDtos!:PlayerTeamContract[];
 }
