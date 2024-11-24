import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GravatarService } from '../services/gravatar.service';
import { UserService } from '../services/user.service';
import { AusenciasComponent } from '../shared/ausencias/ausencias.component';
import { CalendarioComponent } from '../shared/calendario/calendario.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { ListaUsuariosComponent } from '../shared/lista-usuarios/lista-usuarios.component';
import { LoaderComponent } from "../shared/loader/loader.component";
import { TurnosHorariosComponent } from "../shared/turnos-horarios/turnos-horarios.component";



@Component({
  selector: 'app-ventana-principal',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, FooterComponent, HeaderComponent, CalendarioComponent, AusenciasComponent, ListaUsuariosComponent, TurnosHorariosComponent],
  templateUrl: './ventana-principal.component.html',
  styleUrls: ['./ventana-principal.component.css']
})
export class VentanaPrincipalComponent implements OnInit {
  titulo: string = 'Bienvenido a la Ventana Principal';
  isAdmin: boolean = true;
  token: string = '';
  myemail: string = '';
  isLoading: boolean = false;
  selectedUser: any = null;
  showDeleteModal: boolean = false;
  countdown: number = 5;
  countdownInterval: any;
  activeTab: string = 'tab1'; // Por defecto, la pestaña 1 está activa

  loggedUser: any = {
    firstName: 'John',
    lastName: 'Doe',
    profilePicture: '/assets/images/UsuarioSinFoto.png',
    role: 'admin'
  };

  /*ESTO QUIZAS HAYA Q QUITARLO */
  users = [
    {
      id: '1',
      firstName: 'Aaron',
      lastName: 'Smith',
      email: 'aaron.smith@example.com',
      isAdmin: true,
      profilePicture: 'assets/images/test-perfil1.jpg',
      estado: 'Validado'
    },
    {
      firstName: 'Maria',
      lastName: 'González Diaz del Campo Blanco de Castilla',
      email: 'maria.gonzalez@example.com',
      isAdmin: false,
      profilePicture: 'assets/images/test-perfil2.jpg',
      estado: 'No validado'
    },
    {
      firstName: 'Maria',
      lastName: 'González',
      email: 'maria.gonzalez@example.com',
      department: 'Tecnología',
      center: 'Centro Sur',
      joiningDate: '15/08/2021',
      jobTitle: 'Desarrolladora',
      isAdmin: false,
      profilePicture: 'assets/images/test-perfil2.jpg',
      estado: 'No validado'
    },
  
  ];
  
  constructor(
    private router: Router,
    private userService: UserService,
    private gravatarService: GravatarService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.token = sessionStorage.getItem('token') || '';
    const localEmail = sessionStorage.getItem('email') || '';
  
    // Obtener el parámetro 'email' de la URL o usar el email de localStorage
    const routeEmail = this.route.snapshot.paramMap.get('email');
    this.myemail = routeEmail || localEmail;
    this.isAdmin = this.isAdminUser();
    // Determina si el usuario es administrador o empleado basado en el prefijo del token
    if (this.isAdmin) {
      this.loggedUser.role = 'admin';
    } else {
      this.isAdmin = false;
      this.loggedUser.role = 'employee';
    }
  
    // Obtener la información del usuario logueado según el rol
    if (this.myemail && this.token) {
      if (this.isAdmin) {
        // Llama a verDatosAdmin si es administrador
        this.userService.verDatosAdmin(this.myemail).subscribe(
          (userInfo: any) => {
            this.loggedUser.firstName = userInfo.nombre;
            this.loggedUser.lastName = `${userInfo.apellido1} ${userInfo.apellido2}`;
            this.loggedUser.profilePicture = this.gravatarService.getGravatarUrl(userInfo.email);
          },
          (error) => {
            console.error('Error al obtener la información del administrador:', error);
          }
        );
      } else {
        // Llama a verDatosEmpleado si es empleado
        this.userService.verDatosEmpleado(this.myemail).subscribe(
          (userInfo: any) => {
            this.loggedUser.firstName = userInfo.nombre;
            this.loggedUser.lastName = `${userInfo.apellido1} ${userInfo.apellido2}`;
            this.loggedUser.profilePicture = this.gravatarService.getGravatarUrl(userInfo.email);
          },
          (error) => {
            console.error('Error al obtener la información del empleado:', error);
          }
        );
      }
    }


  }
  private isAdminUser(): boolean {
    const token = this.token;
    if (!token) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Verifica tanto "ROLE_ADMIN" como "ADMIN"
      return payload.role === 'ROLE_ADMIN' || payload.role === 'ADMIN';
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return false;
    }
  }
  logout(): void {
    this.isLoading = true;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('2f');
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/login']);
    }, 1000);
  }
  visitProfile(selectedUser: any): void {
    if (selectedUser) {
      const route = selectedUser.isAdmin ? '/perfil-admin' : '/perfil-usuario';
      this.router.navigate([route, { email: selectedUser.email }]);
    } else {
      console.error('El usuario seleccionado no está definido');
    }
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  // Método para navegar a una ruta específica
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}
