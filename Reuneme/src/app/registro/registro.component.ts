import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  imports: [CommonModule, FormsModule, LoaderComponent]
})
export class RegistroComponent {

  nombre: string = '';
  apellido: string = '';
  username: string = '';
  departamento: string = '';
  centro: string = '';
  fechaAlta: string = '';
  perfilLaboral: string = '';
  password1: string = '';
  password2: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  passwordVisible = false;
  emailInvalid = false;
  fechaInvalid = false;
  isLoading: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  // Validación de formato de correo electrónico
  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailInvalid = !emailPattern.test(this.username);
  }

  // Validación de formato de fecha (dd/mm/aaaa)
  validateFechaAlta(): boolean {
    const fechaPattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    this.fechaInvalid = !fechaPattern.test(this.fechaAlta);
    return !this.fechaInvalid;
  }

  // Validación de la contraseña
  validarPassword(): boolean {
    const passwordRegEx = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (RegExp(passwordRegEx).exec(this.password1)) {
      this.passwordError = '';
      return true;
    } else {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.';
      return false;
    }
  }

  validarConfirmPassword(): boolean {
    if (this.password1 === this.password2) {
      this.confirmPasswordError = '';
      return true;
    } else {
      this.confirmPasswordError = 'Las contraseñas no coinciden';
      return false;
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput1 = document.getElementById('password1') as HTMLInputElement;
    const passwordInput2 = document.getElementById('password2') as HTMLInputElement;
    passwordInput1.type = this.passwordVisible ? 'text' : 'password';
    passwordInput2.type = this.passwordVisible ? 'text' : 'password';
  }

  // Envío del formulario
  onSubmit(): void {
    if (this.emailInvalid) {
      alert("Correo electrónico inválido");
      return;
    }

    if (!this.validateFechaAlta()) {
      alert("La fecha de alta no tiene un formato válido (dd/mm/aaaa)");
      return;
    }

    if (!this.validarPassword() || !this.validarConfirmPassword()) {
      alert("Por favor corrige los errores en el formulario");
      return;
    }

    // Aquí deberías cifrar la contraseña antes de enviarla al backend (esto se hace en el backend normalmente).
    // Para propósitos de demostración, asumimos que `userService` maneja esto.
    const hashedPassword = this.password1; // Aquí sería el cifrado real.

    // Llamada al servicio de registro
    this.userService.register({
      nombre: this.nombre,
      apellido: this.apellido,
      username: this.username,
      departamento: this.departamento,
      centro: this.centro,
      fechaAlta: this.fechaAlta,
      perfilLaboral: this.perfilLaboral,
      password: hashedPassword
    }).subscribe({
      next: response => {
        this.router.navigate(['/login']);
      },
      error: error => {
        console.error('Error en el registro', error);
      }
    });
  }

  goToLanding(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/']);
    }, 1000);
  }

  goToLogin(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/login']);
    }, 1000);
  }
}
