import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NationalityDto } from "../../../model/sharedmodel/NationalityDto";
import { map, Observable, startWith } from "rxjs";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LeagueService } from "../../../services/league.service";
import { SharedService } from "../../../services/shared.service";
import { LeagueDto } from "../../../model/playermodel/LeagueDto";
import { HttpResponse } from "@angular/common/http";
import Swal from "sweetalert2";

@Component({
  selector: 'app-update-league',
  templateUrl: './update-league.component.html',
  styleUrls: ['./update-league.component.css']
})
export class UpdateLeagueComponent implements OnInit {
  leagueForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  nationalityDto: NationalityDto[] = [];
  filteredNationalities!: Observable<NationalityDto[]>;

  selectedNationalityId!: number;
  selectedNationalityName: string = '';
  defaultImage!:string;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateLeagueComponent>,
    private leagueService: LeagueService,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public league: LeagueDto,
  ) {
    this.leagueForm = this.fb.group({
      leagueName: [league.leagueName || '', Validators.required],
      leagueLogo: [],
      nationality: [league.leagueNationalityName || '', Validators.required] // Pré-remplir avec le nom de la nationalité
    });
  }

  ngOnInit(): void {
    this.getAllNationality();

    // Filtrer les nationalités basées sur l'entrée de l'utilisateur
    this.filteredNationalities = this.leagueForm.get('nationality')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNationalities(value))
    );

    // Initialiser la nationalité sélectionnée
    this.initializeNationality();
  }

  private initializeNationality() {
    const initialNationality = this.nationalityDto.find(nationality => nationality.nationalityName === this.league.leagueNationalityName);
    if (initialNationality) {
      this.selectedNationalityId = initialNationality.nationalityId;
      this.selectedNationalityName = initialNationality.nationalityName;
      this.leagueForm.patchValue({ nationality: this.selectedNationalityName });
    }

    // Afficher l'image si elle est fournie
    if (this.league.leagueLogo) {
      this.defaultImage = this.league.leagueLogo;
    }
  }

  private _filterNationalities(value: string): NationalityDto[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.nationalityDto.filter(option => option.nationalityName.toLowerCase().includes(filterValue));
  }

  onNationalitySelected(event: any) {
    const selectedNationality = this.nationalityDto.find(nationality => nationality.nationalityName === event.option.value);
    if (selectedNationality) {
      this.selectedNationalityId = selectedNationality.nationalityId;
      this.selectedNationalityName = selectedNationality.nationalityName;
      this.leagueForm.patchValue({ nationality: this.selectedNationalityName });
    }
  }

  onNationalityInput(event: any) {
    this.selectedNationalityName = event.target.value;
  }

  onSubmit() {
    if (this.leagueForm.valid) {
      const league = new LeagueDto();
      league.leagueName = this.leagueForm.value.leagueName;
      if(this.leagueForm.value.leagueLogo)
      {
      league.leagueLogo = this.leagueForm.value.leagueLogo;
      }
      else
      {
        league.leagueLogo=this.league.leagueLogo;
      }
      if(this.selectedNationalityId)
      {
        league.leagueNationality = this.selectedNationalityId;

      }
      else
      {
        league.leagueNationality=this.league.leagueNationality;
      }
      league.leagueId=this.league.leagueId;
      console.log(league)
      this.leagueService.updateLeague(league).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status == 200) {
            Swal.fire({
              icon: "success",
              title: "Succès",
              text: "Le championnat a été modifié avec succès!",
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

  onFocus() {
    this.autocompleteTrigger.openPanel();
  }

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

  onFileSelected(event: Event) {
    this.defaultImage="";
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.leagueForm.patchValue({ leagueLogo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }
}
