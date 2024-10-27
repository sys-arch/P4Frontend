import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from "../loader/loader.component";


@Component({
  selector: 'app-ventana-principal',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './ventana-principal.component.html',
  styleUrls: ['./ventana-principal.component.css']
})


export class VentanaPrincipalComponent implements OnInit {
  titulo: string = 'Bienvenido a la Ventana Principal';
  isAdmin: boolean = true;
  token: string = '';
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
    {
      firstName: 'Luis',
      lastName: 'Fernández',
      email: 'luis.fernandez@example.com',
      department: 'Marketing',
      center: 'Centro Este',
      joiningDate: '20/01/2022',
      jobTitle: 'Especialista',
      isAdmin: false,
      profilePicture: 'assets/images/test-perfil1.jpg',
      estado: 'Bloqueado'
    },
    {
      firstName: 'Carlos',
      lastName: 'Martínez',
      email: 'carlos.martinez@example.com',
      department: 'Ventas',
      center: 'Centro Oeste',
      joiningDate: '10/05/2020',
      jobTitle: 'Vendedor',
      isAdmin: false,
      profilePicture: 'assets/images/test-perfil2.jpg',
      estado: 'Validado'
    },
    {
      firstName: 'Elena',
      lastName: 'Ruiz',
      email: 'elena.ruiz@example.com',
      department: 'Recursos Humanos',
      center: 'Centro Norte',
      joiningDate: '25/11/2019',
      jobTitle: 'Gerente de RRHH',
      isAdmin: true,
      profilePicture: 'assets/images/test-perfil1.jpg',
      estado: 'Bloqueado'
    },
    {
      firstName: 'Pedro',
      lastName: 'López',
      email: 'pedro.lopez@example.com',
      department: 'Tecnología',
      center: 'Centro Sur',
      joiningDate: '12/07/2021',
      jobTitle: 'Soporte Técnico',
      isAdmin: false,
      profilePicture: 'assets/images/test-perfil2.jpg',
      estado: 'Validado'
    },
    {
      firstName: 'Ana',
      lastName: 'Hernández',
      email: 'ana.hernandez@example.com',
      department: 'Finanzas',
      center: 'Centro Este',
      joiningDate: '05/09/2020',
      jobTitle: 'Contadora',
      isAdmin: false,
      profilePicture: 'assets/images/test-perfil1.jpg',
      estado: 'No validado'
    },
    {
      firstName: 'David',
      lastName: 'García',
      email: 'david.garcia@example.com',
      department: 'Operaciones',
      center: 'Centro Oeste',
      joiningDate: '01/01/2022',
      jobTitle: 'Gerente de Operaciones',
      isAdmin: true,
      profilePicture: 'assets/images/test-perfil2.jpg',
      estado: 'Validado'
    },
    {
      firstName: 'Sofia',
      lastName: 'Torres',
      email: 'sofia.torres@example.com',
      department: 'Ventas',
      center: 'Centro Norte',
      joiningDate: '15/03/2021',
      jobTitle: 'Ejecutiva de Ventas',
      isAdmin: false,
      profilePicture: 'assets/images/test-perfil1.jpg',
      estado: 'Bloqueado'
    },
    {
      firstName: 'Miguel',
      lastName: 'Ramírez',
      email: 'miguel.ramirez@example.com',
      department: 'Tecnología',
      center: 'Centro Sur',
      joiningDate: '18/12/2019',
      jobTitle: 'Desarrollador',
      isAdmin: false,
      profilePicture: 'assets/images/test-perfil2.jpg',
      estado: 'Validado'
    }
  ];
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.token = navigation.extras.state['token'];
      if (this.token.startsWith('a-')) {
        this.isAdmin = true;
      } else if (this.token.startsWith('e-')) {
        this.isAdmin = false;
      }
    }
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
    this.users = this.users.filter(user => user !== this.selectedUser);
    this.showDeleteModal = false;
    this.selectedUser = null;
    clearInterval(this.countdownInterval);
  }

  cancelDelete(): void {
    this.selectedUser = null;
    this.showDeleteModal = false;
    clearInterval(this.countdownInterval);
  }

  toggleBlocked(user: any): void {
    if (user.estado === 'Bloqueado') {
      user.estado = 'Validado'; 
    } else {
      this.selectedUser = user;
      this.showBlockModal = true;
    }
  }

  confirmBlock(): void {
    if (this.selectedUser) {
      this.selectedUser.estado = 'Bloqueado';
      this.showBlockModal = false;
      this.selectedUser = null;
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
      this.selectedUser.estado = 'Validado';
      this.showValiModal = false;
      this.selectedUser = null;
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

