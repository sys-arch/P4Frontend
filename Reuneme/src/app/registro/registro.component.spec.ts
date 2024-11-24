import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa el módulo de pruebas para HttpClient
import { RegistroComponent } from './registro.component';
import { UserService } from '../services/user.service'; // Ajusta la ruta si es necesario

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegistroComponent, // Importa el standalone component aquí
        HttpClientTestingModule, // Importa el módulo de pruebas de HttpClient
      ],
      providers: [UserService], // Proporciona el servicio UserService
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
