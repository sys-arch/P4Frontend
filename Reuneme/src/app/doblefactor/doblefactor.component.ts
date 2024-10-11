import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doblefactor',
  standalone: true,
  imports: [],
  templateUrl: './doblefactor.component.html',
  styleUrl: './doblefactor.component.css'
})
export class DoblefactorComponent {
  isLoading: boolean = false;

  constructor(
    private router: Router
  ) {}
  gotoPerfil(): void {
    this.router.navigate(['/perfil']);
  }
  gotoPerfilUsuario(): void {
    this.router.navigate(['/perfil-usuario']);
  }
  gotoRegistroAdmin(): void {
    this.router.navigate(['/registro-admin']);
  }

}
