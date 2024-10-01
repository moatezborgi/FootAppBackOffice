import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMarchandValueComponent } from './update-marchand-value.component';

describe('UpdateMarchandValueComponent', () => {
  let component: UpdateMarchandValueComponent;
  let fixture: ComponentFixture<UpdateMarchandValueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateMarchandValueComponent]
    });
    fixture = TestBed.createComponent(UpdateMarchandValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
