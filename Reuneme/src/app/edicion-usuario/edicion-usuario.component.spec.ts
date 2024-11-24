import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EdicionUsuarioComponent } from './edicion-usuario.component';
import { UserService } from '../services/user.service';
import { of } from 'rxjs';

describe('EdicionUsuarioComponent', () => {
  let component: EdicionUsuarioComponent;
  let fixture: ComponentFixture<EdicionUsuarioComponent>;
  let userService: UserService;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  const mockUser = {
    nombre: 'John',
    apellido1: 'Doe',
    apellido2: 'Smith',
    correo: 'john.doe@example.com',
    centroTrabajo: 'Madrid',
    interno: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, EdicionUsuarioComponent],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUser: jasmine.createSpy('getUser').and.returnValue(of(mockUser)), // Devuelve un usuario simulado
            updateAdmin: jasmine.createSpy('updateAdmin').and.returnValue(of({ message: 'Usuario actualizado' })),
          },
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => 'mockId' } },
            params: of({ id: 'mockId' }),
          },
        },
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(EdicionUsuarioComponent);
    component = fixture.componentInstance;
  
    // Inicializa el usuario manualmente
    component.user = mockUser;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form for admin', () => {
    component.isAdmin = true;
    component.initializeForm();
    expect(component.userForm.contains('nombre')).toBeTrue();
    expect(component.userForm.contains('correo')).toBeTrue();
  });

  it('should call updateAdmin on form submission', () => {
    component.isAdmin = true;
    component.userForm.setValue(mockUser);
    component.onSubmit();
    expect(userService.updateAdmin).toHaveBeenCalledWith(mockUser);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/ventana-principal']);
  });
});
