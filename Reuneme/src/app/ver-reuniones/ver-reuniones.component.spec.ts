import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerReunionesComponent } from './ver-reuniones.component';

describe('VerReunionesComponent', () => {
  let component: VerReunionesComponent;
  let fixture: ComponentFixture<VerReunionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerReunionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerReunionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
