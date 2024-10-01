import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LeagueService} from "../../../services/league.service";
import {TeamService} from "../../../services/team.service";
import {TeamDto} from "../../../model/playermodel/TeamDto";
import {PlayerDto} from "../../../model/playermodel/PlayerDto";
import {NationalityDto} from "../../../model/sharedmodel/NationalityDto";
import {PositionDto} from "../../../model/playermodel/PositionDto";
import {HttpResponse} from "@angular/common/http";
import {SharedService} from "../../../services/shared.service";
import Swal from "sweetalert2";
import {PlayerService} from "../../../services/player.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-update-player-information',
  templateUrl: './update-player-information.component.html',
  styleUrls: ['./update-player-information.component.css']
})
export class UpdatePlayerInformationComponent implements OnInit{
  playerForm:FormGroup;
  maxDateOfBirth: Date;
  nationalityDto!: NationalityDto[];
  positionDto!: PositionDto[];
  footOptions = [
    { value: 1, viewValue: 'Pied Droit' },
    { value: 2, viewValue: 'Pied Gauche' },
    { value: 3, viewValue: 'Les deux pieds' }
  ];
  constructor(
    private dialogRef: MatDialogRef<UpdatePlayerInformationComponent>,
    private fb: FormBuilder,
    private leagueService: LeagueService,
    private teamService: TeamService,
    private sharedService:SharedService,
    private playerService:PlayerService,
    private datePipe:DatePipe,
    @Inject(MAT_DIALOG_DATA) public player: PlayerDto
  ) {
    const today = new Date();
    this.maxDateOfBirth = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());

    // Calculer la date par défaut (aujourd'hui - 18 ans)
    // Initialisation du formulaire principal
    // Initialisation du formulaire principal
    this.playerForm = this.fb.group({
      playerPicture: [null],
      playerFirstName: [player.playerFirstName, Validators.required],
      playerLastName: [player.playerLastName, Validators.required],
      playerHeight: [player.playerHeight, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      playerWeight: [player.playerWeight, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      playerFoot: [this.getPlayerFootValue(player.playerFoot), Validators.required], // Initialisation de pied fort
      nationalityId: [player.nationalityDto?.nationalityId || null, Validators.required], // Nationalité par défaut
      positionId: [player.positionDto?.positionId || null, Validators.required], // Position par défaut
      playerBirthDate: [player.playerBirthDate, Validators.required]
    });

  }
  previewUrl: string | ArrayBuffer | null = null;

  // Gestion de la sélection de fichier
  onFileSelected(event: Event) {
    this.defaultImage=""
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.playerForm.patchValue({ playerPicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }
  defaultImage!: string;

  ngOnInit(): void {
    this.getAllNationality();
    this.getAllPosition();
    this.defaultImage = this.player.playerImage;

this.player.playerFoot

  }
  // Méthode pour récupérer la valeur du pied fort
  private getPlayerFootValue(playerFoot: number): number {
    return playerFoot; // Retourne simplement la valeur telle quelle (1, 2 ou 3)
  }
  // Récupérer toutes les nationalités
  getAllNationality() {
    this.sharedService.getAllNationality().subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.nationalityDto = response.body;
        }
      },
      error: (error) => console.error('Erreur lors de la récupération des nationalités:', error)
    });
  }

  // Récupérer toutes les positions
  getAllPosition() {
    this.sharedService.getAllPosition().subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.positionDto = response.body;
        }
      },
      error: (error) => console.error('Erreur lors de la récupération des positions:', error)
    });
  }

onSubmit()
{
  if(this.playerForm.valid)
  {
    const playerDto=new PlayerDto;
    playerDto.playerId=this.player.playerId;
    playerDto.playerFirstName=this.playerForm.value.playerFirstName;
    playerDto.playerLastName=this.playerForm.value.playerLastName;
    playerDto.playerHeight=this.playerForm.value.playerHeight;
    playerDto.playerWeight=this.playerForm.value.playerWeight;
    playerDto.playerFoot=this.playerForm.value.playerFoot;
     console.log(playerDto);
    playerDto.playerBirthDate=this.datePipe.transform(this.playerForm.value.playerBirthDate, 'yyyy-MM-dd');
    playerDto.playerImage=this.playerForm.value.playerPicture;
    const nationalityDto = new NationalityDto();
    nationalityDto.nationalityId=this.playerForm.value.nationalityId;
    playerDto.nationalityDto=nationalityDto;
    const positionDto = new PositionDto();
    positionDto.positionId=this.playerForm.value.positionId;
    playerDto.positionDto=positionDto;
    this.playerService.updatePlayer(playerDto).subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.status == 200) {
          Swal.fire({
            icon: "success",
            title: "Succès",
            text: "Le joueur a été modifiée avec succès!",
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
