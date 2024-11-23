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
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        EdicionUsuarioComponent, // Incluye el componente standalone aquí
      ],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUser: jasmine.createSpy('getUser').and.returnValue(of(mockUser)), // Mock del método getUser
            updateAdmin: jasmine.createSpy('updateAdmin').and.returnValue(of({ message: 'Usuario actualizado' })),
          },
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => 'mockValue' } },
            params: of({ id: 'mockId' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdicionUsuarioComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);

    // Inicializa el usuario simulado
    component.user = mockUser;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente para el administrador', () => {
    component.isAdmin = true;
    component.initializeForm();
    expect(component.userForm.contains('nombre')).toBeTruthy();
    expect(component.userForm.contains('apellido1')).toBeTruthy();
    expect(component.userForm.contains('apellido2')).toBeTruthy();
    expect(component.userForm.contains('correo')).toBeTruthy();
    expect(component.userForm.contains('centroTrabajo')).toBeTruthy();
    expect(component.userForm.contains('password')).toBeTruthy();
  });

  it('debería llamar a updateUserByEmail y navegar a la pantalla principal al enviar el formulario como administrador', () => {
    const mockData = {
      nombre: 'Nuevo Nombre',
      apellido1: 'Primer Apellido',
      apellido2: 'Segundo Apellido',
      correo: 'nuevo@ejemplo.com',
      centroTrabajo: 'Barcelona',
      interno: true,
    };

    component.isAdmin = true;
    component.initializeForm();
    component.userForm.setValue(mockData);

    component.onSubmit();

    expect(userService.updateAdmin).toHaveBeenCalledWith(jasmine.objectContaining(mockData));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/ventana-principal']);
  });

  it('debería mostrar solo el campo de contraseña para un usuario normal', () => {
    component.isAdmin = false;
    component.initializeForm();
    expect(component.userForm.contains('password')).toBeTruthy();
    expect(component.userForm.contains('nombre')).toBeFalsy();
    expect(component.userForm.contains('apellido1')).toBeFalsy();
    expect(component.userForm.contains('apellido2')).toBeFalsy();
  });
});
