import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { Router } from '@angular/router'; // Importa Router para recibir el token

@Component({
  selector: 'app-ventana-principal',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Asegúrate de agregar FormsModule aquí
  templateUrl: './ventana-principal.component.html',
  styleUrls: ['./ventana-principal.component.css']
})
export class VentanaPrincipalComponent implements OnInit {
  titulo: string = 'Bienvenido a la Ventana Principal';
  isAdmin: boolean = true;  // Cambia según el prefijo del token
  token: string = '';  // Variable para almacenar el token recibido

  searchBy: string = 'name';  // Campo de búsqueda predeterminado
  searchQuery: string = '';   // Consulta de búsqueda
  filterBy: string = 'all';   // Filtro predeterminado (todos los usuarios)

  selectedUser: any = null;  // Usuario seleccionado
  showBlockModal: boolean = false;  // Mostrar/ocultar modal de confirmación
  showValiModal:boolean =false;
  showDeleteModal: boolean = false;  // Controla la visibilidad del modal de eliminación
  countdown: number = 5;  // Cuenta regresiva de 5 segundos
  countdownInterval: any;  // Intervalo para el temporizador

  // Usuario logueado (temporal hasta obtener datos de la base de datos)
  loggedUser: any = {
    firstName: 'John',
    lastName: 'Doe',
    profilePicture: '/assets/images/UsuarioSinFoto.png',
    role: 'admin'  // Podría ser 'owner', 'admin', o 'user'
  };


  // Lista de usuarios de prueba con todos los campos requeridos, incluyendo 'profilePicture'
  users = [
    {
      firstName: 'Aaron',
      lastName: 'Smith',
      email: 'aaron.smith@example.com',
      department: '',
      center: 'Centro Norte',
      joiningDate: '',
      jobTitle: 'Administrador',
      isAdmin: true,
      profilePicture: 'assets/images/test-perfil1.jpg',
      estado: 'Validado'
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
  goToPerfilAdmin(){
    this.router.navigate(['/perfil-admin']);
  }
  goToRegistroAdmin(){
    this.router.navigate(['/registro-admin']);
  }

  ngOnInit(): void {
    // Acceder al token desde el estado del Router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.token = navigation.extras.state['token'];
      console.log('Token recibido:', this.token);  // Imprimir el token para verificar

      // Verificar el prefijo del token para determinar si es administrador o usuario
      if (this.token.startsWith('a-')) {
        this.isAdmin = true;
        console.log('Vista de Administrador');
      } else if (this.token.startsWith('e-')) {
        this.isAdmin = false;
        console.log('Vista de Usuario');
      }
    }
  }

  // Método para mostrar el modal de eliminación y empezar la cuenta regresiva
  toggleDelete(user: any): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
    this.countdown = 5;  // Restablece la cuenta regresiva

    this.startCountdown();
  }

  // Inicia la cuenta regresiva
  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.countdownInterval);  // Detener el intervalo cuando llegue a 0
      }
    }, 1000);
  }

  // Confirmar eliminación del usuario
  confirmDelete(): void {
    console.log('Usuario eliminado:', this.selectedUser);
    this.users = this.users.filter(user => user !== this.selectedUser);  // Eliminar el usuario de la lista
    this.showDeleteModal = false;
    this.selectedUser = null;
    clearInterval(this.countdownInterval);  // Limpiar el intervalo si no se ha eliminado
  }

  // Cancelar la acción de eliminar
  cancelDelete(): void {
    console.log('Eliminación cancelada');
    this.selectedUser = null;
    this.showDeleteModal = false;
    clearInterval(this.countdownInterval);  // Limpiar el intervalo
  }

  toggleBlocked(user: any): void {
    console.log('Usuario seleccionado para bloquear:', user);
    if (user.estado === 'Bloqueado') {
      // Si el usuario está bloqueado, lo desbloqueas directamente.
      user.estado = 'Validado'; 
    } else {
      // Si no está bloqueado, muestras el modal para confirmación.
      this.selectedUser = user;
      this.showBlockModal = true;
      console.log('Modal activado, usuario a bloquear:', this.selectedUser);
    }
  }
  
  confirmBlock(): void {
      console.log('Confirmación de bloqueo para:', this.selectedUser);
      if (this.selectedUser) {
          this.selectedUser.estado = 'Bloqueado';
          this.showBlockModal = false;
          this.selectedUser = null;
      }
  }

  cancelBlock(): void {
      console.log('Bloqueo cancelado');
      this.selectedUser = null;
      this.showBlockModal = false;
  }


  toggleValidation(user: any): void {
    if (user.estado === 'No validado') {
      this.selectedUser = user;
      this.showValiModal = true;  // Muestra el modal de confirmación
    }
  }

  confirmValidation(): void {
    if (this.selectedUser) {
      this.selectedUser.estado = 'Validado';  // Cambia el estado a 'Validado'
      console.log(`Usuario validado: ${this.selectedUser.firstName} ${this.selectedUser.lastName}`);
      this.showValiModal = false;  // Cierra el modal
      this.selectedUser = null;  // Limpia la selección
    }
  }

  cancelValidation(): void {
    this.selectedUser = null;
    this.showValiModal = false;
}

  // Método para filtrar usuarios según la búsqueda y el tipo (admin o usuario)
  filteredUsers() {
    return this.users
      .filter(user => {
        // Filtrado por rol (administrador o empleado)
        if (this.filterBy === 'admin' && !user.isAdmin) return false;
        if (this.filterBy === 'employee' && user.isAdmin) return false;
  
        // Filtrado por estado (bloqueado, validado, no validado)
        if (this.filterBy === 'blocked' && user.estado !== 'Bloqueado') return false;
        if (this.filterBy === 'validated' && user.estado !== 'Validado') return false;
        if (this.filterBy === 'notValidated' && user.estado !== 'No validado') return false;
  
        return true;
      })
      .filter(user => {
        // Filtrado por campo de búsqueda
        const searchQueryLower = this.searchQuery.toLowerCase();
        if (this.searchBy === 'name') {
          return user.firstName.toLowerCase().includes(searchQueryLower);
        } else if (this.searchBy === 'email') {
          return user.email.toLowerCase().includes(searchQueryLower);
        } else if (this.searchBy === 'department') {
          return user.department.toLowerCase().includes(searchQueryLower);
        }
        return false;
      });
  }
}