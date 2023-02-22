import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WotcQuestionnaireComponent } from './wotc-questionnaire.component';

describe('WotcQuestionnaireComponent', () => {
  let component: WotcQuestionnaireComponent;
  let fixture: ComponentFixture<WotcQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WotcQuestionnaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WotcQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
