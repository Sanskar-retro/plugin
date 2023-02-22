import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimateSoftwatePopUpComponent } from './ultimate-softwate-pop-up.component';

describe('UltimateSoftwatePopUpComponent', () => {
  let component: UltimateSoftwatePopUpComponent;
  let fixture: ComponentFixture<UltimateSoftwatePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UltimateSoftwatePopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UltimateSoftwatePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
