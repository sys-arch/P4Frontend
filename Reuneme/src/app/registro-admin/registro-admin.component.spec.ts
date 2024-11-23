import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule
import { RegistroAdminComponent } from './registro-admin.component';
import { UserService } from '../services/user.service'; // Ajusta la ruta si es necesario

describe('RegistroAdminComponent', () => {
  let component: RegistroAdminComponent;
  let fixture: ComponentFixture<RegistroAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Importa HttpClientTestingModule para manejar HttpClient
        RegistroAdminComponent, // Incluye el componente standalone en imports
      ],
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
