import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContrasenaOlvidadaComponent } from "../contrasena-olvidada/contrasena-olvidada.component";
import { LoaderComponent } from "../loader/loader.component";
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent, FooterComponent, HeaderComponent, ContrasenaOlvidadaComponent],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

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
  token: string = '';

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}
  
  ngOnInit(): void {
    const token = localStorage.getItem('token') || '';
    const email = localStorage.getItem('email') || '';

    // Llamada al servicio para obtener la información del usuario
    if (token && email) {
      this.getUserInfo(email, token);
    }
  }

  getUserInfo(email: string, token: string): void {
    this.isLoading = true;
    this.userService.getUserInfo(email, token).subscribe(
      (userInfo: any) => {
        this.user.nombre = userInfo.nombre;
        this.user.apellidos = `${userInfo.apellido1} ${userInfo.apellido2}`;
        this.user.correo = userInfo.email;
        this.user.depart = userInfo.departamento || 'N/A';
        this.user.centroTrabajo = userInfo.centro || 'N/A';
        this.user.alta = userInfo.fechaalta || 'N/A';
        this.user.perfil = userInfo.perfil || 'N/A';
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

  // Método para redirigir a cambiar la contraseña
  navigateToChangePassword(): void {
    this.router.navigate(['/edicion-usuario'], { state: { token: this.token } });
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
