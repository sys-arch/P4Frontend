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
}
