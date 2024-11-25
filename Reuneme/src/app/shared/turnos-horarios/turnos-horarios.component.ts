import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
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
@Injectable({
  providedIn: 'root', // Esto hace que el servicio esté disponible globalmente
})
export class TurnosHorariosComponent implements OnInit {
  isAdmin: boolean = true; // Asume que el usuario es admin para mostrar los botones
  turnosHorarios: TurnosHorarios[] = []; // Lista de turnos horarios acumulados
  horas: string[] = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')); // Rango de horas
  minutos: string[] = ['00', '15', '30', '45']; // Intervalos de minutos
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
    this.cargarTurnos(); // Cargar los turnos iniciales
  }

  // Método para cargar turnos desde el backend
  cargarTurnos(): void {
    this.turnoService.getTodosLosTurnos().subscribe({
      next: (turnos: any[]) => {
        if (turnos.length > 0) {
          // Si hay turnos en la base de datos, deshabilitar los botones
          this.isAddButtonDisabled = true;
          this.isSaveButtonDisabled = true;
        } else {
          // Si no hay turnos, habilitar los botones
          this.isAddButtonDisabled = false;
          this.isSaveButtonDisabled = false;
        }
  
        // Transformar los turnos obtenidos en el formato esperado
        this.turnosHorarios = turnos.map((turno, index) => {
          const [inicioHora, inicioMinuto] = turno.horaInicio.split(':');
          const [finHora, finMinuto] = turno.horaFinal.split(':');
          return {
            inicio: this.convertirAHorasEnMinutos(inicioHora, inicioMinuto),
            fin: this.convertirAHorasEnMinutos(finHora, finMinuto),
            texto: `${index + 1}º Turno: ${inicioHora}:${inicioMinuto} - ${finHora}:${finMinuto}`,
          };
        });
      },
      error: (error) => {
        console.error('Error al cargar los turnos:', error);
      },
    });
  }
  

  // Añadir turno a la lista local
  addTurnoHorario(): void {
    if (!this.horaInicioHora || !this.horaInicioMinuto || !this.horaFinHora || !this.horaFinMinuto) {
      alert('Por favor, selecciona tanto la hora de inicio como la de fin.');
      return;
    }
  
    const inicio = this.convertirAHorasEnMinutos(this.horaInicioHora, this.horaInicioMinuto);
    const fin = this.convertirAHorasEnMinutos(this.horaFinHora, this.horaFinMinuto);
  
    if (inicio >= fin) {
      alert('La hora de inicio debe ser anterior a la hora de fin.');
      return;
    }
  
    // Validar que el nuevo turno no se solape con los existentes
    const solapado = this.turnosHorarios.some(turno => {
      return (
        (inicio >= turno.inicio && inicio < turno.fin) || // Inicio dentro del intervalo existente
        (fin > turno.inicio && fin <= turno.fin) || // Fin dentro del intervalo existente
        (inicio <= turno.inicio && fin >= turno.fin) // El nuevo turno cubre completamente al existente
      );
    });
  
    if (solapado) {
      alert('El turno no puede solaparse con un turno existente.');
      return;
    }
  
    const turno = {
      inicio,
      fin,
      texto: `${this.turnosHorarios.length + 1}º Turno: ${this.horaInicioHora}:${this.horaInicioMinuto} - ${this.horaFinHora}:${this.horaFinMinuto}`,
    };
  
    this.turnosHorarios.push(turno); // Añadir turno a la lista local
    this.resetFormulario(); // Limpiar el formulario
    this.showAddTurnoModal = false; // Cerrar el modal
  }
  

  // Enviar todos los turnos acumulados al backend
  guardarTurnos(): void {
    const turnosBackend = this.turnosHorarios.map((turno) => ({
      horaInicio: `${Math.floor(turno.inicio / 60)
        .toString()
        .padStart(2, '0')}:${(turno.inicio % 60).toString().padStart(2, '0')}:00`,
      horaFinal: `${Math.floor(turno.fin / 60)
        .toString()
        .padStart(2, '0')}:${(turno.fin % 60).toString().padStart(2, '0')}:00`,
    }));

    this.turnoService.addTurnos(turnosBackend).subscribe({
      next: () => {
        alert('Turnos guardados exitosamente.');
        this.cargarTurnos(); // Recargar la lista desde el backend
      },
      error: (error) => console.error('Error al guardar turnos:', error),
    });
  }

  // Convierte horas y minutos en minutos desde el inicio del día
  convertirAHorasEnMinutos(hora: string, minuto: string): number {
    return parseInt(hora, 10) * 60 + parseInt(minuto, 10);
  }

  // Restablece el formulario de selección de horas
  resetFormulario(): void {
    this.horaInicioHora = null;
    this.horaInicioMinuto = null;
    this.horaFinHora = null;
    this.horaFinMinuto = null;
  }

  // Abre el modal de confirmación para añadir turno
  openAddTurnoModal(): void {
    this.showAddTurnoModal = true;
  }

  cancelAddTurnoHorario(): void {
    this.showAddTurnoModal = false;
  }

  // Abre el modal de confirmación para guardar turnos
  openGuardarModal(): void {
    this.showGuardarModal = true;
  }

  confirmGuardarHorarios(): void {
    this.guardarTurnos(); // Guardar los turnos en el backend
    this.showGuardarModal = false; // Cerrar el modal
  }

  cancelGuardarHorarios(): void {
    this.showGuardarModal = false; // Cerrar el modal
  }
}
