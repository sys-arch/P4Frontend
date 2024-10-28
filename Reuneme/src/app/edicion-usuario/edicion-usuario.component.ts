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
  userEmail: string = '';
  isAdmin: boolean = false;
  loggedUserEmail: string = '';
  token: string = ''; 
  passwordFieldType: string = 'password';
  profilePicture: string | ArrayBuffer | null = null;
  isLoading: boolean = false;
  showNewPWModal: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.loggedUserEmail = localStorage.getItem('email') || '';

    if (this.token.startsWith('a-')) {
      this.isAdmin = true;
    } else if (this.token.startsWith('e-')) {
      this.isAdmin = false;
    } else {
      console.error('Token no válido');
      this.router.navigate(['/login']);
      return;
    }

    this.userEmail = this.route.snapshot.paramMap.get('email') || '';

    if (!this.isAdmin && this.userEmail !== this.loggedUserEmail) {
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
    this.isLoading = true;

    if (this.isAdmin || this.userEmail === this.loggedUserEmail) {
      this.userService.getUserInfo(this.userEmail, this.token).subscribe(
        (data) => {
          this.isLoading = false;

          if (data) {
            this.userForm.patchValue({
              nombre: data.nombre,
              apellidos: `${data.apellido1} ${data.apellido2}`,
              correo: data.email,
              departamento: data.departamento,
              centroTrabajo: data.centro,
              alta: data.fechaalta,
              perfil: data.perfil,
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
    } else {
      console.error('No tiene permiso para editar este usuario');
      this.router.navigate(['/ventana-principal']);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true; // Muestra el indicador de carga
  
      // Define los datos que se enviarán según el rol del usuario
      const updateData = this.isAdmin ? this.userForm.value : { password: this.userForm.get('password')?.value };
  
      // Llama al servicio para actualizar los datos del usuario en el backend
      this.userService.updateUserByEmail(this.userEmail, updateData, this.token).subscribe(
        (response) => {
          console.log('Usuario actualizado:', response);
          this.isLoading = false; // Oculta el indicador de carga
  
          // Redirige después de guardar según el rol
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
      console.error('Formulario no válido');
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
    this.userService.forgotPassword(this.userEmail).subscribe({
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
}
