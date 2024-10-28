import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from "../loader/loader.component";
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';





@Component({
  selector: 'app-ventana-principal',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, FooterComponent, HeaderComponent],
  templateUrl: './ventana-principal.component.html',
  styleUrls: ['./ventana-principal.component.css']
})


export class VentanaPrincipalComponent implements OnInit {
  titulo: string = 'Bienvenido a la Ventana Principal';
  isAdmin: boolean = true;
  token: string = '';
  myemail: string = '';
  isLoading: boolean = false;
  searchBy: string = 'name';
  searchQuery: string = '';
  filterBy: string = 'all';
  selectedUser: any = null;
  showBlockModal: boolean = false;
  showValiModal: boolean = false;
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
      lastName: 'González',
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
    private userService: UserService // Inyecta el servicio UserService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.myemail = localStorage.getItem('email') || '';

    // Determina si el usuario es administrador o empleado basado en el prefijo del token
    if (this.token.startsWith('a-')) {
      this.isAdmin = true;
      this.loggedUser.role = 'admin';
      this.loadAllUsers(); // Cargar todos los usuarios si es administrador
    } else if (this.token.startsWith('e-')) {
      this.isAdmin = false;
      this.loggedUser.role = 'employee';
    }

    // Obtener la información del usuario logueado
    this.userService.getUserInfo(this.myemail, this.token).subscribe(
      (userInfo: any) => {
        this.loggedUser.firstName = userInfo.nombre;
        this.loggedUser.lastName = `${userInfo.apellido1} ${userInfo.apellido2}`;
      },
      (error) => {
        console.error('Error al obtener la información del usuario:', error);
      }
    );
  }

  

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  toggleDelete(user: any): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
    this.countdown = 5;
    this.startCountdown();
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  confirmDelete(): void {
    if (this.selectedUser) {
        this.userService.deleteUserByEmail(this.selectedUser.email, this.token).subscribe(
            () => {
                this.showDeleteModal = false; 
                this.selectedUser = null; 
                clearInterval(this.countdownInterval); 
                this.loadAllUsers(); // Recarga la lista completa
            },
            (error) => {
                console.error('Error al eliminar el usuario:', error);
            }
        );
    }
}

