import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { VerReunionesComponent } from './ver-reuniones.component';
import { ReunionService } from '../services/reunion.service';
import { AsistentesService } from '../services/asistentes.service';

describe('VerReunionesComponent', () => {
  let component: VerReunionesComponent;
  let fixture: ComponentFixture<VerReunionesComponent>;

  const mockReunionService = {
    getHeaders: jasmine.createSpy('getHeaders').and.returnValue({ Authorization: 'Bearer mock-token' }),
    getReunionById: jasmine.createSpy('getReunionById').and.returnValue(of({})),
  };

  const mockAsistentesService = {
    getHeaders: jasmine.createSpy('getHeaders').and.returnValue({ Authorization: 'Bearer mock-token' }),
    getAsistentesPorReunion: jasmine.createSpy('getAsistentesPorReunion').and.returnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        VerReunionesComponent, // Asegúrate de que sea standalone, si corresponde
      ],
      providers: [
        { provide: ReunionService, useValue: mockReunionService },
        { provide: AsistentesService, useValue: mockAsistentesService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => (key === 'id' ? 'mockId' : null) } },
            params: of({ id: 'mockId' }),
          },
        },
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
