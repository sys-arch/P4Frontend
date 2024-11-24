import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReunionService } from '../../services/reunion.service';

@Component({
  selector: 'app-buzon-reuniones',
  standalone: true,
  templateUrl: './buzon-reuniones.component.html',
  styleUrls: ['./buzon-reuniones.component.css'],
  imports: [CommonModule],
})
export class BuzonReunionesComponent implements OnInit {
  showPendingMeetings = false;
  pendingMeetings: any[] = [];

  constructor(private reunionService: ReunionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPendingMeetings();
  }

  loadPendingMeetings() {
    const email = sessionStorage.getItem('email');
    if (!email) {
      console.error('El email no está disponible en sessionStorage.');
      return;
    }

    this.reunionService.getReunionesPendientes(email).subscribe(
      (meetings: any[]) => {
        this.pendingMeetings = meetings.map((meeting) => ({
          idReunion: meeting.id, // ID de la reunión
          idUsuario: meeting.organizador?.id, // ID del usuario organizador
          name: meeting.asunto,
          date: new Date(meeting.inicio).toLocaleDateString(),
          time: `${new Date(meeting.inicio).toLocaleTimeString()} - ${new Date(meeting.fin).toLocaleTimeString()}`,
        }));
        console.log('Reuniones transformadas:', this.pendingMeetings);
      },
      (error: any) => {
        console.error('Error al obtener reuniones pendientes:', error);
      }
    );
  }
  confirmarAsistencia(meeting: any) {
    const email = sessionStorage.getItem('email'); // Correo del usuario autenticado
    if (!email) {
      console.error('El email no está disponible en sessionStorage.');
      return;
    }
  
    // Obtener el asistente antes de confirmar la asistencia
    this.reunionService.getAsistenteByEmail(meeting.idReunion, email).subscribe(
      (asistente) => {
        console.log('ID del asistente obtenido:', asistente.idUsuario);
        this.reunionService
          .actualizarEstadoAsistencia(meeting.idReunion, asistente.idUsuario, 'ACEPTADA')
          .subscribe(
            () => {
              console.log('Asistencia confirmada:', meeting);
              this.removeMeeting(meeting);
            },
            (error: any) => {
              console.error('Error al confirmar asistencia:', error);
            }
          );
      },
      (error: any) => {
        console.error('Error al obtener el asistente:', error);
      }
    );
  }
  
  rechazarAsistencia(meeting: any) {
    const email = sessionStorage.getItem('email'); // Correo del usuario autenticado
    if (!email) {
      console.error('El email no está disponible en sessionStorage.');
      return;
    }
  
    // Obtener el asistente antes de rechazar la asistencia
    this.reunionService.getAsistenteByEmail(meeting.idReunion, email).subscribe(
      (asistente) => {
        console.log('ID del asistente obtenido:', asistente.idUsuario);
        this.reunionService
          .actualizarEstadoAsistencia(meeting.idReunion, asistente.idUsuario, 'RECHAZADA')
          .subscribe(
            () => {
              console.log('Asistencia rechazada:', meeting);
              this.removeMeeting(meeting);
            },
            (error: any) => {
              console.error('Error al rechazar asistencia:', error);
            }
          );
      },
      (error: any) => {
        console.error('Error al obtener el asistente:', error);
      }
    );
  }
  

  removeMeeting(meeting: any) {
    this.pendingMeetings = this.pendingMeetings.filter((m) => m !== meeting);
  }

  togglePendingMeetings() {
    this.showPendingMeetings = !this.showPendingMeetings;
  }

  closeMeetingsPanel() {
    this.router.navigate(['/ventana-principal']);
    this.showPendingMeetings = false;
    
  }
}
