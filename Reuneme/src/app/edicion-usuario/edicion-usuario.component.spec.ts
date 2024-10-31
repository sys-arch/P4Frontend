import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { EdicionUsuarioComponent } from './edicion-usuario.component';
import { UserService } from '../services/user.service';
import { of } from 'rxjs';

describe('EdicionUsuarioComponent', () => {
  let component: EdicionUsuarioComponent;
  let fixture: ComponentFixture<EdicionUsuarioComponent>;
  let httpMock: HttpTestingController;
  let userService: UserService;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ // Cambiado a imports en lugar de declarations
        ReactiveFormsModule, 
        HttpClientTestingModule,
        EdicionUsuarioComponent // Mueve el componente standalone aquí
      ],
      providers: [
        UserService,
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdicionUsuarioComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente para el administrador', () => {
    component.isAdmin = true;
    component.initializeForm();
    expect(component.userForm.contains('nombre')).toBeTruthy();
    expect(component.userForm.contains('apellidos')).toBeTruthy();
    expect(component.userForm.contains('correo')).toBeTruthy();
    expect(component.userForm.contains('departamento')).toBeTruthy();
    expect(component.userForm.contains('centroTrabajo')).toBeTruthy();
    expect(component.userForm.contains('alta')).toBeTruthy();
    expect(component.userForm.contains('perfil')).toBeTruthy();
    expect(component.userForm.contains('password')).toBeTruthy();
  });

  it('debería llamar a updateUserByEmail y navegar a la pantalla principal al enviar el formulario como administrador', () => {
    const mockEmail = 'usuario@ejemplo.com';
    const mockData = {
      nombre: 'Nuevo Nombre',
      apellidos: 'Nuevos Apellidos',
      correo: 'nuevo@ejemplo.com',
      departamento: 'IT',
      centroTrabajo: 'Madrid',
      alta: '2021-01-01',
      perfil: 'Admin',
      password: 'nuevaPassword'
    };
    component.userEmail = mockEmail;
    component.isAdmin = true;
    component.token = 'fake-token';
    component.initializeForm();
    component.userForm.setValue(mockData);

    spyOn(userService, 'updateUserByEmail').and.returnValue(of({ message: 'Usuario actualizado exitosamente' }));
    component.onSubmit();

    expect(userService.updateUserByEmail).toHaveBeenCalledWith(mockEmail, mockData, 'fake-token');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/ventana-principal']);
  });

  it('debería mostrar solo el campo de contraseña para un usuario normal', () => {
    component.isAdmin = false;
    component.initializeForm();
    expect(component.userForm.contains('password')).toBeTruthy();
    expect(component.userForm.contains('nombre')).toBeFalsy();
    expect(component.userForm.contains('apellidos')).toBeFalsy();
  });
});

