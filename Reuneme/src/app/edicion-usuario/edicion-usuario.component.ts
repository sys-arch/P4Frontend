import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edicion-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-usuario.component.html',
  styleUrls: ['./edicion-usuario.component.css'],
})
export class EdicionUsuarioComponent implements OnInit {
  userForm!: FormGroup; // FormGroup para manejar el formulario
  userEmail: string = ''; // Email del usuario a editar
  isAdmin: boolean = false; // Identificar si el usuario logueado es administrador
  loggedUserEmail: string = ''; // Email del usuario logueado

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el email del usuario a editar desde los parámetros de la ruta
    this.userEmail = this.route.snapshot.paramMap.get('email') || '';
    // Obtener el email del usuario logueado y determinar si es administrador
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const token = navigation.extras.state['token'];
      this.isAdmin = token.startsWith('a-');
      this.loggedUserEmail = token.substring(2);
    }

    // Inicializar el formulario con campos diferentes según el rol
    this.initializeForm();

    // Cargar datos del usuario a editar
    this.loadUserData();
  }

  initializeForm(): void {
    if (this.isAdmin) {
      // Administrador puede editar todos los campos
      this.userForm = this.formBuilder.group({
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        departamento: ['', Validators.required],
        centroTrabajo: ['', Validators.required],
        alta: ['', Validators.required],
        perfil: ['', Validators.required],
        password: [''], // Contraseña no requerida para el administrador
      });
    } else {
      // Usuario estándar solo puede cambiar su propia contraseña
      this.userForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
      });
    }
  }

  loadUserData(): void {
    // Solo cargar datos si es administrador o si el usuario logueado está editando su propia cuenta
    if (this.isAdmin || this.userEmail === this.loggedUserEmail) {
      this.userService.getUserByEmail(this.userEmail).subscribe(
        (data) => {
          // Rellenar el formulario con los datos del usuario si es administrador
          if (this.isAdmin) {
            this.userForm.patchValue(data);
          }
        },
        (error) => {
          console.error('Error al cargar los datos del usuario:', error);
        }
      );
    } else {
      console.error('No tiene permiso para editar este usuario');
      this.router.navigate(['/ventana-principal']);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      if (this.isAdmin) {
        // Administrador actualiza todos los datos del usuario
        this.userService.updateUserByEmail(this.userEmail, this.userForm.value).subscribe(
          (response) => {
            console.log('Usuario actualizado:', response);
            this.router.navigate(['/ventana-principal']); // Redirigir después de actualizar
          },
          (error) => {
            console.error('Error al actualizar el usuario:', error);
          }
        );
      } else {
        // Usuario estándar solo actualiza la contraseña
        const passwordUpdate = { password: this.userForm.get('password')?.value };
        this.userService.updateUserByEmail(this.userEmail, passwordUpdate).subscribe(
          (response) => {
            console.log('Contraseña actualizada:', response);
            this.router.navigate(['/perfil-usuario']); // Redirigir a la página de perfil del usuario
          },
          (error) => {
            console.error('Error al actualizar la contraseña:', error);
          }
        );
      }
    } else {
      console.error('Formulario no válido');
    }
  }

  navigateToUserList(): void {
    this.router.navigate(['/ventana-principal']);
  }
}