import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoblefactorComponent } from './doblefactor.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TwoFactorService } from '../services/twoFactor.service';

describe('DoblefactorComponent', () => {
  let component: DoblefactorComponent;
  let fixture: ComponentFixture<DoblefactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Módulo de pruebas para HttpClient
      declarations: [DoblefactorComponent], // Declaramos el componente
      providers: [
        {
          provide: TwoFactorService,
          useValue: { desactivar2FA: jasmine.createSpy('desactivar2FA') }, // Mock del servicio
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DoblefactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});