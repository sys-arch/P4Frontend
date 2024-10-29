import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from "../loader/loader.component";
import { GravatarService } from '../services/gravatar.service';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';


@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent, FooterComponent, HeaderComponent]
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
    private readonly userService: UserService,
    private gravatarService: GravatarService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token') || '';
    const email = localStorage.getItem('email') || '';
    console.log('Token:', token);

    // Verifica si ambos están disponibles
    if (token && email) {
      console.log('Token y email disponibles');
      this.getUserInfo(email, token);
    }

  }

  getUserInfo(email: string, token: string): void {
    this.isLoading = true;
    this.userService.getUserInfo(email, token).subscribe(
      (userInfo: any) => {
        this.admin.nombre = userInfo.nombre;
        this.admin.apellidos = `${userInfo.apellido1} ${userInfo.apellido2}`;
        this.admin.correo = userInfo.email;
        this.admin.centroTrabajo = userInfo.centro;
        this.admin.interno = userInfo.interno || false;
        this.profilePicture = this.gravatarService.getGravatarUrl(userInfo.email);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener la información del usuario:', error);
        this.isLoading = false;
      }
    );
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
