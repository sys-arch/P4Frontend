import { CommonModule } from '@angular/common'; // Asegura que se importe
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule] // Importaciones necesarias para el uso de ngModel
})
export class LoginComponent {
  username: string = ''; 
  password: string = '';
  passwordVisible = false;
  emailInvalid = false;

  constructor(private router: Router) { }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  // Método de validación de correo electrónico
  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailInvalid = !emailPattern.test(this.username);
  }

  // Intento de inicio de sesión
  loginAttempt(): void {
    this.validateEmail();
    if (!this.emailInvalid) {
      console.log('Iniciando sesión con: ', this.username, this.password);
      // Implementa lógica de autenticación aquí
    }
  }

  // Navegar a la página de inicio
  goToLanding(): void {
    this.router.navigate(['/']); // Redirige a la página principal (landing page)
  }
}
