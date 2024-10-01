import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePlayerInformationComponent } from './update-player-information.component';

describe('UpdatePlayerInformationComponent', () => {
  let component: UpdatePlayerInformationComponent;
  let fixture: ComponentFixture<UpdatePlayerInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePlayerInformationComponent]
    });
    fixture = TestBed.createComponent(UpdatePlayerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
