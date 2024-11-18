import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EdicionUsuarioComponent } from './edicion-usuario.component';
import { UserService } from '../services/user.service';
import { of } from 'rxjs';

describe('EdicionUsuarioComponent', () => {
  let component: EdicionUsuarioComponent;
  let fixture: ComponentFixture<EdicionUsuarioComponent>;
  let httpMock: HttpTestingController | undefined;
  let userService: UserService;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, 
        HttpClientTestingModule,
        EdicionUsuarioComponent // Importa el componente como standalone aquí
      ],
      providers: [
        UserService,
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => 'mockValue' } },
            params: of({ id: 'mockId' }),
          },
        }
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
    // Verifica si httpMock está definido antes de llamar a verify()
    if (httpMock) {
      httpMock.verify();
    }
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
    const mockEmail = 'usuario@ejemplo.com';
    const mockData = {
      nombre: 'Nuevo Nombre',
      apellido1: 'Primer Apellido',
      apellido2: 'Segundo Apellido',
      correo: 'nuevo@ejemplo.com',
      centroTrabajo: 'Madrid',
      interno: false,
      password: 'nuevaPassword'
    };
    component.loggedUserEmail = mockEmail;
    component.isAdmin = true;
    component.token = 'fake-token';
    component.initializeForm();
    component.userForm.setValue(mockData);

    spyOn(userService, 'updateAdmin').and.returnValue(of({ message: 'Usuario actualizado exitosamente' }));
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
