import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { AddNewLeagueComponent } from "../add-new-league/add-new-league.component";
import { LeagueService } from "../../../services/league.service";
import { HttpResponse } from "@angular/common/http";
import { MatPaginator } from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import { LeagueDto } from "../../../model/playermodel/LeagueDto";
import { MatTableDataSource } from "@angular/material/table";
import {SharedService} from "../../../services/shared.service";
import {NationalityDto} from "../../../model/sharedmodel/NationalityDto";
import {UpdateLeagueComponent} from "../update-league/update-league.component";

@Component({
  selector: 'app-league-list',
  templateUrl: './league-list.component.html',
  styleUrls: ['./league-list.component.css']
})
export class LeagueListComponent implements OnInit {

  displayedColumns: string[] = ['Logo', 'Championnat','Pays', 'Action'];
  dataSource = new MatTableDataSource<LeagueDto>();  // Correct typing

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  leaguesDto: LeagueDto[] = [];
  leaguesDtoSortedData: LeagueDto[] = [];

  constructor(private dialog: MatDialog, private leagueService: LeagueService) {}

  ngOnInit(): void {
    this.getAllLeagues();
  }

  OpenAddNewLeaguelDialog() {
    this.dialog.closeAll(); // Close all open dialogs
    const dialogRef = this.dialog.open(AddNewLeagueComponent, {
      position: {
        top: '20vh'
      },
      disableClose: true, // Prevents closing by clicking outside
      hasBackdrop: true   // Adds a dark backdrop
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllLeagues();
     });
  }
  OpenDialogUpdateLeague(league:LeagueDto)
  {
    this.dialog.closeAll(); // Close all open dialogs
    const dialogRef = this.dialog.open(UpdateLeagueComponent, {
      position: {
        top: '10vh'
      },
      disableClose: true,
      hasBackdrop: true   ,
      data:league,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllLeagues();
    });
  }

  getAllLeagues()
  {
    this.leagueService.getAllLeagues().subscribe({
      next: (response: HttpResponse<any>) => {
        if(response.status==200)
        {
          this.leaguesDto=response.body
          this.dataSource.data = response.body as LeagueDto[];
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
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

