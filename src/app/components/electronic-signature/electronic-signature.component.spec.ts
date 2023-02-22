import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicSignatureComponent } from './electronic-signature.component';

describe('ElectronicSignatureComponent', () => {
  let component: ElectronicSignatureComponent;
  let fixture: ComponentFixture<ElectronicSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectronicSignatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectronicSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
