import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {TeamService} from '../../../services/team.service';
import {LeagueService} from '../../../services/league.service';
import {TeamDto} from '../../../model/playermodel/TeamDto';
import {HttpResponse} from '@angular/common/http';
import {SharedService} from '../../../services/shared.service';
import {NationalityDto} from '../../../model/sharedmodel/NationalityDto';
import {PositionDto} from '../../../model/playermodel/PositionDto';
import {PlayerDto} from '../../../model/playermodel/PlayerDto';
import {LeagueDto} from "../../../model/playermodel/LeagueDto";
import {PlayerMarketValueDto} from "../../../model/playermodel/PlayerMarketValueDto";
import {PlayerTeamContract} from "../../../model/playermodel/PlayerTeamContract";
import {DatePipe} from "@angular/common";
import {PlayerService} from "../../../services/player.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-new-player',
  templateUrl: './add-new-player.component.html',
  styleUrls: ['./add-new-player.component.css']
})
export class AddNewPlayerComponent implements OnInit {
  playerForm: FormGroup;
  defaultDateOfBirth:Date;
  maxDateOfBirth: Date;
  isFreePlayer: number = 0;  // Variable pour gérer l'état du joueur libre

  playerTeamAndContract: FormGroup;
  nationalityDto!: NationalityDto[];
  positionDto!: PositionDto[];
  footOptions = [
    { value: 1, viewValue: 'Pied Droit' },
    { value: 2, viewValue: 'Pied Gauche' },
    { value: 3, viewValue: 'Les deux pieds' }
  ];

  previewUrl: string | ArrayBuffer | null = null;

