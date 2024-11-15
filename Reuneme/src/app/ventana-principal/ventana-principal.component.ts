import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from "../shared/loader/loader.component";
import { GravatarService } from '../services/gravatar.service';
import { UserService } from '../services/user.service';
import { AusenciasComponent } from '../shared/ausencias/ausencias.component';
import { CalendarioComponent } from '../shared/calendario/calendario.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { ListaUsuariosComponent } from '../shared/lista-usuarios/lista-usuarios.component';
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
    this.token = localStorage.getItem('token') || '';
    const localEmail = localStorage.getItem('email') || '';
  
    // Obtener el parámetro 'email' de la URL o usar el email de localStorage
    const routeEmail = this.route.snapshot.paramMap.get('email');
    this.myemail = routeEmail || localEmail;
  
    // Determina si el usuario es administrador o empleado basado en el prefijo del token
    if (this.token.startsWith('a-')) {
      this.isAdmin = true;
      this.loggedUser.role = 'admin';
      this.loadAllUsers(); // Cargar todos los usuarios si es administrador
    } else if (this.token.startsWith('e-')) {
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

    

    // Cargar ausencias desde localStorage al inicializar el componente
    const ausenciasGuardadas = localStorage.getItem('ausencias');
    if (ausenciasGuardadas) {
      this.ausencias = JSON.parse(ausenciasGuardadas).map((ausencia: any) => ({
        ...ausencia,
        fechaInicio: new Date(ausencia.fechaInicio),
        fechaFin: new Date(ausencia.fechaFin)
      }));
    } else {
      // Inicializar con datos por defecto si no hay ausencias en localStorage
      this.ausencias = [
        {
          fechaInicio: new Date('2024-01-01'),
          fechaFin: new Date('2024-02-01'),
          motivo: 'Vacaciones',
          usuario: 'Aaron Smith',
          texto: 'Ausencia: 01/01/2024 - 01/02/2024 (Motivo: Vacaciones)'
        },
        {
          fechaInicio: new Date('2022-03-01'),
          fechaFin: new Date('2022-04-01'),
          motivo: 'Enfermedad',
          usuario: 'Maria González',
          texto: 'Ausencia: 01/03/2022 - 01/04/2022 (Motivo: Enfermedad)'
        },
      ];
      // Guardar las ausencias iniciales en localStorage
      localStorage.setItem('ausencias', JSON.stringify(this.ausencias));
    }
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


  /*---------------------------------- Métodos de Ausencias ----------------------------------*/
  
  ausencias: { 
    fechaInicio: Date; 
    fechaFin: Date; 
    motivo: string; 
    usuario: string;
    texto: string;
  }[] = [];

  nuevaAusencia: { 
    fechaInicio: Date | null; 
    fechaFin: Date | null; 
    motivo: string; 
    usuario: string;
  } = {
    fechaInicio: null,
    fechaFin: null,
    motivo: '',
    usuario: ''
  };

  showAddAusenciaForm: boolean = false;
  showDeleteModalAusencia: boolean = false;
  ausenciaAEliminar: number | null = null;

  // Método para mostrar/ocultar el formulario de añadir ausencia
  toggleAddAusenciaForm(): void {
    this.showAddAusenciaForm = !this.showAddAusenciaForm;
  }

  // Método para añadir una nueva ausencia
  addAusencia(): void {
    if (!this.nuevaAusencia.fechaInicio || !this.nuevaAusencia.fechaFin || !this.nuevaAusencia.usuario || !this.nuevaAusencia.motivo) {
      alert("Por favor, completa todos los campos de la ausencia.");
      return;
    }

    // Validar que la fecha de inicio no sea posterior a la fecha de fin
    if (this.nuevaAusencia.fechaInicio > this.nuevaAusencia.fechaFin) {
      alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

    // Validar solapamiento de fechas
    if (this.haySuperposicionAusencia(this.nuevaAusencia.fechaInicio, this.nuevaAusencia.fechaFin)) {
      alert("La ausencia se superpone con otra existente. Por favor, selecciona otro rango de fechas.");
      return;
    }

    const textoAusencia = `Ausencia: ${this.nuevaAusencia.fechaInicio.toLocaleDateString()} - ${this.nuevaAusencia.fechaFin.toLocaleDateString()} (Motivo: ${this.nuevaAusencia.motivo})`;

    // Agregar la ausencia
    this.ausencias.push({
      fechaInicio: this.nuevaAusencia.fechaInicio,
      fechaFin: this.nuevaAusencia.fechaFin,
      motivo: this.nuevaAusencia.motivo,
      usuario: this.nuevaAusencia.usuario,
      texto: textoAusencia
    });

    // Guardar las ausencias actualizadas en localStorage
    localStorage.setItem('ausencias', JSON.stringify(this.ausencias));

    // Reiniciar el formulario
    this.nuevaAusencia = { fechaInicio: null, fechaFin: null, usuario: '', motivo: '' };
    this.showAddAusenciaForm = false;
  }

  // Método para verificar superposición de ausencias
  haySuperposicionAusencia(inicio: Date, fin: Date): boolean {
    return this.ausencias.some(ausencia =>
      (inicio <= ausencia.fechaFin && fin >= ausencia.fechaInicio)
    );
  }

  // Métodos para manejar el modal de confirmación de eliminación de ausencia
  openDeleteModalAusencia(index: number): void {
    this.showDeleteModalAusencia = true;
    this.ausenciaAEliminar = index;
  }

  confirmDeleteAusencia(): void {
    if (this.ausenciaAEliminar !== null) {
      this.ausencias.splice(this.ausenciaAEliminar, 1);

      // Actualizar localStorage después de eliminar
      localStorage.setItem('ausencias', JSON.stringify(this.ausencias));

      this.ausenciaAEliminar = null;
    }
    this.showDeleteModalAusencia = false;
  }

  cancelDeleteAusencia(): void {
    this.ausenciaAEliminar = null;
    this.showDeleteModalAusencia = false;
  }





  // Cargar todos los usuarios
  loadAllUsers(): void {
    this.isLoading = true;
    this.users = []; // Limpia la lista antes de recargar
  
    this.userService.getAllUsers(this.token).subscribe(
      (userList: any[]) => {
        console.log('Lista de usuarios:', userList);
        this.users = userList.map(userInfo => {
          const isAdmin = userInfo.hasOwnProperty('interno') && userInfo.interno !== undefined;
          const isBlocked = !isAdmin && userInfo.bloqueado === true;
          
          return {
            firstName: userInfo.nombre,
            lastName: `${userInfo.apellido1} ${userInfo.apellido2}`,
            email: userInfo.email,
            isAdmin: isAdmin,
            profilePicture: this.gravatarService.getGravatarUrl(userInfo.email),
            estado: isAdmin ? 'Validado' : (isBlocked ? 'Bloqueado' : (userInfo.verificado ? 'Validado' : 'No validado')),
          };
        });
        this.users.sort((a, b) => a.lastName.localeCompare(b.lastName));
  
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener la lista de usuarios:', error);
        this.isLoading = false;
      }
    );
  }

}
