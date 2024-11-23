import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ModificarReunionesComponent } from './modificar-reuniones.component';
import { ReunionService } from '../services/reunion.service';
import { AsistentesService } from '../services/asistentes.service';

describe('ModificarReunionesComponent', () => {
  let component: ModificarReunionesComponent;
  let fixture: ComponentFixture<ModificarReunionesComponent>;

  const mockReunionService = {
    getReunionById: jasmine.createSpy('getReunionById').and.returnValue(of({})), // Mock de método
  };

  const mockAsistentesService = {
    getHeaders: jasmine.createSpy('getHeaders').and.returnValue({ Authorization: 'Bearer mock-token' }),
    getAsistentesPorReunion: jasmine.createSpy('getAsistentesPorReunion').and.returnValue(of([])), // Mock de método
    getPosiblesAsistentes: jasmine.createSpy('getPosiblesAsistentes').and.returnValue(of([])), // Agrega este mock
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Para manejar las dependencias de HttpClient
        ModificarReunionesComponent, // Importa el standalone component
      ],
      providers: [
        { provide: ReunionService, useValue: mockReunionService },
        { provide: AsistentesService, useValue: mockAsistentesService },
        {
          provide: ActivatedRoute, // Mock de ActivatedRoute
          useValue: {
            snapshot: { paramMap: { get: (key: string) => 'mockValue' } },
            params: of({ id: 'mockId' }),
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
