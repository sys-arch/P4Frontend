import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';

interface TurnosHorarios {
  inicio: number;
  fin: number;
  texto: string;
}
@Component({
  standalone: true,
  selector: 'app-turnos-horarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './turnos-horarios.component.html',
  styleUrls: ['./turnos-horarios.component.css'],
})


export class TurnosHorariosComponent implements OnInit {
  isAdmin: boolean = true;
  turnosHorarios: TurnosHorarios[] = [];
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

  constructor(private turnoService: TurnoService) {}

  ngOnInit(): void {
    this.cargarTurnos();
  }

  // Cargar los turnos desde el backend
  cargarTurnos(): void {
    this.turnoService.getTodosLosTurnos().subscribe({
      next: (turnos: any[]) => {
        this.turnosHorarios = turnos.map((turno, index) => {
          const [inicioHora, inicioMinuto] = turno.horaInicio.split(':');
          const [finHora, finMinuto] = turno.horaFinal.split(':');
          return {
            inicio: this.convertirAHorasEnMinutos(inicioHora, inicioMinuto),
            fin: this.convertirAHorasEnMinutos(finHora, finMinuto),
            texto: `${index + 1}º Turno:                    ${inicioHora}:${inicioMinuto} - ${finHora}:${finMinuto}`,
          };
        });
      },
      error: (error) => {
        console.error('Error al cargar los turnos:', error);
      },
    });
  }
  
  

  // Añadir un nuevo turno al backend
  addTurnoHorario(): void {
    if (!this.horaInicioHora || !this.horaInicioMinuto || !this.horaFinHora || !this.horaFinMinuto) {
      alert('Por favor, selecciona tanto la hora de inicio como la de fin.');
      return;
    }
  
    const turno = {
      horaInicio: `${this.horaInicioHora}:${this.horaInicioMinuto}:00`,
      horaFinal: `${this.horaFinHora}:${this.horaFinMinuto}:00`
    };
  
    this.turnoService.addTurno(turno).subscribe({
      next: () => {
        alert('Turno añadido con éxito');
        this.cargarTurnos(); // Recargar turnos después de añadir uno nuevo
        this.resetFormulario();
      },
      error: (error) => console.error('Error al añadir el turno:', error),
    });
  }
  
  
  
  
  

    

  // Función para convertir horas y minutos en minutos desde el inicio del día
  convertirAHorasEnMinutos(hora: string, minuto: string): number {
    return parseInt(hora, 10) * 60 + parseInt(minuto, 10);
  }

  // Función para verificar superposición de turnos
  haySuperposicion(inicio: number, fin: number): boolean {
    return this.turnosHorarios.some((turno) => inicio < turno.fin && fin > turno.inicio);
  }

  resetFormulario(): void {
    this.horaInicioHora = null;
    this.horaInicioMinuto = null;
    this.horaFinHora = null;
    this.horaFinMinuto = null;
  }

  openGuardarModal(): void {
    this.showGuardarModal = true;
  }

  confirmGuardarHorarios(): void {
    // Guardar horarios en el backend si es necesario
    this.showGuardarModal = false;
    this.isAddButtonDisabled = true;
    this.isSaveButtonDisabled = true;
  }

  cancelGuardarHorarios(): void {
    this.showGuardarModal = false;
  }

  openAddTurnoModal(): void {
    this.showAddTurnoModal = true;
  }

  confirmAddTurnoHorario(): void {
    this.addTurnoHorario();
    this.showAddTurnoModal = false;
  }

  cancelAddTurnoHorario(): void {
    this.showAddTurnoModal = false;
  }
}
