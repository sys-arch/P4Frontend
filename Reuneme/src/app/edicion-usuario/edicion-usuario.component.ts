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

    
    if (!this.user || !this.user.email) {
        console.error('Usuario no definido o datos incompletos');
        this.router.navigate(['/ventana-principal']);
        return;
    }
    
    this.token = localStorage.getItem('token') || '';

    if (this.token.startsWith('a-')) {
      this.isAdmin = true;
    } else if (this.token.startsWith('e-')) {
      this.isAdmin = false;
    } else {
      console.error('Token no válido');
      this.router.navigate(['/login']);
      return;
    }


    this.userService.getUserRoleByEmail(this.user, this.token).subscribe(
      (response) => {
        this.role = response.role;
        this.initializeForm();
        this.loadUserData();
      },
      (error) => {
        console.error('Error al verificar el rol del usuario:', error);
        this.router.navigate(['/ventana-principal']);
      }
    );

    if (!this.isAdmin && this.user.email !== this.loggedUserEmail) {
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
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      correo: [{ value: this.user.email, disabled: true }, [Validators.required, Validators.email]],
      centroTrabajo: ['', Validators.required],
      ...(this.role === 'administrador' ? {
        interno: [null],
        password: ['', [Validators.minLength(8)]]
      } : {
        departamento: ['', Validators.required],
        fechaAlta: ['', Validators.required],
        perfil: ['', Validators.required],
        password: ['', [Validators.minLength(8)]]
      })
    });
  }


  loadUserData(): void {
    this.isLoading = true;

    const getUserData = this.role === 'administrador'
      ? this.userService.verDatosAdmin(this.user)
      : this.userService.verDatosEmpleado(this.user);

    getUserData.subscribe(
      (data) => {
        this.isLoading = false;

        if (data) {
          this.userForm.patchValue({
            nombre: data.nombre,
            apellido1: data.apellido1,
            apellido2: data.apellido2,
            correo: data.email,
            centroTrabajo: data.centro,
            ...(this.role === 'administrador' ? {
              interno: data.interno,
              password: data.password
            } : {
              departamento: data.departamento,
              fechaAlta: this.convertToDateString(data.fechaalta),
              perfil: data.perfil,
              password: data.password
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
      const getUserData = this.role === 'administrador'
        ? this.userService.verDatosAdmin(this.user)
        : this.userService.verDatosEmpleado(this.user);

      getUserData.subscribe(
        (existingUser: any) => {
          let updateData: any = {

            ...existingUser,

            nombre: this.userForm.get('nombre')?.value,
            apellido1: this.userForm.get('apellido1')?.value,
            apellido2: this.userForm.get('apellido2')?.value,
            centro: this.userForm.get('centroTrabajo')?.value,
            ...(this.role === 'administrador' ? {
              interno: this.userForm.get('interno')?.value || false
            } : {
              departamento: this.userForm.get('departamento')?.value,
              fechaalta: this.userForm.get('fechaAlta')?.value,
              perfil: this.userForm.get('perfil')?.value
            })
          };


          const updateUser = this.role === 'administrador'
            ? this.userService.updateAdmin(updateData, this.token)
            : this.userService.updateEmpleado(updateData, this.token);

          updateUser.subscribe({
            next: (response: any) => {
              this.isLoading = false;
              this.router.navigate(this.isAdmin ? ['/ventana-principal'] : ['/perfil-usuario']);
            },
            error: (error: any) => {
              this.isLoading = false;
              console.error('Error al actualizar el usuario:', error);
            }
          });
        },
        (error: any) => {
          this.isLoading = false;
          console.error('Error al obtener los datos existentes del usuario:', error);
        }
      );
    } else {
      console.error('Formulario no válido');
      for (const controlName in this.userForm.controls) {
        if (this.userForm.controls[controlName].invalid) {
          console.log(`Control ${controlName} es inválido:`, this.userForm.controls[controlName].errors);
        }
      }
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
