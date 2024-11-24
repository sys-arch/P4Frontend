import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa el módulo de pruebas para HttpClient
import { ContrasenaOlvidadaComponent } from './contrasena-olvidada.component';

describe('ContrasenaOlvidadaComponent', () => {
  let component: ContrasenaOlvidadaComponent;
  let fixture: ComponentFixture<ContrasenaOlvidadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ContrasenaOlvidadaComponent, // Standalone component
        HttpClientTestingModule, // Módulo para manejar dependencias de HttpClient
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContrasenaOlvidadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
