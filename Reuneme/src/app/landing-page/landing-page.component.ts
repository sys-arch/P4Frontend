import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../shared/loader/loader.component"; // Importar CommonModule para ngIf

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

  // Método para redirigir a las diferentes páginas
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}
