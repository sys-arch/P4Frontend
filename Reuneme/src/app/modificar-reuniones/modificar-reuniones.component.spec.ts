import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ModificarReunionesComponent } from './modificar-reuniones.component';
import { of } from 'rxjs';

describe('ModificarReunionesComponent', () => {
  let component: ModificarReunionesComponent;
  let fixture: ComponentFixture<ModificarReunionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarReunionesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => 'mockValue' } },
            params: of({ id: 'mockId' }),  // Simula los parámetros de la ruta si es necesario
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarReunionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
