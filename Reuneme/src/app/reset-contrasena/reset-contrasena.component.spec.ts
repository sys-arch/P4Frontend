import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para pruebas con HttpClient
import { ActivatedRoute } from '@angular/router';
import { ResetContrasenaComponent } from './reset-contrasena.component';

describe('ResetContrasenaComponent', () => {
  let component: ResetContrasenaComponent;
  let fixture: ComponentFixture<ResetContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ResetContrasenaComponent], // Importa el componente standalone
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'token' ? 'mockToken' : null), // Simula el token
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se cree
  });

  it('should set the token from ActivatedRoute', () => {
    expect(component.token).toBe('mockToken'); // Verifica que el token sea 'mockToken'
  });
});
