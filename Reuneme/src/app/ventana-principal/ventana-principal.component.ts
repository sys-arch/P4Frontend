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
      jobTitle: '',
      isAdmin: true,
      profilePicture: 'assets/images/profile1.jpg'  // Ruta de la foto de perfil
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
      profilePicture: 'assets/images/profile2.jpg'  // Ruta de la foto de perfil
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
      profilePicture: 'assets/images/profile3.jpg'  // Ruta de la foto de perfil
    }
  ];

  // Método para filtrar usuarios según la búsqueda y el tipo (admin o usuario)
  filteredUsers() {
    return this.users
      .filter(user => {
        // Filtrado por rol (administrador o usuario)
        if (this.filterBy === 'admin' && !user.isAdmin) return false;
        if (this.filterBy === 'employee' && user.isAdmin) return false;
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
