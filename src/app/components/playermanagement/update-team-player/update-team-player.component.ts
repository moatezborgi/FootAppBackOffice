import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LeagueService} from "../../../services/league.service";
import {TeamService} from "../../../services/team.service";
import {SharedService} from "../../../services/shared.service";
import {PlayerService} from "../../../services/player.service";
import {DatePipe} from "@angular/common";
import {PlayerDto} from "../../../model/playermodel/PlayerDto";
import {HttpResponse} from "@angular/common/http";
import {LeagueDto} from "../../../model/playermodel/LeagueDto";
import {TeamDto} from "../../../model/playermodel/TeamDto";
import {PlayerTeamContract} from "../../../model/playermodel/PlayerTeamContract";
import Swal from "sweetalert2";

@Component({
  selector: 'app-update-team-player',
  templateUrl: './update-team-player.component.html',
  styleUrls: ['./update-team-player.component.css']
})
export class UpdateTeamPlayerComponent implements OnInit{
  playerTeamAndContract:FormGroup;

  constructor(
    private dialogRef: MatDialogRef<UpdateTeamPlayerComponent>,
    private fb: FormBuilder,
    private leagueService: LeagueService,
    private teamService: TeamService,
    private sharedService:SharedService,
    private playerService:PlayerService,
    private datePipe:DatePipe,
    @Inject(MAT_DIALOG_DATA) public player: PlayerDto
  ) {
    this.playerTeamAndContract = this.fb.group({
      leagueId: ['', Validators.required],
      teamId: [{ value: '', disabled: true }, Validators.required], // Désactivé par défaut
      contractStartDate: ['', Validators.required],
      contractEndDate: [{ value: '', disabled: true }, Validators.required], // Désactivé par défaut
      contractValue: ['', [Validators.required, Validators.min(0)]],

    }, { validators: this.dateValidator }); // Ajouter le validateur personnalisé
  }
  // Validation personnalisée pour s'assurer que la date de fin est après la date de début
  dateValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const startDate = control.get('contractStartDate')?.value;
    const endDate = control.get('contractEndDate')?.value;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      console.log(start,end)
      if (end <= start) {
        return { dateInvalid: true };
      }
    }
    return null;
  }
  filterTeamsByLeague(leagueId: number) {
    this.filteredTeamsDto = this.allTeamsDto.filter(team => team.league.leagueId === leagueId);
    // Réinitialiser la sélection de l'équipe
    this.playerTeamAndContract.patchValue({ teamId: '' });
  }
  ngOnInit():void
  {
    this.getAllLeagues();
    this.getAllTeams();
  //  Réagir à la sélection de la ligue
    this.playerTeamAndContract.get('leagueId')?.valueChanges.subscribe(leagueId => {
      if (leagueId) {
        this.filterTeamsByLeague(leagueId);
        this.playerTeamAndContract.get('teamId')?.enable(); // Activer la liste des équipes
      } else {
        this.filteredTeamsDto = [];
        this.playerTeamAndContract.get('teamId')?.disable(); // Désactiver si aucune ligue sélectionnée
      }
    });

    // Réagir à la sélection de la date de début de contrat
    this.playerTeamAndContract.get('contractStartDate')?.valueChanges.subscribe(startDate => {
      if (startDate) {
        this.playerTeamAndContract.get('contractEndDate')?.enable(); // Activer la date de fin si date de début choisie
      } else {
        this.playerTeamAndContract.get('contractEndDate')?.disable(); // Désactiver si aucune date de début
      }
      // Revalider le formulaire lorsque la date de début change
      this.playerTeamAndContract.get('contractEndDate')?.updateValueAndValidity();
    });

    // Réagir à la sélection de la date de fin de contrat pour revalider le formulaire
    this.playerTeamAndContract.get('contractEndDate')?.valueChanges.subscribe(endDate => {
      this.playerTeamAndContract.updateValueAndValidity();
    });
  }
  leaguesDto!: LeagueDto[];
  allTeamsDto!: TeamDto[]; // Toutes les équipes récupérées
  filteredTeamsDto!: TeamDto[]; // Équipes filtrées selon la ligue sélectionnée

  // Récupérer toutes les ligues
  getAllLeagues() {
    this.leagueService.getAllLeagues().subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.leaguesDto = response.body;
        }
      },
      error: (error) => console.error('Erreur lors de la récupération des ligues:', error)
    });
  }

  // Récupérer toutes les équipes
  getAllTeams() {
    this.teamService.getAllTeams().subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.allTeamsDto = response.body;
          this.filteredTeamsDto = []; // Initialiser filtré vide
        }
      },
      error: (error) => console.error('Erreur lors de la récupération des équipes:', error)
    });
  }
  onSubmit()
  {
    if(this.playerTeamAndContract.valid){
      const playerDto=new PlayerDto;
  playerDto.playerId=this.player.playerId;
      const playerTeamContract=new PlayerTeamContract();

      playerTeamContract.contractStartDate= this.datePipe.transform(this.playerTeamAndContract.value.contractStartDate, 'yyyy-MM-dd');
      playerTeamContract.contractEndDate= this.datePipe.transform(this.playerTeamAndContract.value.contractEndDate, 'yyyy-MM-dd');
      playerTeamContract.contractValue=this.playerTeamAndContract.value.contractValue;
      const team=new TeamDto()
      team.teamId=this.playerTeamAndContract.value.teamId;
      playerTeamContract.teamDto=team;
      playerDto.playerTeamContractDto=playerTeamContract;
      this.playerService.updatePlayerContract(playerDto).subscribe({
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
