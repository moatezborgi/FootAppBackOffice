import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import { HeaderComponent } from './components/sharedcomponents/header/header.component';
import {CdkMenuTrigger} from "@angular/cdk/menu";
import { MainSharedComponent } from './components/sharedcomponents/main-shared/main-shared.component';
import { LeftSideBarComponent } from './components/sharedcomponents/left-side-bar/left-side-bar.component';
 import { SubLevelLeftSideBarComponent } from './components/sharedcomponents/sub-level-left-side-bar/sub-level-left-side-bar.component';
import { TeamsListComponent } from './components/teamsmanagement/teams-list/teams-list.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
 import { AddNewLeagueComponent } from './components/leaguesmanagement/add-new-league/add-new-league.component';
import { LeagueListComponent } from './components/leaguesmanagement/league-list/league-list.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { UpdateLeagueComponent } from './components/leaguesmanagement/update-league/update-league.component';
import { AddNewTeamComponent } from './components/teamsmanagement/add-new-team/add-new-team.component';
import {AsyncPipe, DatePipe} from "@angular/common";
import { UpdateTeamComponent } from './components/teamsmanagement/update-team/update-team.component';
import { PlayerListComponent } from './components/playermanagement/player-list/player-list.component';
import { AddNewPlayerComponent } from './components/playermanagement/add-new-player/add-new-player.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { UpdatePlayerInformationComponent } from './components/playermanagement/update-player-information/update-player-information.component';
import { UpdateMarchandValueComponent } from './components/playermanagement/update-marchand-value/update-marchand-value.component';
import { UpdateTeamPlayerComponent } from './components/playermanagement/update-team-player/update-team-player.component';
import {MatTabsModule} from "@angular/material/tabs";
import {UserInterceptorInterceptor} from "./services/user-interceptor.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    MainSharedComponent,
    LeftSideBarComponent,
     SubLevelLeftSideBarComponent,
     TeamsListComponent,
      AddNewLeagueComponent,
     LeagueListComponent,
     UpdateLeagueComponent,
     AddNewTeamComponent,
     UpdateTeamComponent,
     PlayerListComponent,
     AddNewPlayerComponent,
     UpdatePlayerInformationComponent,
     UpdateMarchandValueComponent,
     UpdateTeamPlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    CdkMenuTrigger,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe,
    FormsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTabsModule
  ],
  providers: [
    DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: UserInterceptorInterceptor, multi: true },


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
