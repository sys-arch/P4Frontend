import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { jwtDecode } from 'jwt-decode';

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

    // Manejo para sacar el email del usuario logueado
    if (this.token) {
      try {
        const decodedToken: any = jwtDecode(this.token); // Decodifica el token JWT
        this.loggedUserEmail = decodedToken.email || decodedToken.sub || ''; // Ajusta según el campo presente en tu token
        console.log('Email del usuario logueado:', this.loggedUserEmail);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.loggedUserEmail = ''; // Si ocurre un error, deja el email vacío
      }
    } else {
      console.warn('No se encontró un token en localStorage.');
      this.loggedUserEmail = ''; // Manejo en caso de que no haya token
    }

    console.log('Este es en ngOnit: ' + this.loggedUserEmail)

    // Decodificar el token y validar el rol
    const role = this.decodeRoleFromToken(this.token);

    // Obtener el rol antes de inicializar el formulario
    this.userService.getUserRoleByEmail(this.user, this.token).subscribe(
      (response) => {
        console.log('Método de getUserRole')
        this.role = response.role; // Asigna el rol basado en la respuesta del servicio

        // Inicializar el formulario después de obtener el rol
        this.initializeForm();

        // Cargar los datos del usuario después de inicializar el formulario
        this.loadUserData();
      },
      (error) => {
        console.error('Error al verificar el rol del usuario en el backend:', error);
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
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      correo: [{ value: this.user.email, disabled: true }, [Validators.required, Validators.email]], // Valor inicial del correo
      centroTrabajo: ['', Validators.required],
      ...(this.role === 'administrador' ? {
        interno: [null], // Campo específico de administrador 
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

    // Verificar si el email pertenece a un administrador o a un empleado
    const getUserData = this.role === 'administrador'
      ? this.userService.verDatosAdmin(this.user) // Si es administrador, llama a `verDatosAdmin`
      : this.userService.verDatosEmpleado(this.user); // Si es empleado, llama a `verDatosEmpleado`

    getUserData.subscribe(
      (data) => {
        this.isLoading = false;

        if (data) {
          console.log('Nombre recibido:', data.nombre);
          console.log('Role getuserData: ' + this.role);
          console.log('Email getuserdata: ' + this.user);

          // Aplica los valores al formulario basado en el rol
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

      const updateData: any = {
        email: this.user // Siempre incluir el email
      };

      // Recorrer los campos del formulario para detectar cambios
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        if (control && control.dirty && control.value !== undefined) {
          updateData[key] = control.value; // Solo incluir campos modificados
        }
      });

      // Si no hay cambios aparte del email, terminar el proceso
      if (Object.keys(updateData).length === 1) { // Solo tiene `email`
        this.isLoading = false;
        console.log('No hay cambios para actualizar.');
        return;
      }

      console.log('Datos enviados:', JSON.stringify(updateData, null, 2));

      // Llamar al servicio de actualización
      const updateUser = this.role === 'administrador'
        ? this.userService.updateAdmin(updateData)
        : this.userService.updateEmpleado(updateData);

      updateUser.subscribe({
        next: () => {
          this.isLoading = false;
          console.log('Usuario actualizado correctamente.');

          // Redirección según el contexto
          if (this.user === this.loggedUserEmail) {
            // Si el usuario actualizado es el logueado
            if (this.role === 'administrador') {
              console.log('Redirigiendo al perfil del administrador...');
              this.router.navigateByUrl('/perfil').then((success) => {
                if (success) {
                  console.log('Redirección a /perfil exitosa.');
                } else {
                  console.error('La redirección a /perfil falló.');
                }
              }).catch((err) => {
                console.error('Error en la redirección al perfil del administrador:', err);
              });
            } else {
              // Si es un empleado logueado, redirigir a `perfil-usuario`
              console.log('Redirigiendo al perfil del empleado...');
              this.router.navigate(['/perfil-usuario'], {
                state: {
                  email: this.loggedUserEmail,
                  role: this.role
                }
              }).catch((err) => {
                console.error('Error en la redirección al perfil del usuario:', err);
              });
            }
          } else {
            // Si un administrador actualizó a otro usuario, redirigir a la ventana principal
            this.router.navigate(['/ventana-principal']).catch((err) => {
              console.error('Error en la redirección a la ventana principal:', err);
            });
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error al actualizar el usuario:', error);
        }
      });
    } else {
      console.error('Formulario no válido');
      console.log('Errores en el formulario:', this.userForm.errors);

      // Mostrar errores de los controles individuales
      Object.keys(this.userForm.controls).forEach((controlName) => {
        const control = this.userForm.get(controlName);
        if (control?.invalid) {
          console.log(`Control ${controlName} es inválido:`, control.errors);
        }
      });
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

  // Método para decodificar el role de token
  private decodeRoleFromToken(token: string): string | null {
    try {
      const decodedToken: any = jwtDecode(token);
      const role = decodedToken.role; // Extraer el rol del claim 'role'
      return role; // Devolver el rol decodificado
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null; // Retornar null si ocurre un error
    }
  }

}