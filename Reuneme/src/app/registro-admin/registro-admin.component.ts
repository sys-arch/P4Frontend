import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-registro-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.css']
})
export class RegistroAdminComponent {
  nombre: string = '';
  primerApellido: string = ''; // Primer Apellido
  segundoApellido: string = ''; // Segundo Apellido
  email: string = '';
  centro: string = '';
  password1: string = '';
  password2: string = '';
  interno: boolean = false;  // Campo interno añadido
  passwordError: string = '';
  confirmPasswordError: string = '';
  passwordVisible1 = false;
  passwordVisible2 = false;
  emailInvalid = false;
  isLoading: boolean = false;
  errorMessage: string = "";

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailInvalid = !emailPattern.test(this.email);
  }

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

  togglePasswordVisibility1(): void {
    this.passwordVisible1 = !this.passwordVisible1;
    const passwordInput1 = document.getElementById('password1') as HTMLInputElement;
    passwordInput1.type = this.passwordVisible1 ? 'text' : 'password';
  }

  togglePasswordVisibility2(): void {
    this.passwordVisible2 = !this.passwordVisible2;
    const passwordInput2 = document.getElementById('password2') as HTMLInputElement;
    passwordInput2.type = this.passwordVisible2 ? 'text' : 'password';
  }

  onSubmit(): void {
    if (this.emailInvalid) {
      alert("Correo electrónico inválido");
      return;
    }

    if (!this.validarPassword() || !this.validarConfirmPassword()) {
      alert("Por favor corrige los errores en el formulario");
      return;
    }

    if (!this.nombre || !this.primerApellido || !this.email || !this.centro || !this.password1 || !this.password2) {
      this.errorMessage = 'Todos los campos obligatorios deben estar llenos.';
      return;
    }

    // Llamada al servicio de registro, pasando ambos apellidos
    this.userService.registerAdmin(this.nombre, this.primerApellido, this.segundoApellido, this.email, this.centro, this.password1, this.password2, this.interno)
      .subscribe({
        next: (response: any) => {
          console.log('Usuario registrado con éxito:', response);
        },
        error: (error: any) => {
          console.error('Error al registrar el usuario:', error);
        }
      });
  }

  gotoVentanaPrincipal(): void {
    this.router.navigate(['/ventana-principal']);
  }
}
