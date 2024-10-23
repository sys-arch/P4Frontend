import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-contrasena',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-contrasena.component.html',
  styleUrls: ['./reset-contrasena.component.css']
})
export class ResetContrasenaComponent {
  newPassword: string = '';  // Nueva contraseña
  confirmPassword: string = '';  // Confirmar contraseña
  passwordError: string = '';  // Error en la validación de la contraseña
  confirmPasswordError: string = '';  // Error en la confirmación de la contraseña
  passwordVisible1: boolean = false;  // Controla la visibilidad de la nueva contraseña
  passwordVisible2: boolean = false;  // Controla la visibilidad de la confirmación
  isLoading: boolean = false;  // Controla el estado de carga

  constructor(private router: Router) {}

  // Requisitos de la contraseña
  validarPassword(): boolean {
    const passwordRegEx = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (RegExp(passwordRegEx).exec(this.newPassword)) {
      this.passwordError = '';
      return true;
    } else {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.';
      return false;
    }
  }

  // Validar que las contraseñas coincidan
  validarConfirmPassword(): boolean {
    if (this.newPassword === this.confirmPassword) {
      this.confirmPasswordError = '';
      return true;
    } else {
      this.confirmPasswordError = 'Las contraseñas no coinciden.';
      return false;
    }
  }

  // Alternar visibilidad de la nueva contraseña
  togglePasswordVisibility1(): void {
    this.passwordVisible1 = !this.passwordVisible1;
    const passwordInput1 = document.getElementById('new-password') as HTMLInputElement;
    passwordInput1.type = this.passwordVisible1 ? 'text' : 'password';
  }

  // Alternar visibilidad de la confirmación de contraseña
  togglePasswordVisibility2(): void {
    this.passwordVisible2 = !this.passwordVisible2;
    const passwordInput2 = document.getElementById('confirm-password') as HTMLInputElement;
    passwordInput2.type = this.passwordVisible2 ? 'text' : 'password';
  }

  // Enviar el formulario de restablecimiento de contraseña
  onSubmit(): void {
    // Validar contraseñas
    if (!this.validarPassword()) {
      alert('Contraseña inválida');
      return;
    }
    
    if (!this.validarConfirmPassword()) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Simular envío (puedes reemplazarlo con una llamada a un servicio real)
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('¡Contraseña restablecida con éxito!');
    }, 2000);
  }

  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}
