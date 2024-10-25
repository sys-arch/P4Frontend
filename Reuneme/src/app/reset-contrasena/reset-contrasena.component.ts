import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service'; // Importa el UserService

@Component({
  selector: 'app-reset-contrasena',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-contrasena.component.html',
  styleUrls: ['./reset-contrasena.component.css']
})
export class ResetContrasenaComponent implements OnInit {
  newPassword: string = '';  // Nueva contraseña
  confirmPassword: string = '';  // Confirmar contraseña
  passwordError: string = '';  // Error en la validación de la contraseña
  confirmPasswordError: string = '';  // Error en la confirmación de la contraseña
  passwordVisible1: boolean = false;  // Controla la visibilidad de la nueva contraseña
  passwordVisible2: boolean = false;  // Controla la visibilidad de la confirmación
  isLoading: boolean = false;  // Controla el estado de carga
  token: string = '';  // Token obtenido de la URL
  isValidToken: boolean = false;  // Indica si el token es válido
  errorMessage: string = '';  // Mensaje de error

  constructor(
    private router: Router,
    private route: ActivatedRoute,  // Para obtener el token de la URL
    private userService: UserService  // Para llamar a los métodos del servicio
  ) {}

  ngOnInit(): void {
    // Obtener el token de la URL
    this.token = this.route.snapshot.queryParams['token'];
    
    // Si no hay token en la URL
    if (!this.token) {
      this.errorMessage = 'No se ha proporcionado un token válido.';
      return;
    }

    // Validar el token
    this.userService.validateToken(this.token).subscribe({
      next: () => {
        this.isValidToken = true;  // Token válido
      },
      error: () => {
        this.errorMessage = 'El token es inválido o ha caducado.';
      }
    });
  }

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
  /*
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

    // Enviar la nueva contraseña al backend
    this.isLoading = true;
    this.userService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.isLoading = false;
        alert('¡Contraseña restablecida con éxito!');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isLoading = false;
        alert('Error al restablecer la contraseña. Inténtalo de nuevo.');
      }
    });
  }*/

  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}
