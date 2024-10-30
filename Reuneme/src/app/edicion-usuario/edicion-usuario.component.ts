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

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.user = history.state['user'];
    this.token = localStorage.getItem('token') || '';

    // Determinar si el usuario es administrador
    if (this.token.startsWith('a-')) {
      this.isAdmin = true;
    } else if (this.token.startsWith('e-')) {
      this.isAdmin = false;
    } else {
      console.error('Token no válido');
      this.router.navigate(['/login']);
      return;
    }

    // Verificar permisos de edición
    if (this.isAdmin && this.user.email.startsWith('a-') && this.user.email !== this.loggedUserEmail) {
      console.error('No tiene permiso para editar este usuario');
      this.router.navigate(['/ventana-principal']);
      return;
    }

    this.initializeForm();
    this.loadUserData();
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
      ...(this.isAdmin ? { 
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

    const getUserData = this.isAdmin  
        ? this.userService.verDatosAdmin(this.user.email) 
        : this.userService.verDatosEmpleado(this.user.email);
    
    getUserData.subscribe(
      (data) => {
        this.isLoading = false;

        if (data) {
          if (this.isAdmin) {
            this.userForm.patchValue({
              nombre: data.nombre,
              apellidos: `${data.apellido1} ${data.apellido2}`,
              correo: data.email,  // Sobrescribe el campo correo con el valor obtenido de los datos
              centroTrabajo: data.centro,
              interno: data.interno
            });
          } else {
            this.userForm.patchValue({
              nombre: data.nombre,
              apellidos: `${data.apellido1} ${data.apellido2}`,
              correo: data.email,  // Sobrescribe el campo correo con el valor obtenido de los datos
              centroTrabajo: data.centro,
              departamento: data.departamento,
              fechaAlta: data.fechaalta,
              perfil: data.perfil
            });
          }
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

      const updateData = this.isAdmin && this.user.email !== this.loggedUserEmail 
                         ? { ...this.userForm.value, password: undefined } 
                         : this.isAdmin 
                         ? this.userForm.value 
                         : { password: this.userForm.get('password')?.value };

      this.userService.updateUserByEmail(this.user.email, updateData, `Bearer ${this.token}`).subscribe(
        (response) => {
          console.log('Usuario actualizado:', response);
          this.isLoading = false;

          if (this.isAdmin) {
            this.router.navigate(['/ventana-principal']);
          } else {
            this.router.navigate(['/perfil-usuario']);
          }
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
          this.isLoading = false;
        }
      );
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
    this.userService.forgotPassword(this.user.email).subscribe(
      {
        next: (response: string) => {
          this.isLoading = false;
          console.log('Respuesta recibida: ', response);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error generando el token: ', error);
        }
      }
    );
  }  
}
