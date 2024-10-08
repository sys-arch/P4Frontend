import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component"; // Importar CommonModule para ngIf

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  imports: [CommonModule, LoaderComponent] // Agregar CommonModule aquí
 // Agregar CommonModule aquí
})
export class LandingPageComponent {
  isLoading: boolean = false;  // Control de pantalla de carga

  constructor(private router: Router) { }

  // Método para simular carga y navegar a la página de login
  goToLogin() {
    this.isLoading = true;
    setTimeout(() => {
      this.router.navigate(['/login']);
      this.isLoading = false;
    }, 1500);
  }

  // Método para simular carga y navegar a la página de registro
  goToRegistro() {
    this.isLoading = true;
    setTimeout(() => {
      this.router.navigate(['/registro']);
      this.isLoading = false;
    }, 1500);
  }
}
