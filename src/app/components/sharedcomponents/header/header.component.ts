import {Component, HostListener, Input, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  @Input() collapsed = true;
  @Input() screenWidth = 0;

  userFullName!:string;

  constructor(private cookieService: CookieService,
              private router: Router,
             ) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {

  }
  logout() {

    this.cookieService.delete("userAuthenticationResponse");
    this.cookieService.delete("userFullName");
   }

  ngOnInit(): void {

    this.userFullName=this.cookieService.get("userFullName");

  }
  getHeadClass():string
  {
    let  styleClass='';
    if(this.collapsed && this.screenWidth>768)
    {
      styleClass='head-trimmed';
    }
    else
    {
      styleClass='head-md-screen';
    }
    return styleClass;
  }
}
