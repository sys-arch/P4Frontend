import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from '../shared/loader/loader.component';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';



@Component({
  selector: 'app-registro-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, FooterComponent, HeaderComponent],
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
    const passwordRegEx = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-_ç<>])[A-Za-z\d@$!%*?&#+\-_ç<>]{8,}$/;

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

    // El primero comprueba el formato de la contraseña y 
    // el segundo si las contraseñas coinciden
    if (!this.validarPassword()) {
      alert("Contraseña inválida");
      return;
    } else if(!this.validarConfirmPassword()) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Comprueba si todos los campos obligatorios han sido completados
    if (!this.nombre || !this.primerApellido || !this.email || !this.centro || !this.password1 || !this.password2) {
      alert('Todos los campos obligatorios deben estar llenos.');
      return;
    }

    // Llamada al servicio de registro, pasando ambos apellidos
    this.userService.registerAdmin(this.nombre, this.primerApellido, this.segundoApellido, this.email, this.centro, this.password1, this.password2, this.interno)
      .subscribe({
        next: (response: any) => {
          console.log('Administrador registrado con éxito:', response);
          this.navigateTo('/ventana-principal');
        },
        error: (error: any) => {
          console.error('Error al registrar el administrador:', error);
        }
      });
  }

  // Método para redirigir a las diferentes páginas
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }

  focusNext(nextFieldIf: string){
    const nextElement = document.getElementById(nextFieldIf);
    if (nextElement){
      nextElement.focus();
    }
  }
}
