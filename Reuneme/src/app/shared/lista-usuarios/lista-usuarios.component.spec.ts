import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListaUsuariosComponent } from './lista-usuarios.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ListaUsuariosComponent', () => {
  let component: ListaUsuariosComponent;
  let fixture: ComponentFixture<ListaUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Para pruebas con HttpClient
        ListaUsuariosComponent, // Importa el standalone component
      ],
      providers: [
        UserService, // Proporciona el servicio necesario
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => 'mockValue' } }, // Simula parámetros de ruta
            params: of({ id: 'mockId' }), // Simula un Observable para parámetros
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
