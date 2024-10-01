import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NationalityDto} from "../../../model/sharedmodel/NationalityDto";
import {PositionDto} from "../../../model/playermodel/PositionDto";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LeagueService} from "../../../services/league.service";
import {TeamService} from "../../../services/team.service";
import {SharedService} from "../../../services/shared.service";
import {PlayerService} from "../../../services/player.service";
import {DatePipe} from "@angular/common";
import {PlayerDto} from "../../../model/playermodel/PlayerDto";
import {PlayerMarketValueDto} from "../../../model/playermodel/PlayerMarketValueDto";
import {HttpResponse} from "@angular/common/http";
import Swal from "sweetalert2";

@Component({
  selector: 'app-update-marchand-value',
  templateUrl: './update-marchand-value.component.html',
  styleUrls: ['./update-marchand-value.component.css']
})
export class UpdateMarchandValueComponent implements OnInit{
  playerForm:FormGroup;

  constructor(
    private dialogRef: MatDialogRef<UpdateMarchandValueComponent>,
    private fb: FormBuilder,
    private leagueService: LeagueService,
    private teamService: TeamService,
    private sharedService:SharedService,
    private playerService:PlayerService,
    private datePipe:DatePipe,
    @Inject(MAT_DIALOG_DATA) public player: PlayerDto
  ) {
    this.playerForm = this.fb.group({

      playerMarketValue: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],

    })
  }
  ngOnInit(): void {
   }
  OnSubmit()
  {
    if (this.playerForm.valid) {

      const playerDto=new PlayerDto();
      playerDto.playerId=this.player.playerId;
      const playerMarketValue=new PlayerMarketValueDto();
      playerMarketValue.playerMarketValue=this.playerForm.value.playerMarketValue
      playerDto.playerMarketValueDto=playerMarketValue;
      this.playerService.updatePlayerMarketValue(playerDto).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status == 200) {
            Swal.fire({
              icon: "success",
              title: "Succès",
              text: "La valeur marchande de joueur a été modifiée avec succès!",
              timer: 5000,
              timerProgressBar: true,
              showConfirmButton: false,
            }).then(() => {
              this.dialogRef.close();
            });
          }
        },
        error: (error) => console.log(error),
      });
    }
  }
  }
