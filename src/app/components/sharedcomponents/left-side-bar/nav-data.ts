import {INavbarData} from "./helper";

export const navbarData: INavbarData[] = [
  {
    routeLink: 'player',
    icon:'fa-regular fa-futbol',
    label: 'Gestion des joueurs',
    items: [
      {
        routeLink: 'player/addPlayer',
        label: 'Ajouter un nouveau joueurs'
      },
      {
        routeLink: 'player/ListPlayers',
        label: 'List joueurs'
      }
    ]
  },
  {
     routeLink:'teams',
    icon:'fa-solid fa-people-group',
    label:'Gestion des équipes'
  },

  {
    routeLink:'leagues',
     icon:'fa-solid fa-shield-halved',
    label:'Gestion des championnats'
  },

 ];
