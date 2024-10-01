import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSharedComponent } from './main-shared.component';

describe('MainSharedComponent', () => {
  let component: MainSharedComponent;
  let fixture: ComponentFixture<MainSharedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainSharedComponent]
    });
    fixture = TestBed.createComponent(MainSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
