import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa el módulo de pruebas para HttpClient
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ModificarReunionesComponent } from './modificar-reuniones.component';
import { ReunionService } from '../services/reunion.service'; // Ajusta la ruta según sea necesario

describe('ModificarReunionesComponent', () => {
  let component: ModificarReunionesComponent;
  let fixture: ComponentFixture<ModificarReunionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa HttpClientTestingModule para manejar dependencias de HTTP
      declarations: [ModificarReunionesComponent], // Declara el componente bajo prueba
      providers: [
        ReunionService, // Provee el servicio necesario
        {
          provide: ActivatedRoute, // Mockea ActivatedRoute
          useValue: {
            snapshot: { paramMap: { get: (key: string) => 'mockValue' } }, // Mock para snapshot y parámetros de ruta
            params: of({ id: 'mockId' }), // Mock para parámetros observables
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarReunionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
