import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule
import { VerReunionesComponent } from './ver-reuniones/ver-reuniones.component'; // Asegúrate de que la ruta sea correcta
import { ReunionService } from './services/reunion.service'; // Asegúrate de que la ruta sea correcta

describe('VerReunionesComponent', () => {
  let component: VerReunionesComponent;
  let fixture: ComponentFixture<VerReunionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Proporciona un HttpClient simulado
        VerReunionesComponent, // Si es standalone
      ],
      providers: [
        ReunionService, // Proporciona el servicio requerido
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerReunionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});