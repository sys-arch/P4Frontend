import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { LoaderComponent } from "../shared/loader/loader.component";


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule, LoaderComponent, FooterComponent, HeaderComponent],
  providers: [UserService]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  passwordVisible = false;
  emailInvalid = false;
  loginFailed = false;
  isLoading = false;
  twoFactorEnabled = false;

  passwordInvalid = false;
  domainInvalid = false;
  errorMessage: string = '';
  @ViewChild('loginForm') loginForm!: NgForm;
  
  private readonly emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly injectionPattern: RegExp = /(\r|\n|%0a|%0d|%0A|%0D)/;
  private readonly minPasswordLength: number = 8;
  private readonly blacklistDomains: string[] =  [
    'mailinator.com',
    '10minutemail.com',
    'guerrillamail.com',
    'yopmail.com',
    'getnada.com',
    'temp-mail.org',
    'dispostable.com',
    'trashmail.com',
    'fakeinbox.com',
    'tempmailaddress.com'
  ];
  
  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private authservice: AuthService
  ) {}

  // Método de inicio de sesión que llama al servicio `UserService`
  loginAttempt(): void {
    this.resetValidationStates();
    this.onEmailChange();
    this.validatePassword();
  
    if (!this.emailInvalid && !this.passwordInvalid && !this.domainInvalid) {
      const user = {
        email: this.username,
        pwd: this.password,
      };
  
      this.authservice.setEmail(user.email);
      this.isLoading = true;
  
      this.userService.login(user).subscribe(
        (response) => {
          this.isLoading = false;
          if (response && response.token) {
            sessionStorage.setItem('token', response.token); // Guardar el token
            sessionStorage.setItem('email', user.email); // Guardar el email
            this.router.navigate(['/doblefactor']);
          } else {
            this.loginFailed = true;
            this.errorMessage = 'No se pudo iniciar sesión. Intente nuevamente.';
          }
        },
        (error) => {
          this.isLoading = false;
  
          if (error.status === 403) {
            this.errorMessage = error?.error?.error || 'Algo ha pasado. Intente más tarde.';
            console.log('Mensaje de error asignado:', this.errorMessage);
        
          } else if (error.status === 401) {
            this.errorMessage = 'Credenciales incorrectas. Intente nuevamente.';
          } else {
            this.errorMessage = 'Ocurrió un error inesperado. Intente nuevamente.';
          }
  
          this.loginFailed = true;
          console.error('Error en el inicio de sesión:', error);
          this.cdr.detectChanges();
        }
      );
    } else {
      this.loginFailed = true;
    }
}


  // Validar que el correo electrónico ingresado tenga un formato válido cada vez que cambie
  onEmailChange(): void {
    this.resetEmailValidationStates(); // Restablecer estados de validación de email al cambiar
    if (this.username.trim() === '') {
      this.emailInvalid = false;
      return;
    }

    // Validar el formato del correo electrónico
    if (!this.emailPattern.test(this.username)) {
      this.emailInvalid = true;
      this.errorMessage = 'El correo electrónico no tiene un formato válido.';
      return;
    }

    // Validar si el correo contiene caracteres de inyección
    if (this.injectionPattern.test(this.username)) {
      this.emailInvalid = true;
      this.errorMessage = 'El correo electrónico contiene caracteres maliciosos.';
      return;
    }

    // Validar la longitud máxima del correo (320 caracteres)
    if (this.username.length > 320) {
      this.emailInvalid = true;
      this.errorMessage = 'El correo electrónico es demasiado largo.';
      return;
    }

    // Validar si el dominio del correo está en la lista negra
    const domain = this.username.split('@')[1];
    if (domain && this.blacklistDomains.includes(domain)) {
      this.emailInvalid = true;
      this.errorMessage = `El dominio ${domain} no está permitido.`;
      return;
    }
  }

  // Validar la seguridad de la contraseña
  validatePassword(): void {
    // Longitud mínima de la contraseña
    if (this.password.length < this.minPasswordLength) {
      this.passwordInvalid = true;
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
    }

    // Validar si la contraseña contiene caracteres maliciosos
    if (this.injectionPattern.test(this.password)) {
      this.passwordInvalid = true;
      this.errorMessage = 'La contraseña contiene caracteres no permitidos.';
    }
  }

  // Método para mostrar u ocultar la contraseña
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  // Resetear los estados de error para todas las validaciones
  resetValidationStates(): void {
    this.emailInvalid = false;
    this.passwordInvalid = false;
    this.domainInvalid = false;
    this.loginFailed = false;
    this.errorMessage = '';
  }

  // Resetear solo los estados de validación de email
  resetEmailValidationStates(): void {
    this.emailInvalid = false;
    this.domainInvalid = false;
    this.errorMessage = '';
  }

  // Método para redirigir a las diferentes páginas
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}
