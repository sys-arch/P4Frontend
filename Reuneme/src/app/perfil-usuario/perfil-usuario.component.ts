import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from "../shared/loader/loader.component";
import { GravatarService } from '../services/gravatar.service';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';


@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent, FooterComponent, HeaderComponent],
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

  profilePicture: string | ArrayBuffer | null = 'assets/UsuarioSinFoto.png';
  isLoading: boolean = false;
  token: string = '';

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private gravatarService: GravatarService,
    private readonly route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    const token = localStorage.getItem('token') || '';
    const localEmail = localStorage.getItem('email') || '';

    // Obtener el parámetro 'email' de la URL
    const routeEmail = this.route.snapshot.paramMap.get('email');

    // Determinar el email a usar
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
    this.userService.verDatosEmpleado(email).subscribe(
      (userInfo: any) => {
        this.user.nombre = userInfo.nombre;
        this.user.apellidos = `${userInfo.apellido1} ${userInfo.apellido2}`;
        this.user.correo = userInfo.email;
        this.user.depart = userInfo.departamento || 'N/A';
        this.user.centroTrabajo = userInfo.centro || 'N/A';
        this.user.alta = userInfo.fechaalta || 'N/A';
        this.user.perfil = userInfo.perfil || 'N/A';
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

  // Método para redirigir a cambiar la contraseña
  navigateToChangePassword(): void {
    this.router.navigate(['/edicion-usuario'], { state: { token: this.token } });
  }
  editUser(userEmail: string): void {
    if (userEmail) {
      this.router.navigate(['/edicion-usuario', userEmail]);
    } else {
      console.error('El correo electrónico del usuario no está definido');
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
