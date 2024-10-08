import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.services';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],
  providers: [UserService]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  passwordVisible = false;
  emailInvalid = false;
  loginFailed = false;
  passwordInvalid = false;
  domainInvalid = false;
  errorMessage: string = '';
  @ViewChild('loginForm') loginForm!: NgForm;
  submitForm(): void {
    this.loginForm
  }

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
    private cdr: ChangeDetectorRef
  ) {}

  // Método de inicio de sesión que llama al servicio `UserService`
  loginAttempt(): void {
    this.resetValidationStates(); // Resetear todos los estados de error
    this.onEmailChange(); // Validar el email actual
    this.validatePassword(); // Validar la contraseña
    
    
  
    // Validar si el correo electrónico y la contraseña son válidos antes de proceder
    if (!this.emailInvalid && !this.passwordInvalid && !this.domainInvalid) {
      // Crear el objeto `user` con las credenciales del usuario
      const user = { username: this.username, password: this.password };
  
      // Mostrar los datos que se van a enviar al backend
      console.log('Datos enviados al backend:');
  
      // Llamar al servicio `login` pasando el objeto `user`
      this.userService.login(user).subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response); // Mostrar la respuesta en la consola
          localStorage.setItem('token', response.token); // Guarda el token recibido en localStorage
          this.router.navigate(['/home']); // Redirige a la página principal
        },
        (error) => {
          console.error('Error en el inicio de sesión:', error);
          this.loginFailed = true; // Mostrar el mensaje de error
          this.errorMessage = 'Las credenciales ingresadas no son correctas. Intente nuevamente.';
          this.cdr.detectChanges(); // Asegurar que Angular detecte el cambio
        }
      );
    } else{ this.loginFailed = true; // Mostrar el mensaje de error
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

  // Navegar a la página principal
  goToLanding(): void {
    this.router.navigate(['/']); 
  }

  // Navegar a la página de registro
  goToRegister(): void {
    this.router.navigate(['/registro']); 
  }
}