loadAllUsers(): void {
  this.isLoading = true;
  this.users = []; // Limpia la lista antes de recargar
  this.userService.getAllEmails(this.token).subscribe(
      (emails: string[]) => {
          const userObservables = emails.map((email) =>
              this.userService.getUserInfo(email, this.token)
          );

          // Suscribe a cada observable y añade los usuarios a la lista
          userObservables.forEach((userObs, index) => {
              userObs.subscribe(
                  (userInfo: any) => {
                      const isAdmin = userInfo.hasOwnProperty('interno') && userInfo.interno !== undefined;
                      const isBlocked = !isAdmin && userInfo.bloqueado === true; // Verifica bloqueo solo para usuarios
                      
                      const user = {
                          firstName: userInfo.nombre,
                          lastName: `${userInfo.apellido1} ${userInfo.apellido2}`,
                          email: userInfo.email,
                          isAdmin: isAdmin,
                          profilePicture: userInfo.profilePicture || '/assets/images/UsuarioSinFoto.png',
                          // Solo los usuarios pueden estar bloqueados
                          estado: isAdmin ? 'Validado' : (isBlocked ? 'Bloqueado' : (userInfo.verificado ? 'Validado' : 'No validado')),
                      };
                      this.users.push(user);
                  },
                  (error) => {
                      console.error(`Error al obtener la información del usuario con email ${emails[index]}:`, error);
                  }
              );
          });

          this.isLoading = false;
      },
      (error) => {
          console.error('Error al obtener la lista de emails:', error);
          this.isLoading = false;
      }
  );
}






  cancelDelete(): void {
    this.selectedUser = null;
    this.showDeleteModal = false;
    clearInterval(this.countdownInterval);
  }

  toggleBlocked(user: any): void {
    if (user.isAdmin) {
        alert("No se permite bloquear a un administrador.");
        return;
    }

    if (user.estado === 'Bloqueado') {
        // Desbloquea directamente si el usuario ya está bloqueado
        this.userService.blockUserByEmail(user.email, false, this.token).subscribe(
            () => {
                user.estado = 'No validado'; // Actualiza el estado a "No validado" al desbloquear
                this.loadAllUsers(); // Recarga la lista de usuarios
            },
            (error) => {
                console.error('Error al desbloquear el usuario:', error);
            }
        );
    } else {
        // Si está desbloqueado, mostrar el modal de confirmación de bloqueo
        this.selectedUser = user;
        this.showBlockModal = true;
    }
  }

  confirmBlock(): void {
      if (this.selectedUser) {
          // Determinar si se va a bloquear o desbloquear basado en el estado actual
          const bloquear = this.selectedUser.estado !== 'Bloqueado';
          
          // Llamar al servicio para bloquear o desbloquear al usuario
          this.userService.blockUserByEmail(this.selectedUser.email, bloquear, this.token).subscribe(
              () => {
                  // Actualizar el estado del usuario en la lista según el resultado
                  this.selectedUser.estado = bloquear ? 'Bloqueado' : 'No validado';
                  this.showBlockModal = false; // Cerrar el modal
                  this.selectedUser = null; // Restablecer usuario seleccionado
                  this.loadAllUsers(); // Recargar la lista de usuarios
              },
              (error) => {
                  console.error('Error al cambiar el estado de bloqueo del usuario:', error);
              }
          );
      }
  }

  cancelBlock(): void {
      this.selectedUser = null;
      this.showBlockModal = false;
  }


  toggleValidation(user: any): void {
    if (user.estado === 'No validado') {
      this.selectedUser = user;
      this.showValiModal = true;
    }
  }

  confirmValidation(): void {
    if (this.selectedUser) {
      this.userService.verifyUserByEmail(this.selectedUser.email, true, this.token).subscribe(
        () => {
          this.selectedUser.estado = 'Validado';
          this.showValiModal = false;
          this.selectedUser = null;
          this.loadAllUsers();
        },
        (error) => {
          console.error('Error al verificar el usuario:', error);
        }
      );
    }
  }

  cancelValidation(): void {
    this.selectedUser = null;
    this.showValiModal = false;
  }

  

  filteredUsers() {
    return this.users
      .filter(user => {
        if (this.filterBy === 'admin' && !user.isAdmin) return false;
        if (this.filterBy === 'employee' && user.isAdmin) return false;
        if (this.filterBy === 'blocked' && user.estado !== 'Bloqueado') return false;
        if (this.filterBy === 'validated' && user.estado !== 'Validado') return false;
        if (this.filterBy === 'notValidated' && user.estado !== 'No validado') return false;
        return true;
      })
      .filter(user => {
        const searchQueryLower = this.searchQuery.toLowerCase();
        if (this.searchBy === 'name') {
          return user.firstName.toLowerCase().includes(searchQueryLower);
        } else if (this.searchBy === 'email') {
          return user.email.toLowerCase().includes(searchQueryLower);
        }
        return false;
      });
  }

  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }

  // Método para navegar a la vista de edición de usuario
  editUser(userEmail: string): void {
    if (userEmail) {
      this.router.navigate(['/edicion-usuario', userEmail]);
    } else {
      console.error('El correo electrónico del usuario no está definido');
    }
  }
  
  /*<!-- AÑADIDO NUEVO BORRAR LUEGO-->*/
  turnosHorarios: { inicio: number; fin: number; texto: string }[] = [
    {
      inicio: this.convertirAHorasEnMinutos("07", "00"),
      fin: this.convertirAHorasEnMinutos("15", "00"),
      texto: "Turno horario: 07:00 - 15:00"
    },
    {
      inicio: this.convertirAHorasEnMinutos("15", "00"),
      fin: this.convertirAHorasEnMinutos("23", "00"),
      texto: "Turno horario: 15:00 - 23:00"
    }
  ];

  horas: string[] = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')); 
  minutos: string[] = ['00', '15', '30', '45'];

  horaInicioHora: string | null = null;
  horaInicioMinuto: string | null = null;
  horaFinHora: string | null = null;
  horaFinMinuto: string | null = null;

  showDeleteModalTurn: boolean = false;
  turnoAEliminar: number | null = null;  // Añade esta propiedad aquí


  addTurnoHorario() {
    if (!this.horaInicioHora || !this.horaInicioMinuto || !this.horaFinHora || !this.horaFinMinuto) {
      alert("Por favor, selecciona tanto la hora de inicio como la de fin.");
      return;
    }

    const inicio = this.convertirAHorasEnMinutos(this.horaInicioHora, this.horaInicioMinuto);
    const fin = this.convertirAHorasEnMinutos(this.horaFinHora, this.horaFinMinuto);

    if (this.haySuperposicion(inicio, fin)) {
      alert("El turno se superpone con otro existente. Por favor, elige otro intervalo.");
      return;
    }

    // Agregar el turno si no hay superposición
    const textoTurno = `Turno horario: ${this.horaInicioHora}:${this.horaInicioMinuto} - ${this.horaFinHora}:${this.horaFinMinuto}`;
    this.turnosHorarios.push({ inicio, fin, texto: textoTurno });

    // Reiniciar las selecciones
    this.horaInicioHora = null;
    this.horaInicioMinuto = null;
    this.horaFinHora = null;
    this.horaFinMinuto = null;
  }

  // Función para convertir horas y minutos en minutos desde el inicio del día
  convertirAHorasEnMinutos(hora: string, minuto: string): number {
    return parseInt(hora, 10) * 60 + parseInt(minuto, 10);
  }

  // Función para verificar superposición de turnos
  haySuperposicion(inicio: number, fin: number): boolean {
    return this.turnosHorarios.some(turno => 
      (inicio >= turno.inicio && inicio < turno.fin) || // comprobar empezar turno existente
      (fin > turno.inicio && fin <= turno.fin) || // comprobar terminar turno existenes
      (inicio <= turno.inicio && fin >= turno.fin) // comprobar envolver completamente turno existenes
    );
  }


  removeTurnoHorario(index: number) {
    if (confirm(`¿Estás seguro de que quieres eliminar el turno: ${this.turnosHorarios[index].texto}?`)) {
      this.turnosHorarios.splice(index, 1);
    }
  }



  // Método para abrir el modal de confirmación
  openDeleteModal(index: number) {
    this.showDeleteModalTurn = true;
    this.turnoAEliminar = index;
  }


  // Confirmar eliminación del turno
  confirmDeleteTurn() {
    if (this.turnoAEliminar !== null) {
      this.turnosHorarios.splice(this.turnoAEliminar, 1);
      this.turnoAEliminar = null;
    }
    this.showDeleteModalTurn = false;
  }

  // Cancelar eliminación
  cancelDeleteTurn() {
    this.turnoAEliminar = null;
    this.showDeleteModalTurn = false;
  }

}

