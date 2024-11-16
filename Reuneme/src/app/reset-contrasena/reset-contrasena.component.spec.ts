import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule
import { ActivatedRoute } from '@angular/router';
import { ResetContrasenaComponent } from './reset-contrasena.component';
import { UserService } from '../services/user.service'; // Asegúrate de importar UserService si es necesario
import { of } from 'rxjs';

describe('ResetContrasenaComponent', () => {
  let component: ResetContrasenaComponent;
  let fixture: ComponentFixture<ResetContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResetContrasenaComponent,
        HttpClientTestingModule // Agrega HttpClientTestingModule aquí para proporcionar HttpClient
      ],
      providers: [
        UserService, // Asegúrate de proporcionar UserService si es necesario
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => 'mockValue' } },
            params: of({ id: 'mockId' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
