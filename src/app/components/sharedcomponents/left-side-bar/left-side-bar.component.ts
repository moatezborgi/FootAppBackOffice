import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {fadeInOut, INavbarData} from "./helper";
import {animate, keyframes, style, transition, trigger} from "@angular/animations";
import {navbarData} from "./nav-data";
import {Router} from "@angular/router";
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.css'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})
export class LeftSideBarComponent implements OnInit{
@Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = true;
  screenWidth = 0;
  navData: INavbarData[] = navbarData;
  multiple: boolean = false;
  pingled=true;
@HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768 ) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }
  constructor(private router:Router) {
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

  }
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  handleClick(item: INavbarData): void {

    this.shrinkItems(item);

    item.expanded = !item.expanded
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
    for(let modelItem of this.navData) {
      if (item !== modelItem && modelItem.expanded) {
        modelItem.expanded = false;
      }
    }
  }
}

  isHovering: boolean = false;

// Function to handle mouse enter event
  handleMouseEnter(): void {
    // If the sidebar is closed and the mouse enters, open it
    if (!this.collapsed) {
    this.collapsed = true;
    // Emit event or perform any other necessary actions
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }
  // Set isHovering to true indicating mouse is hovering over the sidebar
  this.isHovering = true;
}
}
