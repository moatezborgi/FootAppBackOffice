import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LeagueService } from "../../../services/league.service";
import { LeagueDto } from "../../../model/playermodel/LeagueDto";
import { SharedService } from "../../../services/shared.service";
import { HttpResponse } from "@angular/common/http";
import { NationalityDto } from "../../../model/sharedmodel/NationalityDto";
import { Observable, startWith, map } from "rxjs";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-new-league',
  templateUrl: './add-new-league.component.html',
  styleUrls: ['./add-new-league.component.css']
})
export class AddNewLeagueComponent implements OnInit {
  leagueForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  nationalityDto: NationalityDto[] = [];
  filteredNationalities!: Observable<NationalityDto[]>;

  // Variables pour stocker l'ID et le nom de la nationalité sélectionnée
  selectedNationalityId!: number;
  selectedNationalityName: string = '';

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddNewLeagueComponent>,
    private leagueService: LeagueService,
    private sharedService: SharedService
  ) {
    this.leagueForm = this.fb.group({
      leagueName: ['', Validators.required],
      leagueLogo: [],
      nationality: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.getAllNationality();

    // Filtrer les nationalités basées sur l'entrée de l'utilisateur
    this.filteredNationalities = this.leagueForm.get('nationality')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNationalities(value))
    );
  }

  private _filterNationalities(value: string): NationalityDto[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.nationalityDto.filter(option => option.nationalityName.toLowerCase().includes(filterValue));
  }

  // Fonction pour gérer la sélection d'une nationalité
  onNationalitySelected(event: any) {
    const selectedNationality = this.nationalityDto.find(nationality => nationality.nationalityName === event.option.value);
    if (selectedNationality) {
      this.selectedNationalityId = selectedNationality.nationalityId; // Récupérer l'ID
      this.selectedNationalityName = selectedNationality.nationalityName; // Afficher le nom
      this.leagueForm.patchValue({ nationalityName: this.selectedNationalityName }); // Mettre à jour le champ d'affichage
    }
  }

  // Pour gérer l'entrée de l'utilisateur
  onNationalityInput(event: any) {
    this.selectedNationalityName = event.target.value; // Gérer la valeur saisie
  }

  onSubmit() {
    if (this.leagueForm.valid) {
      const league = new LeagueDto();
      league.leagueName = this.leagueForm.value.leagueName;
      league.leagueLogo = this.leagueForm.value.leagueLogo;
      league.leagueNationality = this.selectedNationalityId;

      this.leagueService.addLeague(league).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status == 200) {
            Swal.fire({
              icon: "success",
              title: "Succès",
              text: "Le championnat a été ajouté avec succès!",
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
