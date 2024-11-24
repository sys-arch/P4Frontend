import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AusenciasComponent } from './ausencias.component';
import { AsistentesService } from '../../services/asistentes.service';

describe('AusenciasComponent', () => {
  let component: AusenciasComponent;
  let fixture: ComponentFixture<AusenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Para pruebas con HttpClient
        AusenciasComponent, // Importa el standalone component aquí
      ],
      providers: [AsistentesService], // Provee el servicio necesario
    }).compileComponents();

    fixture = TestBed.createComponent(AusenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
