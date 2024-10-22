import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  admin = {
    nombre: '',
    apellidos: '',
    correo: '',
    centroTrabajo: '',
    interno: false
  };

  profilePicture: string = '';
  isLoading: boolean = false;
  emailInvalid = false;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  // Método para regresar a la página principal
  goToLanding(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/']);
    }, 1000);
  }

  // Método para ir a la página de inicio de sesión
  goToLogin(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/login']);
    }, 1000);
  }

  // Método para ir a la página de doble factor de autenticación
  goToDoblefactor(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/../doblefactor']);
    }, 1000);
  }
}
