import {Component, OnInit, ViewChild} from '@angular/core';
import {TeamService} from "../../../services/team.service";
import {HttpResponse} from "@angular/common/http";
import {LeagueDto} from "../../../model/playermodel/LeagueDto";
import {TeamDto} from "../../../model/playermodel/TeamDto";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {LeagueService} from "../../../services/league.service";
import {AddNewLeagueComponent} from "../../leaguesmanagement/add-new-league/add-new-league.component";
import {MatDialog} from "@angular/material/dialog";
import {AddNewTeamComponent} from "../add-new-team/add-new-team.component";
import {UpdateLeagueComponent} from "../../leaguesmanagement/update-league/update-league.component";
import {UpdateTeamComponent} from "../update-team/update-team.component";

@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.css']
})
export class TeamsListComponent implements OnInit {
  constructor(private dialog: MatDialog,private teamService:TeamService)  {}
  teamsDto!:TeamDto[];
  displayedColumns: string[] = ['Logo', 'teamName','Championnat','Pays', 'Action'];
  dataSource = new MatTableDataSource<TeamDto>();  // Correct typing
  leaguesDto: LeagueDto[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    this.getAllTeams();
  }
  getAllTeams()
  {
    this.teamService.getAllTeams().subscribe({
      next: (response: HttpResponse<any>) => {
        if(response.status==200)
        {
          this.teamsDto=response.body
          this.dataSource.data = response.body as TeamDto[];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
console.log(response.body)

        }
      },
      error: (error) => {
        const errorMessage = error.toString();

        console.log(error);
      },
      complete: () => {
      }
    });
  }
  OpenAddNewTeamDialog()
  {
    this.dialog.closeAll(); // Close all open dialogs
    const dialogRef = this.dialog.open(AddNewTeamComponent, {
      position: {
        top: '20vh'
      },
      disableClose: true, // Prevents closing by clicking outside
      hasBackdrop: true   // Adds a dark backdrop
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllTeams();
    });
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  OpenDialogUpdateTeam(team:TeamDto)
  {
    this.dialog.closeAll(); // Close all open dialogs
    const dialogRef = this.dialog.open(UpdateTeamComponent, {
      position: {
        top: '10vh'
      },
      disableClose: true,
      hasBackdrop: true   ,
      data:team,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllTeams();
    });
  }
}
