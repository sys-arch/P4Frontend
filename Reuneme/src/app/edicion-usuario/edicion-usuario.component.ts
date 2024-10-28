import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component'; // Importa FooterComponent

@Component({
  selector: 'app-edicion-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent], // Agrega FooterComponent aquí
  templateUrl: './edicion-usuario.component.html',
  styleUrls: ['./edicion-usuario.component.css'],
})
export class EdicionUsuarioComponent implements OnInit {
  userForm!: FormGroup;
  userEmail: string = '';
  isAdmin: boolean = false;
  loggedUserEmail: string = '';
  token: string = ''; // Token para autenticación
  passwordFieldType: string = 'password'; // Inicialmente, la contraseña está oculta
  profilePicture: string | ArrayBuffer | null = null; // Nueva propiedad para la imagen de perfil

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userEmail = this.route.snapshot.paramMap.get('email') || '';
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.token = navigation.extras.state['token'];
      this.isAdmin = this.token.startsWith('a-');
      this.loggedUserEmail = this.token.substring(2);
    }

    this.initializeForm();
    this.loadUserData();
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  initializeForm(): void {
    if (this.isAdmin) {
      this.userForm = this.formBuilder.group({
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        departamento: ['', Validators.required],
        centroTrabajo: ['', Validators.required],
        alta: ['', Validators.required],
        perfil: ['', Validators.required],
        password: [''],
      });
    } else {
      this.userForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
      });
    }
  }

  loadUserData(): void {
    if (this.isAdmin || this.userEmail === this.loggedUserEmail) {
      this.userService.getUserInfo(this.userEmail, this.token).subscribe(
        (data) => {
          if (this.isAdmin) {
            this.userForm.patchValue(data);
            this.profilePicture = data.profilePicture || 'assets/UsuarioSinFoto.png';
          }
        },
        (error) => {
          console.error('Error al cargar los datos del usuario:', error);
          this.router.navigate(['/ventana-principal']);
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
            this.userService.updateUserByEmail(this.userEmail, this.userForm.value, this.token).subscribe(
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
            this.userService.updateUserByEmail(this.userEmail, passwordUpdate, this.token).subscribe(
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

