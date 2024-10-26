import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EdicionUsuarioComponent } from './edicion-usuario.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute, ParamMap, convertToParamMap } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EdicionUsuarioComponent', () => {
  let component: EdicionUsuarioComponent;
  let fixture: ComponentFixture<EdicionUsuarioComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let paramMapSubject: BehaviorSubject<ParamMap>;

  beforeEach(async () => {
    // Creamos los espías para los servicios
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUserByEmail', 'updateUserByEmail']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getRole']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Creamos un BehaviorSubject para simular el paramMap
    paramMapSubject = new BehaviorSubject(convertToParamMap({ email: 'test@example.com' }));

    // Simulamos ActivatedRoute con paramMap observable
    const activatedRouteStub = {
      paramMap: paramMapSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      declarations: [EdicionUsuarioComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignorar errores por elementos no reconocidos
    }).compileComponents();

    fixture = TestBed.createComponent(EdicionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('when user is admin', () => {
    beforeEach(() => {
      authServiceSpy.getRole.and.returnValue('admin');
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should initialize the form with all fields for admin', () => {
      expect(component.userForm.contains('nombre')).toBeTrue();
      expect(component.userForm.contains('apellidos')).toBeTrue();
      expect(component.userForm.contains('correo')).toBeTrue();
      expect(component.userForm.contains('departamento')).toBeTrue();
      expect(component.userForm.contains('centroTrabajo')).toBeTrue();
      expect(component.userForm.contains('alta')).toBeTrue();
      expect(component.userForm.contains('perfil')).toBeTrue();
      expect(component.userForm.contains('password')).toBeTrue();
    });

    it('should load user data when admin', () => {
      const mockUserData = {
        nombre: 'Test',
        apellidos: 'User',
        correo: 'test@example.com',
        departamento: 'IT',
        centroTrabajo: 'HQ',
        alta: '2023-01-01',
        perfil: 'Admin'
      };
      userServiceSpy.getUserByEmail.and.returnValue(of(mockUserData));

      component.loadUserData();
      expect(userServiceSpy.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(component.userForm.value.nombre).toEqual(mockUserData.nombre);
      expect(component.userForm.value.apellidos).toEqual(mockUserData.apellidos);
    });

    it('should update user when form is submitted by admin', () => {
      component.userForm.setValue({
        nombre: 'Test',
        apellidos: 'User',
        correo: 'test@example.com',
        departamento: 'IT',
        centroTrabajo: 'HQ',
        alta: '2023-01-01',
        perfil: 'Admin',
        password: ''
      });

      userServiceSpy.updateUserByEmail.and.returnValue(of({}));

      component.onSubmit();
      expect(userServiceSpy.updateUserByEmail).toHaveBeenCalledWith('test@example.com', component.userForm.value);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/ventana-principal']);
    });
  });

  describe('when user is not admin', () => {
    beforeEach(() => {
      authServiceSpy.getRole.and.returnValue('user');
      component.userEmail = 'test@example.com';
      component.loggedUserEmail = 'test@example.com';
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should initialize the form with password field only for standard user', () => {
      expect(component.userForm.contains('password')).toBeTrue();
      expect(component.userForm.contains('nombre')).toBeFalse();
      expect(component.userForm.contains('apellidos')).toBeFalse();
      expect(component.userForm.contains('correo')).toBeFalse();
    });

    it('should not load user data if user is not admin', () => {
      userServiceSpy.getUserByEmail.and.returnValue(of({}));
      component.loadUserData();
      expect(userServiceSpy.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(component.userForm.value.password).toEqual('');
    });

    it('should update password when form is submitted by standard user', () => {
      component.userForm.setValue({ password: 'newPassword123' });

      userServiceSpy.updateUserByEmail.and.returnValue(of({}));

      component.onSubmit();
      expect(userServiceSpy.updateUserByEmail).toHaveBeenCalledWith('test@example.com', { password: 'newPassword123' });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/perfil-usuario']);
    });

    it('should not allow user to edit other users', () => {
      component.userEmail = 'otheruser@example.com'; // User tries to edit another user
      component.loadUserData();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
