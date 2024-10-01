import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TeamService} from "../../../services/team.service";
import {PlayerService} from "../../../services/player.service";
import {AddNewTeamComponent} from "../../teamsmanagement/add-new-team/add-new-team.component";
import {AddNewPlayerComponent} from "../add-new-player/add-new-player.component";
import {MatTableDataSource} from "@angular/material/table";
import {TeamDto} from "../../../model/playermodel/TeamDto";
import {PlayerDto} from "../../../model/playermodel/PlayerDto";
import {HttpResponse} from "@angular/common/http";
import {LeagueDto} from "../../../model/playermodel/LeagueDto";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DatePipe} from "@angular/common";
import {UpdatePlayerInformationComponent} from "../update-player-information/update-player-information.component";
import {UpdateMarchandValueComponent} from "../update-marchand-value/update-marchand-value.component";
import {UpdateTeamPlayerComponent} from "../update-team-player/update-team-player.component";

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit{
  constructor(private dialog: MatDialog, private playerService:PlayerService, protected datePipe:DatePipe)  {}
playerDto!:PlayerDto[];
  ngOnInit(): void {
    this.getAllPlayers();
  }
  expandedElement: PlayerDto | null = null;
  toggleRow(element: PlayerDto): void {
    this.expandedElement = this.expandedElement?.playerId === element.playerId ? null : element;
    console.log(  element.playerId )
  }

  isExpansionDetailRow = (index: number, row: PlayerDto): boolean => row === this.expandedElement;


  displayedColumns: string[] = ['Picture', 'playerFullName','Nationality','weightAndHeight', 'position','playervalue','age','foot','contractandLeague','contractStatus','Action'];

  dataSource = new MatTableDataSource<PlayerDto>();  // Correct typing
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getAllPlayers()
  {
    this.playerService.getAllPlayers().subscribe({
      next: (response: HttpResponse<any>) => {
        if(response.status==200)
        {
          this.playerDto=response.body
          this.dataSource.data = response.body as PlayerDto[];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;


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
  OpenDialogUpdatePlayerInformation(data:any)
  {
    this.dialog.closeAll(); // Close all open dialogs
    const dialogRef = this.dialog.open(UpdatePlayerInformationComponent, {
      disableClose: true, // Prevents closing by clicking outside
      hasBackdrop: true,   // Adds a dark backdrop
      data:data,
      width:"80%",
      height:"80%"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllPlayers();
    });
  }
  OpenDialogPlayerValue(data:any)
  {
    this.dialog.closeAll(); // Close all open dialogs
    const dialogRef = this.dialog.open(UpdateMarchandValueComponent, {
      disableClose: true, // Prevents closing by clicking outside
      hasBackdrop: true,   // Adds a dark backdrop
      data:data,

    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllPlayers();
    });
  }
  OpenDialogAddNewContract(data:any)
  {
    this.dialog.closeAll(); // Close all open dialogs
    const dialogRef = this.dialog.open(UpdateTeamPlayerComponent, {
      disableClose: true, // Prevents closing by clicking outside
      hasBackdrop: true,   // Adds a dark backdrop
      data:data,

    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllPlayers();
    });
  }

}
