import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  // Método de inicio de sesión que llama al servicio `UserService`
  loginAttempt(): void {
    this.validateEmail();
    this.loginFailed = false;

    // Validar si el correo electrónico es válido antes de proceder
    if (!this.emailInvalid) {
      // Crear el objeto `user` con las credenciales del usuario
      const user = { username: this.username, password: this.password };

      // Llamar al servicio `login` pasando el objeto `user`
      this.userService.login(user).subscribe(
        (response) => {
          console.log('Login exitoso:', response);
          localStorage.setItem('token', response.token); // Guarda el token recibido en localStorage
          this.router.navigate(['/home']); // Redirige a la página principal
        },
        (error) => {
          console.error('Error en el inicio de sesión:', error);
          this.loginFailed = true; // Mostrar el mensaje de error
          this.cdr.detectChanges(); // Asegurar que Angular detecte el cambio
        }
      );
    }
  }

  // Validar que el correo electrónico ingresado tenga un formato válido
  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailInvalid = !emailPattern.test(this.username);
  }

  // Método para mostrar u ocultar la contraseña
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
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
