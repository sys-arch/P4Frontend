import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule
import { VentanaPrincipalComponent } from './ventana-principal.component';
import { UserService } from '../services/user.service'; // Asegúrate de importar UserService si es necesario

describe('VentanaPrincipalComponent', () => {
  let component: VentanaPrincipalComponent;
  let fixture: ComponentFixture<VentanaPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VentanaPrincipalComponent,
        HttpClientTestingModule // Agrega HttpClientTestingModule aquí
      ],
      providers: [UserService] // Asegúrate de proporcionar UserService si es necesario
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentanaPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
