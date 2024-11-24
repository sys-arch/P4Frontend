import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule
import { ReunionService } from './services/reunion.service';

describe('ReunionService', () => {
  let service: ReunionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Agrega HttpClientTestingModule a los imports
      providers: [ReunionService], // Asegúrate de proporcionar el servicio
    });
    service = TestBed.inject(ReunionService); // Inyecta el servicio
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
