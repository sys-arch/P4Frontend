import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderComponent } from "../loader/loader.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doblefactor',
  standalone: true,
  templateUrl: './doblefactor.component.html',
  styleUrl: './doblefactor.component.css',
  imports: [CommonModule,LoaderComponent]
})
export class DoblefactorComponent {
  isLoading: boolean = false;

  constructor(
    private router: Router
  ) {}

  // Método para redirigir a las diferentes páginas
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 500);
  }

}
