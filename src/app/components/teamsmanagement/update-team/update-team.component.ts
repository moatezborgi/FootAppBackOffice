import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LeagueDto} from "../../../model/playermodel/LeagueDto";
import {TeamDto} from "../../../model/playermodel/TeamDto";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {LeagueService} from "../../../services/league.service";
import {TeamService} from "../../../services/team.service";
import {map, startWith} from "rxjs/operators";
import {HttpResponse} from "@angular/common/http";
import Swal from "sweetalert2";

@Component({
  selector: 'app-update-team',
  templateUrl: './update-team.component.html',
  styleUrls: ['./update-team.component.css']
})
export class UpdateTeamComponent implements OnInit {
  teamForm: FormGroup;
  teamLeagueControl = new FormControl(); // Linked with the autocomplete control
  leaguesDto: LeagueDto[] = [];
  filteredLeagues!: Observable<LeagueDto[]>;
  previewUrl: string | ArrayBuffer | null = null;
  defaultImage!: string;

  constructor(
    private dialogRef: MatDialogRef<UpdateTeamComponent>,
    private fb: FormBuilder,
    private leagueService: LeagueService,
    private teamService: TeamService,
    @Inject(MAT_DIALOG_DATA) public team: TeamDto
  ) {
    // Initialize the form
    this.teamForm = this.fb.group({
      teamName: [team.teamName, Validators.required],
      teamLogo: [],
      teamLeague: [team.league.leagueName, Validators.required] // Sync with league name
    });

    // Pre-fill the control with the team's league name
    this.teamLeagueControl.setValue(team.league.leagueName);
  }

  ngOnInit(): void {
    this.getAllLeagues();

    // Apply the filter for the autocomplete input
    this.filteredLeagues = this.teamLeagueControl.valueChanges.pipe(
      startWith(this.team.league.leagueName), // Start with the current league name
      map(value => this._filterLeagues(value || ''))
    );

    this.initializeleague();
  }

  onFileSelected(event: Event) {
    this.defaultImage="";

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
          // Initialize the form after leagues are loaded
          this.initializeleague();
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  selectedleagueId!: number;
  selectedLeagueName!: string;

  private initializeleague() {
    // Find the league matching the team league and set the values
    const initialLeague = this.leaguesDto.find(league => league.leagueId === this.team.league.leagueId);
    if (initialLeague) {
      this.selectedleagueId = initialLeague.leagueId;
      this.selectedLeagueName = initialLeague.leagueName;
      this.teamForm.patchValue({ teamLeague: this.selectedLeagueName });
      this.teamLeagueControl.setValue(this.selectedLeagueName); // Sync with autocomplete
    }

    // Show the image if provided
    if (this.team.teamLogo) {
      this.defaultImage = this.team.teamLogo;
    }
  }

  private _filterLeagues(value: string): LeagueDto[] {
    const filterValue = value.toLowerCase();
    return this.leaguesDto.filter(league => league.leagueName.toLowerCase().includes(filterValue));
  }

  onLeagueSelected(event: any) {
    const selectedLeague = this.leaguesDto.find(league => league.leagueName === event.option.value);
    if (selectedLeague) {
      this.selectedleagueId = selectedLeague.leagueId;
      this.selectedLeagueName = selectedLeague.leagueName;
      this.teamForm.patchValue({ teamLeague: this.selectedLeagueName }); // Update the form
    }
  }


  onSubmit() {
    if (this.teamForm.valid) {
      const team = new TeamDto();
        team.teamName=this.teamForm.value.teamName
       if(this.teamForm.value.leagueLogo)
      {
        team.teamLogo = this.teamForm.value.leagueLogo;
      }
      else
      {
        team.teamLogo=this.teamForm.value.teamLogo;
      }
      const league = new LeagueDto();
      if(this.selectedleagueId)
      {
        league.leagueId = this.selectedleagueId;

      }
      else
      {
        league.leagueId=this.team.league.leagueId;
      }
      team.teamId=this.team.teamId
      team.league=league;
      console.log(team)
      this.teamService.updateTeam(team).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status == 200) {
            Swal.fire({
              icon: "success",
              title: "Succès",
              text: "L'équipe a été modifiée avec succès!",
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
