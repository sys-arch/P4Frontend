import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoaderComponent } from "../loader/loader.component";
import { TwoFactorService } from '../services/twoFactor.service';
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

  constructor(
    private router: Router,
    private twoFactorService: TwoFactorService
  ) {}

  ngOnInit(): void {
    this.email =  localStorage.getItem('email') || '';
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
  closeModal(): void {
    this.isModalOpen = false;
  }
  verificarCodigo(): void {
    if (this.authCode) {
      this.twoFactorService.verificar2FA("luis.fernandez2@ejemplo.com", +this.authCode).subscribe(response => {
        if (response) {
          this.router.navigate(['/ventana-principal']); // Navegar a ventana principal si es correcto
        } else {
          alert("Código incorrecto. Inténtelo de nuevo.");
        }
      });
    } else {
      alert("Por favor, ingrese el código de autenticación.");
    }
  }
}
