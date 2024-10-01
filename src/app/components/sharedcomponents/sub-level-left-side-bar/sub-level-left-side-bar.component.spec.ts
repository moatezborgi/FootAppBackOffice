import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubLevelLeftSideBarComponent } from './sub-level-left-side-bar.component';

describe('SubLevelLeftSideBarComponent', () => {
  let component: SubLevelLeftSideBarComponent;
  let fixture: ComponentFixture<SubLevelLeftSideBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubLevelLeftSideBarComponent]
    });
    fixture = TestBed.createComponent(SubLevelLeftSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
