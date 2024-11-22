import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { GravatarService } from '../services/gravatar.service';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { LoaderComponent } from "../shared/loader/loader.component";


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
    private gravatarService: GravatarService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token') || '';
    const localEmail = sessionStorage.getItem('email') || '';
    console.log('Token:', token);

    // Verifica si hay un email como argumento en la URL
    const routeEmail = this.route.snapshot.paramMap.get('email');

    // Usar el email de la URL si existe, de lo contrario usar el del localStorage
    const emailToUse = routeEmail || localEmail;

    if (token && emailToUse) {
      console.log('Cargando perfil para el email:', emailToUse);
      this.getUserInfo(emailToUse, token);
    } else {
      console.error('No se encontró un email válido para cargar el perfil');
    }
  }

  getUserInfo(email: string, token: string): void {
    this.isLoading = true;
    this.userService.verDatosAdmin(email).subscribe(
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
        console.error('Error al obtener la información del administrador:', error);
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

  editUser(userEmail: string): void {
    if (userEmail) {
      const token = sessionStorage.getItem('token') || '';
      const role = this.decodeRoleFromToken(token); // Decodificar el rol desde el token
      console.log(this.admin.correo);
  
      // Redirigir al formulario de edición con el estado del usuario
      this.router.navigate(['/edicion-usuario'], {
        state: {
          user: this.admin.correo, // Pasar el correo del usuario
          role: role // Pasar el rol (administrador o empleado)
        },
      });
    } else {
      console.error('El correo electrónico del usuario no está definido');
    }
  }

  // Método para decodificar el rol desde el token
  private decodeRoleFromToken(token: string): string {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role; // Extraer el rol del token
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return ''; // Retornar un valor vacío si falla la decodificación
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
