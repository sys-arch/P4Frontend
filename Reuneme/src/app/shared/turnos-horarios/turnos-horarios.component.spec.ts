import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa el módulo de pruebas para HttpClient
import { TurnosHorariosComponent } from './turnos-horarios.component';
import { TurnoService } from '../../services/turno.service'; // Ajusta la ruta según tu proyecto

describe('TurnosHorariosComponent', () => {
  let component: TurnosHorariosComponent;
  let fixture: ComponentFixture<TurnosHorariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TurnosHorariosComponent, // Importa el componente standalone
        HttpClientTestingModule, // Importa el módulo de pruebas de HttpClient
      ],
      providers: [TurnoService], // Proporciona el servicio necesario
    }).compileComponents();

    fixture = TestBed.createComponent(TurnosHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