  leaguesDto!: LeagueDto[];
  allTeamsDto!: TeamDto[]; // Toutes les équipes récupérées
  filteredTeamsDto!: TeamDto[]; // Équipes filtrées selon la ligue sélectionnée

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private leagueService: LeagueService,
    private sharedService: SharedService,
    private datePipe: DatePipe,
    private playerService: PlayerService,
    private router:Router
  ) {
    const today = new Date();
    this.maxDateOfBirth = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());

    // Calculer la date par défaut (aujourd'hui - 18 ans)
    this.defaultDateOfBirth = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    // Initialisation du formulaire principal
    this.playerForm = this.fb.group({
      playerPicture: [null, Validators.required],
      playerFirstName: ['', Validators.required],
      playerLastName: ['', Validators.required],
      playerHeight: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      playerWeight: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      playerFoot: [null, Validators.required],
      nationalityId: [null, Validators.required],
      positionId: [null, Validators.required],
      playerBirthDate: [this.defaultDateOfBirth, Validators.required],
      playerMarketValue: [null, [Validators.required, Validators.min(0)]],
    });

    // Initialisation du formulaire de l'équipe et du contrat avec le validateur personnalisé
    this.playerTeamAndContract = this.fb.group({
      leagueId: ['', Validators.required],
      teamId: [{ value: '', disabled: true }, Validators.required], // Désactivé par défaut
      contractStartDate: ['', Validators.required],
      contractEndDate: [{ value: '', disabled: true }, Validators.required], // Désactivé par défaut
      contractValue: ['', [Validators.required, Validators.min(0)]],
      isFreePlayer: [false]  // Ajout du champ "Joueur libre"

    }, { validators: this.dateValidator }); // Ajouter le validateur personnalisé
  }

  ngOnInit(): void {
    this.getAllNationality();
    this.getAllPosition();
    this.getAllLeagues();
    this.getAllTeams();

    // Réagir à la sélection de la ligue
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

  // Filtrer les équipes en fonction de la ligue sélectionnée
  filterTeamsByLeague(leagueId: number) {
    this.filteredTeamsDto = this.allTeamsDto.filter(team => team.league.leagueId === leagueId);
    // Réinitialiser la sélection de l'équipe
    this.playerTeamAndContract.patchValue({ teamId: '' });
  }

  // Gestion de la sélection de fichier
  onFileSelected(event: Event) {
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

  // Soumettre le formulaire
  onSubmit() {
    if (this.playerForm.valid && this.playerTeamAndContract.valid) {
      const playerDto=new PlayerDto;
      playerDto.playerFirstName=this.playerForm.value.playerFirstName;
      playerDto.playerLastName=this.playerForm.value.playerLastName;
      playerDto.playerHeight=this.playerForm.value.playerHeight;
      playerDto.playerWeight=this.playerForm.value.playerWeight;
      playerDto.playerFoot=this.playerForm.value.playerFoot;
      playerDto.isFreePlayer= this.isFreePlayer  // Ajout du statut joueur libre dans les données envoyées
console.log(playerDto);
      playerDto.playerBirthDate=this.datePipe.transform(this.playerForm.value.playerBirthDate, 'yyyy-MM-dd');
  playerDto.playerImage=this.playerForm.value.playerPicture;
    const nationalityDto = new NationalityDto();
      nationalityDto.nationalityId=this.playerForm.value.nationalityId;
      playerDto.nationalityDto=nationalityDto;
      const positionDto = new PositionDto();
      positionDto.positionId=this.playerForm.value.positionId;
      playerDto.positionDto=positionDto;
      const playerMarketValue = new PlayerMarketValueDto();
      playerMarketValue.playerMarketValue=this.playerForm.value.playerMarketValue;
      playerDto.playerMarketValueDto=playerMarketValue;
      const playerTeamContract=new PlayerTeamContract();

      playerTeamContract.contractStartDate= this.datePipe.transform(this.playerTeamAndContract.value.contractStartDate, 'yyyy-MM-dd');
      playerTeamContract.contractEndDate= this.datePipe.transform(this.playerTeamAndContract.value.contractEndDate, 'yyyy-MM-dd');
      playerTeamContract.contractValue=this.playerTeamAndContract.value.contractValue;
      const team=new TeamDto()
      team.teamId=this.playerTeamAndContract.value.teamId;
      playerTeamContract.teamDto=team;
      playerDto.playerTeamContractDto=playerTeamContract;
      // Envoyer les données au service approprié
       // Exemple d'envoi des données :
      this.playerService.addPlayer(playerDto).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status == 200) {
            Swal.fire({
              icon: "success",
              title: "Succès",
              text: "Le joueur a été ajouté avec succès!",
              timer: 5000,
              timerProgressBar: true,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate(['/player/ListPlayers']);
             });
          }
        },
        error: (error) => console.log(error),
      });

    } else {
      console.warn('Formulaire invalide');
    }

  }
  // Gérer l'état de joueur libre
  onFreePlayerChange(isFree: boolean): void {

    // Activer ou désactiver les contrôles de l'équipe et du contrat
    if (isFree) {
      this.playerTeamAndContract.get('teamId')?.disable(); // Désactiver l'équipe
      this.playerTeamAndContract.get('contractEndDate')?.disable(); // Désactiver la date de fin
      this.playerTeamAndContract.get('contractStartDate')?.disable(); // Désactiver la date de fin
      this.playerTeamAndContract.get('contractValue')?.disable(); // Désactiver la date de fin
      this.playerTeamAndContract.get('leagueId')?.disable(); // Désactiver la date de fin
      this.isFreePlayer = 1;


    } else {
      this.playerTeamAndContract.get('teamId')?.enable(); // Désactiver l'équipe
      this.playerTeamAndContract.get('contractEndDate')?.enable(); // Désactiver la date de fin
      this.playerTeamAndContract.get('contractStartDate')?.enable(); // Désactiver la date de fin
      this.playerTeamAndContract.get('contractValue')?.enable(); // Désactiver la date de fin
      this.playerTeamAndContract.get('leagueId')?.enable(); // Désactiver la date de fin
      this.isFreePlayer = 0;

    }
     // Revalider le formulaire de l'équipe et du contrat
    this.playerTeamAndContract.updateValueAndValidity();

  }
}
