import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderComponent } from "../loader/loader.component";
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-doblefactor',
  standalone: true,
  templateUrl: './doblefactor.component.html',
  styleUrl: './doblefactor.component.css',
  imports: [CommonModule,LoaderComponent,HeaderComponent, FooterComponent]
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
