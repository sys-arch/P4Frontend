import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule
import { CrearReunionesComponent } from './crear-reuniones.component';
import { ReunionService } from '../services/reunion.service'; // Asegúrate de importar el servicio necesario

describe('CrearReunionesComponent', () => {
  let component: CrearReunionesComponent;
  let fixture: ComponentFixture<CrearReunionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CrearReunionesComponent,
        HttpClientTestingModule // Agrega HttpClientTestingModule aquí
      ],
      providers: [ReunionService] // Asegúrate de proporcionar ReunionService si es necesario
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
