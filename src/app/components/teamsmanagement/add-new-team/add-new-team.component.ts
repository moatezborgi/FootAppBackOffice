import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { HttpResponse } from "@angular/common/http";
import { LeagueDto } from "../../../model/playermodel/LeagueDto";
import { LeagueService } from "../../../services/league.service";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { TeamDto } from "../../../model/playermodel/TeamDto";
import Swal from "sweetalert2";
import {TeamService} from "../../../services/team.service";

@Component({
  selector: 'app-add-new-team',
  templateUrl: './add-new-team.component.html',
  styleUrls: ['./add-new-team.component.css']
})
export class AddNewTeamComponent implements OnInit {
  teamForm: FormGroup;
  teamLeagueControl = new FormControl(); // This is used for the autocomplete control
  leaguesDto: LeagueDto[] = [];
  filteredLeagues!: Observable<LeagueDto[]>;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private dialogRef: MatDialogRef<AddNewTeamComponent>,
              private fb: FormBuilder,
              private leagueService: LeagueService,
              private teamService: TeamService,) {
    // Initialize the form
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required],
      teamLogo: [],
      teamLeague: ['', Validators.required] // Not linked with the autocomplete control
    });
  }

  ngOnInit(): void {
    this.getAllLeagues();

    // Apply the filter for the autocomplete input
    this.filteredLeagues = this.teamLeagueControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLeagues(value || ''))
    );
  }

  onSubmit() {
    if (this.teamForm.valid) {
      const team = new TeamDto();
      team.teamName = this.teamForm.value.teamName;
      team.teamLogo = this.teamForm.value.teamLogo;
      const league=new LeagueDto();
      league.leagueId = this.selectedleagueId;
      team.league=league;
      this.teamService.addTeam(team).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status == 200) {
            Swal.fire({
              icon: "success",
              title: "Succès",
              text: "L'équipe a été ajoutée avec succès!",
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.teamForm.patchValue({ teamLogo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  getAllLeagues() {
    this.leagueService.getAllLeagues().subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.leaguesDto = response.body;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  private _filterLeagues(value: string): LeagueDto[] {
    const filterValue = value.toLowerCase();
    return this.leaguesDto.filter(league => league.leagueName.toLowerCase().includes(filterValue));
  }

  selectedleagueId!: number;
  selectedLeagueName!: string;

  onLeagueSelected(event: any) {
    const selectedLeague = this.leaguesDto.find(league => league.leagueName === event.option.value);
    if (selectedLeague) {
      this.selectedleagueId = selectedLeague.leagueId;
      this.selectedLeagueName = selectedLeague.leagueName;
      this.teamForm.patchValue({ teamLeague: this.selectedLeagueName }); // Update the form
    }
  }
}
