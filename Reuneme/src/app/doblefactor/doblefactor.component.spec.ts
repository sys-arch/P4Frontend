import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para pruebas de HttpClient
import { DoblefactorComponent } from './doblefactor.component';
import { TwoFactorService } from '../services/twoFactor.service';

describe('DoblefactorComponent', () => {
  let component: DoblefactorComponent;
  let fixture: ComponentFixture<DoblefactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DoblefactorComponent], // Incluye el componente standalone en imports
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
