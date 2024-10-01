import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-main-shared',
  templateUrl: './main-shared.component.html',
  styleUrls: ['./main-shared.component.css']
})
export class MainSharedComponent {
  @Input() collapsed = true;
  @Input() screenWidth = 0;
  getBodyClass(): string {
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }
}
