import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.services';
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
  apellido2: string = '';
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
  bloqueado = true;
  verificado = false;
  formattedDate: string = '';

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  // Validación de formato de correo electrónico
  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailInvalid = !emailPattern.test(this.email);
  }

  
  // Validación de la contraseña
  validarPassword(): boolean {
    const passwordRegEx = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

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

  togglePasswordVisibility1(): void{ // Cambiar visibilidad de la contraseña
    this.passwordVisible1 = !this.passwordVisible1;
    const passwordInput1 = document.getElementById('password1') as HTMLInputElement;
    passwordInput1.type = this.passwordVisible1 ? 'text' : 'password';
  }

  togglePasswordVisibility2(): void{ // Cambiar visibilidad de la contraseña2
    this.passwordVisible2 = !this.passwordVisible2;
    const passwordInput2 = document.getElementById('password2') as HTMLInputElement;
    passwordInput2.type = this.passwordVisible2 ? 'text' : 'password';
    }

  // Compropbación de campos obligatorios y formato de correo electrónico y fecha alta
  onSubmit(): void {
    if (this.emailInvalid) {
      alert("Correo electrónico inválido");
      return;
    } 
    // El primero comprueba el formato de la contraseña y 
    // el segundo si las contraseñas coinciden
    if (!this.validarPassword()) {
      alert("Contraseña inválida");
      return;
    } else if(!this.validarConfirmPassword()) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    // Validar si los campos obligatorios están vacíos
    if (!this.nombre || !this.apellido || !this.apellido2 || !this.email || !this.centro || !this.fechaAlta || !this.password1 || !this.password2) {
      this.errorMessage = 'Todos los campos obligatorios deben estar llenos.';
      return; 
    }
    // const hashedPassword = this.password1; // Aquí sería el cifrado real.

    let formattedDate = this.fechaAlta ? this.fechaAlta.toString().split('T')[0] : '';

    console.log({
    email: this.email,
    pwd1: this.password1,
    pwd2: this.password2,
    nombre: this.nombre,
    apellido1: this.apellido,
    apellido2: this.apellido2,
    centro: this.centro,
    departamento: this.departamento,
    perfil: this.perfilLaboral,
    fechaalta: formattedDate,
    bloqueado: this.bloqueado,
    verificado: this.verificado
});

    this.userService.register(this.email, this.password1,this.password2, this.nombre,
              this.apellido, this.apellido2, this.centro,
              this.departamento, this.perfilLaboral, formattedDate,
              this.bloqueado, this.verificado)
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
