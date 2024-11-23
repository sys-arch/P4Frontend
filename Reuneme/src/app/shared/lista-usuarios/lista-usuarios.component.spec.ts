import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa el módulo de pruebas para HttpClient
import { ListaUsuariosComponent } from './lista-usuarios.component';
import { UserService } from '../../services/user.service';

describe('ListaUsuariosComponent', () => {
  let component: ListaUsuariosComponent;
  let fixture: ComponentFixture<ListaUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa el módulo para HttpClient
      declarations: [ListaUsuariosComponent], // Declara el componente bajo prueba
      providers: [UserService], // Proporciona el servicio si no está en el root
    }).compileComponents();

    fixture = TestBed.createComponent(ListaUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
