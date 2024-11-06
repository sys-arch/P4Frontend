import { Component } from '@angular/core';
import { ListaUsuariosComponent } from '../lista-usuarios/lista-usuarios.component';
import { AusenciasComponent } from '../ausencias/ausencias.component';
import { TurnosHorariosComponent } from '../turnos-horarios/turnos-horarios.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ListaUsuariosComponent, AusenciasComponent, TurnosHorariosComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export class MenuComponent {
  // Propiedad para rastrear la pestaña actual
  pestanaActual: string = 'usuarios';

  // Método para cambiar de pestaña
  mostrarPestana(pestana: string) {
    this.pestanaActual = pestana;
  }

  // Método para verificar si una pestaña está activa
  isPestanaActiva(pestana: string): boolean {
    return this.pestanaActual === pestana;
  }
}