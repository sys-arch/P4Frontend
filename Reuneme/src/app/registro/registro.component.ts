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
  email: string = '';
  departamento: string = '';
  centro: string = '';
  fechaAlta: string = '';
  perfilLaboral: string = '';
  password1: string = '';
  password2: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  passwordVisible1 = false;
  passwordVisible2 = false;
  emailInvalid = false;
  fechaInvalid = false;
  isLoading: boolean = false;
  errorMessage: string = "";

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  // Validación de formato de correo electrónico
  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailInvalid = !emailPattern.test(this.email);
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

  togglePasswordVisibility1(): void{
    this.passwordVisible1 = !this.passwordVisible1;
    const passwordInput1 = document.getElementById('password1') as HTMLInputElement;
    passwordInput1.type = this.passwordVisible1 ? 'text' : 'password';
  }

  togglePasswordVisibility2(): void{
    this.passwordVisible2 = !this.passwordVisible2;
    const passwordInput2 = document.getElementById('password2') as HTMLInputElement;
    passwordInput2.type = this.passwordVisible2 ? 'text' : 'password';
    }

  // Compropbación de campos obligatorios y formato de correo electrónico
  onSubmit(): void {
    if (this.emailInvalid) {
      alert("Correo electrónico inválido");
      return;
    }

    if (!this.validateFechaAlta()) {
      alert("La fecha de alta no tiene un formato válido (dd/mm/aaaa)");
      return;
    }

    // El primero comprueba el formato de la contraseña y 
    // el segundo si las contraseñas coinciden
    if (!this.validarPassword() || !this.validarConfirmPassword()) {
      alert("Por favor corrige los errores en el formulario");
      return;
    }

    // Validar si los campos obligatorios están vacíos
    if (!this.nombre || !this.apellido || !this.email || !this.centro || !this.fechaAlta || !this.password1 || !this.password2) {
      this.errorMessage = 'Todos los campos obligatorios deben estar llenos.';
      return; // Detener el envío del formulario si hay campos vacíos
    }
    // const hashedPassword = this.password1; // Aquí sería el cifrado real.

    this.userService.register(this.nombre, this.apellido, this.email, this.centro, this.fechaAlta, this.perfilLaboral, this.password1)
      .subscribe({
        next: (response) => {
          console.log('Usuario registrado con éxito:', response);
        },
        error: (error) => {
          console.error('Error al registrar el usuario:', error);
        }
      });
  }

  //Botones de redirección

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
