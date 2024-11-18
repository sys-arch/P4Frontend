import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GravatarService } from '../../services/gravatar.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent implements OnInit{
  isLoading: boolean = false;
  selectedUser: any = null;
  showBlockModal: boolean = false;
  isAdmin: boolean = true;
  token: string = '';
  showValiModal: boolean = false;
  showDeleteModal: boolean = false;
  countdown: number = 5;
  countdownInterval: any;
  searchBy: string = 'name';
  searchQuery: string = '';
  filterBy: string = 'all';
  myemail: string = '';


  
  loggedUser: any = {
    firstName: 'John',
    lastName: 'Doe',
    profilePicture: '/assets/images/UsuarioSinFoto.png',
    role: 'admin'
  };


  constructor(
    private router: Router,
    private userService: UserService,
    private gravatarService: GravatarService,
    private route: ActivatedRoute
  ) {}




  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
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

toggleValidation(user: any): void {
  if (user.estado === 'No validado') {
    this.selectedUser = user;
    this.showValiModal = true;
  }
}

  // Método para navegar a la vista de edición de usuario
  editUser(user: any): void {
    if (user) {
      this.router.navigate(['/edicion-usuario'], { state: { user } });

    } else {
      console.error('El correo electrónico del usuario no está definido');
    }
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



  confirmValidation(): void {
    if (this.selectedUser) {
    
      this.userService.verifyUserByEmail(this.selectedUser.email, this.token).subscribe(
        () => {
          this.selectedUser.estado = 'Validado';
          this.showValiModal = false;
          this.selectedUser = null;
          this.loadAllUsers(); // Recarga la lista completa de usuarios
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


  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    const localEmail = localStorage.getItem('email') || '';
  
    // Obtener el parámetro 'email' de la URL o usar el email de localStorage
    const routeEmail = this.route.snapshot.paramMap.get('email');
    this.myemail = routeEmail || localEmail;
    this.isAdmin = this.isAdminUser();
  
    // Determina si el usuario es administrador o empleado basado en el prefijo del token
    if (this.isAdmin) {
      this.loggedUser.role = 'admin';
      this.loadAllUsers(); // Cargar todos los usuarios si es administrador
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
  cancelDelete(): void {
   this.selectedUser = null;
    this.showDeleteModal = false;
    clearInterval(this.countdownInterval);
  }

}

