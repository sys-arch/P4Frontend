import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para pruebas de HttpClient
import { CalendarioComponent } from './calendario.component';
import { ReunionService } from '../../services/reunion.service';

describe('CalendarioComponent', () => {
  let component: CalendarioComponent;
  let fixture: ComponentFixture<CalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Módulo para pruebas de HttpClient
        CalendarioComponent, // Importar el standalone component
      ],
      providers: [ReunionService], // Proveer el servicio necesario
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
