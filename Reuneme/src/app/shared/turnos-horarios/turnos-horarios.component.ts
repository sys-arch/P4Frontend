import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface TurnosHorarios {
  inicio: number;
  fin: number;
  texto: string;
}

@Component({
  selector: 'app-turnos-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turnos-horarios.component.html',
  styleUrl: './turnos-horarios.component.css'
})

export class TurnosHorariosComponent {
    isAdmin: boolean = true;


  /*<!-- AÑADIDO NUEVO BORRAR LUEGO-->*/
  turnosHorarios: TurnosHorarios[] = [
    {
      inicio: this.convertirAHorasEnMinutos("07", "00"),
      fin: this.convertirAHorasEnMinutos("15", "00"),
      texto: "Turno horario: 07:00 - 15:00"
    },
    {
      inicio: this.convertirAHorasEnMinutos("15", "00"),
      fin: this.convertirAHorasEnMinutos("23", "00"),
      texto: "Turno horario: 15:00 - 23:00"
   }
  ];

  horas: string[] = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')); 
  minutos: string[] = ['00', '15', '30', '45'];
  horaInicioHora: string | null = null;
  horaInicioMinuto: string | null = null;
  horaFinHora: string | null = null;
  horaFinMinuto: string | null = null;
  showGuardarModal: boolean = false;
  showAddTurnoModal: boolean = false;
  isAddButtonDisabled: boolean = false;
  isSaveButtonDisabled: boolean = false;


  addTurnoHorario() {
    if (!this.horaInicioHora || !this.horaInicioMinuto || !this.horaFinHora || !this.horaFinMinuto) {
      alert("Por favor, selecciona tanto la hora de inicio como la de fin.");
      return;
   }
   const inicio = this.convertirAHorasEnMinutos(this.horaInicioHora, this.horaInicioMinuto);
   const fin = this.convertirAHorasEnMinutos(this.horaFinHora, this.horaFinMinuto);
    if (this.haySuperposicion(inicio, fin)) {
      alert("El turno se superpone con otro existente. Por favor, elige otro intervalo.");
      return;
    }
    // Agregar el turno si no hay superposición
    const textoTurno = `Turno horario: ${this.horaInicioHora}:${this.horaInicioMinuto} - ${this.horaFinHora}:${this.horaFinMinuto}`;
    this.turnosHorarios.push({ inicio, fin, texto: textoTurno });
    // Reiniciar las selecciones
    this.horaInicioHora = null;
    this.horaInicioMinuto = null;
    this.horaFinHora = null;
    this.horaFinMinuto = null;
  }

  // Función para convertir horas y minutos en minutos desde el inicio del día
  convertirAHorasEnMinutos(hora: string, minuto: string): number {
    return parseInt(hora, 10) * 60 + parseInt(minuto, 10);
  }
  // Función para verificar superposición de turnos
  haySuperposicion(inicio: number, fin: number): boolean {
    return this.turnosHorarios.some(turno => 
      (inicio < turno.fin && fin > turno.inicio)
    );
  }

  openGuardarModal() {
    this.showGuardarModal = true;
  }

  confirmGuardarHorarios() {
    // meter aqui la llamada al back para que se guarden
    this.showGuardarModal = false;
    this.isAddButtonDisabled = true;
    this.isSaveButtonDisabled = true;
  }

  cancelGuardarHorarios() {
    this.showGuardarModal = false;
  }
  
  openAddTurnoModal() {
    this.showAddTurnoModal = true;
  }

  confirmAddTurnoHorario() {
    this.addTurnoHorario();
    this.showAddTurnoModal = false;
  }

  cancelAddTurnoHorario() {
    this.showAddTurnoModal = false;
  }


 
}