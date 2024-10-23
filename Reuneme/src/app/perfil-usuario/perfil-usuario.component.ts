import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { LoaderComponent } from "../loader/loader.component";
@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent] ,// Importaciones necesarias para el uso de ngModel
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent {

  user = {
    nombre: 'Nombre de usuario',
    apellidos: 'Apellidos de usuario',
    correo: 'user@correo.com',
    depart: 'Departamento',
    centroTrabajo: 'Centro de Trabajo',
    alta: 'Fecha de alta',
    perfil: 'Perfil'
  };

  profilePicture: string | ArrayBuffer | null = null;
  isLoading: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}
  
  ngOnInit(): void {
    // Método llamado al inicializar el componente
    // Si no tienes lógica específica aquí, lo puedes dejar vacío
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.profilePicture = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  // Método para redirigir a las diferentes páginas
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}
