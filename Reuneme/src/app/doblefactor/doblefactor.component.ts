import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoaderComponent } from "../loader/loader.component";
import { TwoFactorService } from '../services/twoFactor.service';
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';


@Component({
  selector: 'app-doblefactor',
  standalone: true,
  templateUrl: './doblefactor.component.html',
  styleUrls: ['./doblefactor.component.css'],
  imports: [CommonModule, LoaderComponent, HeaderComponent, FooterComponent, FormsModule],
})
export class DoblefactorComponent {
  isLoading: boolean = false;
  isModalOpen: boolean = false;
  email: string = '';
  qrCodeUrl: string = '';
  secretKey: string = '';
  authCode: string = '';
  token: string = localStorage.getItem('token') || '';
  loggedUser: any = {
    set2fa: false,
    isAdmin: this.token.startsWith('a-')
  };

  constructor(
    private router: Router,
    private twoFactorService: TwoFactorService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.email =  localStorage.getItem('email') || '';
    
    if (this.loggedUser.isAdmin) {
      this.userService.verDatosAdmin(this.email).subscribe(
        (userInfo: any) => {
          this.loggedUser.set2fa = userInfo.twoFA;
          if (this.loggedUser.set2fa) {
            this.openModal();
          }
        },
        (error) => {
          console.error('Error al obtener la información del administrador:', error);
        }
      );
    
    } else {
      this.userService.verDatosEmpleado(this.email).subscribe(
        (userInfo: any) => {
          this.loggedUser.set2fa = userInfo.twoFA;
          if (this.loggedUser.set2fa) {
            this.openModal();
          }
        },
        (error) => {
          console.error('Error al obtener la información del empleado:', error);
        }
      );
    }
  
  }

  // Método para redirigir a las diferentes páginas
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 500);
  }

  // Método para abrir el modal
  openModal(): void {
    this.isModalOpen = true;

    // Activa el 2FA y obtiene la clave secreta
    this.twoFactorService.activar2FA(this.email).subscribe(response => {
      this.secretKey = response; // Almacena la clave secreta

      // Genera el código QR con la clave secreta y el email
      this.twoFactorService.generateQRCode(this.secretKey, this.email).subscribe(qrUrl => {
        this.qrCodeUrl = qrUrl; // Asigna la URL del QR para mostrar en el modal
      });
    });
  }

  // Método para cerrar el modal
  verificarCodigo(): void {
    console.log('Código verificado:', this.authCode)
    if (this.authCode) {
      this.twoFactorService.verificar2FA(this.email, +this.authCode).subscribe(response => {
        if (response) {
          const updateData = { email: this.email, clavesecreta: this.secretKey, twoFA: false }; // Cambiamos twoFA a false tras verificar

          if (this.loggedUser.isAdmin) {
            this.userService.updateAdmin(updateData).subscribe(
              () => {},
              (error) => console.error('Error al actualizar el administrador:', error)
            );
          } else {
            this.userService.updateEmpleado(updateData).subscribe(
              () => {},
              (error) => console.error('Error al actualizar el empleado:', error)
            );
          }
          this.router.navigate(['/ventana-principal']);
        }else {
          alert("Código incorrecto. Inténtelo de nuevo.");
        }
      
      });
    } else {
      alert("Por favor, ingrese el código de autenticación.");
    }
  }
}
