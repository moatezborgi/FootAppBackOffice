import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLeagueComponent } from './update-league.component';

describe('UpdateLeagueComponent', () => {
  let component: UpdateLeagueComponent;
  let fixture: ComponentFixture<UpdateLeagueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateLeagueComponent]
    });
    fixture = TestBed.createComponent(UpdateLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
