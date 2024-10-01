import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPlayerComponent } from './add-new-player.component';

describe('AddNewPlayerComponent', () => {
  let component: AddNewPlayerComponent;
  let fixture: ComponentFixture<AddNewPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPlayerComponent]
    });
    fixture = TestBed.createComponent(AddNewPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
