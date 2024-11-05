import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosHorariosComponent } from './turnos-horarios.component';

describe('TurnosHorariosComponent', () => {
  let component: TurnosHorariosComponent;
  let fixture: ComponentFixture<TurnosHorariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosHorariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
