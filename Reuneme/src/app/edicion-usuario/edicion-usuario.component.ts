import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-edicion-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './edicion-usuario.component.html',
  styleUrls: ['./edicion-usuario.component.css'],
})
export class EdicionUsuarioComponent implements OnInit {
  userForm!: FormGroup;
  isAdmin: boolean = false;
  loggedUserEmail: string = '';
  token: string = '';
  passwordFieldType: string = 'password';
  profilePicture: string | ArrayBuffer | null = null;
  isLoading: boolean = false;
  showNewPWModal: boolean = false;
  user: any;
  role: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.user = history.state['user'];
    this.token = localStorage.getItem('token') || '';
  
    // Verificar this.user
    console.log('Contenido de this.user en ngOnInit:', this.user);
  
    // Determinar si el usuario es administrador o empleado basándose en el token
    if (this.token.startsWith('a-')) {
      this.isAdmin = true;
    } else if (this.token.startsWith('e-')) {
      this.isAdmin = false;
    } else {
      console.error('Token no válido');
      this.router.navigate(['/login']);
      return;
    }
  
    // Obtener el rol antes de inicializar el formulario
    this.userService.getUserRoleByEmail(this.user, this.token).subscribe(
      (response) => {
        this.role = response.role; // Asigna el rol basado en la respuesta del servicio
        console.log('Rol del usuario:', this.role);
  
        // Llama a `initializeForm()` después de definir el rol
        this.initializeForm();
  
        // Cargar los datos del usuario después de inicializar el formulario
        this.loadUserData();
      },
      (error) => {
        console.error('Error al verificar el rol del usuario:', error);
        this.router.navigate(['/ventana-principal']);
      }
    );
  }
  

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  initializeForm(): void {
    this.userForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: [{ value: this.user.email, disabled: true }, [Validators.required, Validators.email]], // Valor inicial del correo
      centroTrabajo: ['', Validators.required],
      ...(this.role === 'administrador' ? {
        interno: [null], // Campo específico de administrador 
        password: this.user.email === this.loggedUserEmail ? [''] : []
      } : {
        departamento: ['', Validators.required],
        fechaAlta: ['', Validators.required],
        perfil: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]]
      })
    });
  }
  

  loadUserData(): void {
    this.isLoading = true;
  
    // Verificar si el email pertenece a un administrador o a un empleado
    const getUserData = this.role === 'administrador'
      ? this.userService.verDatosAdmin(this.user) // Si es administrador, llama a `verDatosAdmin`
      : this.userService.verDatosEmpleado(this.user); // Si es empleado, llama a `verDatosEmpleado`
  
    getUserData.subscribe(
      (data) => {
        this.isLoading = false;
  
        if (data) {
          console.log('Nombre recibido:', data.nombre);

          // Aplica los valores al formulario basado en el rol
          this.userForm.patchValue({
            nombre: data.nombre,
            apellidos: `${data.apellido1} ${data.apellido2}`,
            correo: data.email,
            centroTrabajo: data.centro,
            ...(this.role === 'administrador' ? {
              interno: data.interno
            } : {
              departamento: data.departamento,
              fechaAlta: this.convertToDateString(data.fechaalta),
              perfil: data.perfil
            })
          });
  
          this.profilePicture = data.profilePicture || '/assets/images/UsuarioSinFoto.png';
        } else {
          console.error('Datos del usuario no encontrados');
          this.router.navigate(['/ventana-principal']);
        }
      },
      (error) => {
        console.error('Error al cargar los datos del usuario:', error);
        this.isLoading = false;
        this.router.navigate(['/ventana-principal']);
      }
    );
  }
  
  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
  
      // Prepara los datos para la actualización, excluyendo campos innecesarios
      const updateData = {
        ...this.userForm.getRawValue(), // Obtiene todos los valores, incluidos los deshabilitados
        email: this.user.email,         // Asegura que el email no se modifique
        password: this.userForm.get('password')?.value || undefined
      };
  
      // Llama al método adecuado de UserService según el rol del usuario
      const updateUser = this.role === 'administrador'
        ? this.userService.updateAdmin(updateData, this.token) // Método para actualizar administradores
        : this.userService.updateEmpleado(updateData, this.token); // Método para actualizar empleados
  
      updateUser.subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Usuario actualizado:', response);
          // Navega a la página correspondiente según si es administrador o empleado
          this.router.navigate(this.isAdmin ? ['/ventana-principal'] : ['/perfil-usuario']);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error al actualizar el usuario:', error);
        }
      });
  
    } else {
      console.error('Formulario no válido');
    }
  }
  


  navigateToUserList(): void {
    this.router.navigate(['/ventana-principal']);
  }

  cancel(): void {
    this.showNewPWModal = false;
  }

  showNewModal(): void {
    this.showNewPWModal = true;
  }

  confirmNewP(): void {
    this.showNewPWModal = false;
    this.userService.forgotPassword(this.user?.email || '').subscribe({
      next: (response: string) => {
        this.isLoading = false;
        console.log('Respuesta recibida: ', response);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error generando el token: ', error);
      }
    });
  }

  convertToDateString(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}

}
