import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buzon-reuniones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buzon-reuniones.component.html',
  styleUrls: ['./buzon-reuniones.component.css']
})
export class BuzonReunionesComponent {
  showPendingMeetings = false;

  // Lista de reuniones pendientes
  pendingMeetings = [
    { name: 'Reunión de prueba', date: '20-11-2024', time: '10:00 AM' },
    { name: 'Seguimiento del proyecto', date: '4-12-2024', time: '3:00 PM' },
    { name: 'Testing', date: '20-12-2024', time: '2:00 PM' }
  ];

  togglePendingMeetings() {
    this.showPendingMeetings = !this.showPendingMeetings;
  }

  closeMeetingsPanel() {
    this.showPendingMeetings = false;
  }

  acceptMeeting(meeting: any) {
    console.log('Reunión aceptada:', meeting);
    this.removeMeeting(meeting);
  }

  rejectMeeting(meeting: any) {
    console.log('Reunión rechazada:', meeting);
    this.removeMeeting(meeting);
  }

  removeMeeting(meeting: any) {
    this.pendingMeetings = this.pendingMeetings.filter(m => m !== meeting);
  }
}
