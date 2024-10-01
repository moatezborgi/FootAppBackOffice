import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewLeagueComponent } from './add-new-league.component';

describe('AddNewLeagueComponent', () => {
  let component: AddNewLeagueComponent;
  let fixture: ComponentFixture<AddNewLeagueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewLeagueComponent]
    });
    fixture = TestBed.createComponent(AddNewLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
