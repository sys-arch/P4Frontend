import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para pruebas de HttpClient
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Para simular parámetros de ruta
import { VentanaPrincipalComponent } from './ventana-principal.component';
import { UserService } from '../services/user.service';
import { ReunionService } from '../services/reunion.service';

describe('VentanaPrincipalComponent', () => {
  let component: VentanaPrincipalComponent;
  let fixture: ComponentFixture<VentanaPrincipalComponent>;

  const mockReunionService = {
    getHeaders: jasmine.createSpy('getHeaders').and.returnValue({ Authorization: 'Bearer mock-token' }),
    getReunionesOrganizadas: jasmine.createSpy('getReunionesOrganizadas').and.returnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, VentanaPrincipalComponent],
      providers: [
        UserService,
        {
          provide: ReunionService, // Mock del servicio ReunionService
          useValue: mockReunionService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => 'mockValue' } },
            params: of({ id: 'mockId' }), // Mock de parámetros de ruta
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VentanaPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load reuniones using the service', () => {
    expect(mockReunionService.getReunionesOrganizadas).toHaveBeenCalled();
  });
});
