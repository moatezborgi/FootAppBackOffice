import {Component, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'footApp-FrontEnd';
  constructor(private cookiesService:CookieService) {
  }

  isSomeUserConnected():boolean
  {
    return !!this.cookiesService.get("userAuthenticationResponse");

  }
  isSideNavCollapsed = true;
  screenWidth = window.innerWidth;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  ngOnInit(): void {
  }
}
