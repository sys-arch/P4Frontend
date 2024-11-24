
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CalendarioComponent } from './calendario.component';
import { ReunionService } from '../../services/reunion.service';

describe('CalendarioComponent', () => {
  let component: CalendarioComponent;
  let fixture: ComponentFixture<CalendarioComponent>;

  const mockReuniones = [
    { id: 1, titulo: 'Reunión de prueba' },
  ];

  const mockReunionService = {
    getReunionesOrganizadas: jasmine.createSpy('getReunionesOrganizadas').and.returnValue(of(mockReuniones)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CalendarioComponent], // Importa el componente standalone
      providers: [
        { provide: ReunionService, useValue: mockReunionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load meetings on init', () => {
    component.ngOnInit();
    expect(mockReunionService.getReunionesOrganizadas).toHaveBeenCalled();
    expect(component.reuniones).toEqual(mockReuniones);
  });
});
