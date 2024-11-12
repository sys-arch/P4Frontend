import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearReunionesComponent } from './crear-reuniones.component';

describe('CrearReunionesComponent', () => {
  let component: CrearReunionesComponent;
  let fixture: ComponentFixture<CrearReunionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearReunionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearReunionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
