import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Módulo de pruebas para HttpClient
import { RegistroAdminComponent } from './registro-admin.component';
import { UserService } from '../services/user.service'; // Ajusta la ruta si es necesario

describe('RegistroAdminComponent', () => {
  let component: RegistroAdminComponent;
  let fixture: ComponentFixture<RegistroAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa HttpClientTestingModule
      declarations: [RegistroAdminComponent], // Declara el componente bajo prueba
      providers: [UserService], // Proporciona UserService si no está en 'root'
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
