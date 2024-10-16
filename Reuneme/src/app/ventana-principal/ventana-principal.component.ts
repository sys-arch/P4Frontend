import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-ventana-principal',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Asegúrate de agregar FormsModule aquí
  templateUrl: './ventana-principal.component.html',
  styleUrls: ['./ventana-principal.component.css']
})
export class VentanaPrincipalComponent {
  titulo: string = 'Bienvenido a la Ventana Principal';
  isAdmin: boolean = true;  // Cambia esto en base a tu lógica de autenticación

  searchBy: string = 'name';  // Campo de búsqueda predeterminado
  searchQuery: string = '';   // Consulta de búsqueda
  filterBy: string = 'all';   // Filtro predeterminado (todos los usuarios)

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
  
  toggleBlocked(user: any): void {
    if (user.estado === 'Bloqueado') {
      user.estado = 'Validado'; // O cualquier estado que represente que está desbloqueado
    } else {
      user.estado = 'Bloqueado';
    }
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
  

  constructor() {}

  ngOnInit(): void {
    // Aquí puedes definir si es administrador o no (puedes usar un servicio)
  }
}
