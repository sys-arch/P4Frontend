import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa el módulo de pruebas para HttpClient
import { AsistentesService } from './services/asistentes.service';

describe('AsistentesService', () => {
  let service: AsistentesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Agrega el módulo de pruebas para HttpClient
    });
    service = TestBed.inject(AsistentesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

