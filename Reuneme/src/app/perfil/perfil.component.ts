import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { LoaderComponent } from "../loader/loader.component";
@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent] // Importaciones necesarias para el uso de ngModel
 // Importaciones necesarias para el uso de ngModel
})


export class PerfilComponent implements OnInit {
  
  admin = {
    nombre: 'Nombre de Administrador',
    apellidos: 'Apellidos de Administrador',
    correo: 'admin@correo.com',
    centroTrabajo: 'Centro de Trabajo',
    interno: false
  };

  profilePicture: string | ArrayBuffer | null = null;
  isLoading: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
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