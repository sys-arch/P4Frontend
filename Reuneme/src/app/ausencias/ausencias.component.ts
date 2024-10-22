import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ausencias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ausencias.component.html',
  styleUrls: ['./ausencias.component.css']
})
export class AusenciasComponent {
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  motivo: string = '';
  usuario: string = '';//el nombre del usuario y comprobar que existe en la lista de usuarios 

  ausencias = [
    {
      fechaInicio: '01/01/2024',
      fechaFin: '01/02/2024',
      motivo: 'Vacaciones',
      usuario: 'Aaron Smith'
    },
    {
      fechaInicio: '01/03/2022',
      fechaFin: '01/04/2022',
      motivo: 'Enfermedad',
      usuario: 'Maria González'
    },
  ];

  toggleDelete(ausencia: any) {
    const index = this.ausencias.indexOf(ausencia);
    if (index > -1) {
      this.ausencias.splice(index, 1); // Elimina la ausencia seleccionada
    }
  }
}
