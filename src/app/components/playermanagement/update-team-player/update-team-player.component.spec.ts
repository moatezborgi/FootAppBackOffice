import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTeamPlayerComponent } from './update-team-player.component';

describe('UpdateTeamPlayerComponent', () => {
  let component: UpdateTeamPlayerComponent;
  let fixture: ComponentFixture<UpdateTeamPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateTeamPlayerComponent]
    });
    fixture = TestBed.createComponent(UpdateTeamPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
