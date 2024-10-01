import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainSharedComponent} from "./components/sharedcomponents/main-shared/main-shared.component";
import {TeamsListComponent} from "./components/teamsmanagement/teams-list/teams-list.component";
import {LeagueListComponent} from "./components/leaguesmanagement/league-list/league-list.component";
import {PlayerListComponent} from "./components/playermanagement/player-list/player-list.component";
import {AddNewPlayerComponent} from "./components/playermanagement/add-new-player/add-new-player.component";

const routes: Routes = [

  {
    path:"home",component:MainSharedComponent
  },
  {
    path:"teams",component:TeamsListComponent
  },
  {
    path:"leagues",component:LeagueListComponent
  },
  {
    path:"player/ListPlayers",component:PlayerListComponent
  },
  {path:"player/addPlayer",component:AddNewPlayerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
