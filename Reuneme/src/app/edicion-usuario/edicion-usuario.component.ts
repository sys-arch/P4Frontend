import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GravatarService } from '../services/gravatar.service';
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
  fechaInvalid = false;
  showSaveConfirmationModal: boolean = false; // Controla el modal de confirmación

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private gravatarService: GravatarService
  ) { }

  ngOnInit(): void {
    this.user = history.state['user'];
    this.token = sessionStorage.getItem('token') || '';

    // Manejo para sacar el email del usuario logueado
    if (this.token) {
      try {
        const decodedToken: any = jwtDecode(this.token); // Decodifica el token JWT
        this.loggedUserEmail = decodedToken.email || decodedToken.sub || ''; // Ajusta según el campo presente en tu token
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.loggedUserEmail = ''; // Si ocurre un error, deja el email vacío
      }
    } else {
      console.warn('No se encontró un token en SessionStorage.');
      this.loggedUserEmail = ''; // Manejo en caso de que no haya token
    }

    // Decodificar el token y validar el rol
    const role = this.decodeRoleFromToken(this.token);

    // Obtener el rol antes de inicializar el formulario
    this.userService.getUserRoleByEmail(this.user, this.token).subscribe(
      (response) => {
        this.role = response.role; // Asigna el rol basado en la respuesta del servicio

        // Inicializar el formulario después de obtener el rol
        this.initializeForm();

        // Cargar los datos del usuario después de inicializar el formulario
        this.loadUserData();
      },
      (error) => {
        this.router.navigate(['/ventana-principal']);
      }
    );

  }

  initializeForm(): void {
    this.userForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      correo: [{ value: this.user.email, disabled: true }, [Validators.required, Validators.email]], // Valor inicial del correo
      centro: ['', Validators.required],
      ...(this.role === 'administrador' ? {
        interno: [null], // Campo específico de administrador 
      } : {
        departamento: ['', Validators.required],
        fechaalta: ['', Validators.required],
        perfil: ['', Validators.required],
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
          
          // Aplica los valores al formulario basado en el rol
          this.userForm.patchValue({
            nombre: data.nombre,
            apellido1: data.apellido1,
            apellido2: data.apellido2,
            correo: data.email,
            centro: data.centro,

            ...(this.role === 'administrador' ? {
              interno: data.interno,
            } : {
              departamento: data.departamento,
              fechaalta: this.convertToDateString(data.fechaalta),
              perfil: data.perfil,
            })
          });

          this.profilePicture = this.gravatarService.getGravatarUrl(data.email)
        } else {
          this.router.navigate(['/ventana-principal']);
        }
      },
      (error) => {
        this.isLoading = false;
        this.router.navigate(['/ventana-principal']);
      }
    );
  }

  // Mostrar modal de confirmación
  showSaveModal(): void {
    this.showSaveConfirmationModal = true;
  }

  // Confirmar guardado
  confirmSaveChanges(): void {
    this.showSaveConfirmationModal = false;
    this.onSubmit();
  }

  // Cancelar guardado
  cancelSaveChanges(): void {
    this.showSaveConfirmationModal = false;
  }


  onSubmit(): void {
    this.validateFechaAlta(); // Validar fecha antes de continuar

    if (this.fechaInvalid) {
      alert('La fecha de alta no puede ser mayor a la fecha actual. Por favor, corrige la fecha antes de guardar.'); // Mostrar alerta
      return; // Bloquear el guardado si la fecha es inválida
    }

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

      // Si no hay cambios aparte del email termina
      if (Object.keys(updateData).length === 1) {
        this.isLoading = false;
        return;
      }

      // Llamar al servicio de actualización
      const updateUser = this.role === 'administrador'
        ? this.userService.updateAdmin(updateData)
        : this.userService.updateEmpleado(updateData);

      updateUser.subscribe({
        next: () => {
          this.isLoading = false;

          // Redirección según el contexto
          if (this.user === this.loggedUserEmail) {
            // Si el usuario actualizado es el usuario logueado
            const route = this.role === 'administrador' ? '/perfil-admin' : '/perfil-usuario';

            this.router.navigate([route], {
              queryParams: { email: this.loggedUserEmail }
            }).then((success) => {
              if (success) {
              } else {
                console.error(`La redirección a ${route} falló.`);
              }
            }).catch((err) => {
              console.error(`Error en la redirección a ${route}:`, err);
            });
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
      },
      error: (error) => {
        this.isLoading = false;
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

  // Validación de la fecha de alta debe ser menor o igual a la fecha actual
  validateFechaAlta(): void {
    this.fechaInvalid = false;
    const alta = new Date(this.userForm.get('fechaalta')?.value);
    const fechaActual = new Date();
  
    if (alta > fechaActual) {
      this.fechaInvalid = true;
    }
  }

  // Prevenir darle enter en los campos
  preventEnterKey(event: Event): void {
    if (event instanceof KeyboardEvent && event.key === 'Enter') {
      event.preventDefault(); 
    }
  }
  

}