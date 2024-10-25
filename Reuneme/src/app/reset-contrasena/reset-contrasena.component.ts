import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service'; // Importa el 


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
  email: string = '';  // Email del usuario
  errorMessage: string = '';  // Mensaje de error
  password1: string = '';  // Nueva contraseña
  password2: string = '';  // Confirmar contraseña

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object  // Inyecta el identificador de la plataforma
  ) {}
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {  // Asegúrate de que esto se ejecute solo en el navegador
      this.token = this.route.snapshot.queryParams['token'];
  
      if (!this.token) {
        this.errorMessage = 'No se ha proporcionado un token válido.';
        console.error('No se ha proporcionado un token válido.');
        return;
      }
  
      this.userService.validateToken(this.token).subscribe({
        next: (response) => {
          this.isValidToken = true;
          this.email = response.email;
          console.log('Token válido. Email:', this.email);
        },
        error: () => {
          this.errorMessage = 'El token es inválido o ha caducado.';
        }
      });
    }
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

  // Método para mostrar u ocultar la contraseña
  
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
  onSubmit(event: Event): void {
      // Evitar el comportamiento por defecto del formulario
      event.preventDefault(); 
      console.log('Enviando formulario...');
  
      // Verifica si las contraseñas están completas y son válidas antes de enviar
      if (!this.newPassword || !this.confirmPassword) {
          this.errorMessage = 'Por favor, completa ambos campos de contraseña.';
          return;
      }
  
      // Validar contraseñas
      if (!this.validarPassword()) {
          alert('Contraseña inválida, debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.');
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
  }
  


  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}
