import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from "../shared/loader/loader.component";
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { ReunionService } from '../services/reunion.service';


@Component({
  selector: 'app-ver-reuniones',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, FooterComponent, HeaderComponent],
  templateUrl: './ver-reuniones.component.html',
  styleUrl: './ver-reuniones.component.css'
})
export class VerReunionesComponent implements OnInit{

  isLoading: boolean=false;
  organizador: string = '';
  reunionId: string = ''; 
  asunto: string = '';
  fecha: string = '';
  todoElDia: boolean = false;
  inicio: string = '';
  fin: string = '';
  ubicacion: string = '';
  observaciones: string = '';
  estado: string = '';

  reunionData: any;


  constructor(
    private readonly router: Router,
    private readonly reunionService: ReunionService
  ) {}

ngOnInit(): void {
  this.getReunion('1'); // ID de reunion de prueba 
}

getReunion (reunionId: string): void {
  this.reunionService.getReunionById(reunionId).subscribe({
    next: (data) => {
      this.reunionData = data; // Asignar todos los datos obtenidos
      this.organizador = data.organizador?.email || '';
      this.fecha = this.formatDate(data.inicio);
      this.inicio = this.formatTime(data.inicio);
      this.fin = this.formatTime(data.fin);

    },
    error: (error) => {
      console.error('Error al obtener la reunion', error);
    }
  })
}

editReunion(): void {
  this.router.navigate([`/modificar-reuniones`], {
    state : {
      reunionData: this.reunionData,
      organizador: this.organizador,
      reunionId: this.reunionId,
      fecha: this.fecha,
      inicio: this.inicio,
      fin: this.fin
    }
  });
}

// Función para formatear la fecha en formato yyyy-MM-dd
formatDate(dateTime: string): string {
  const date = new Date(dateTime);
    return date.toISOString().split('T')[0]; // yyyy-MM-dd
}

// Función para formatear la hora en formato HH:mm
formatTime(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toTimeString().slice(0, 5); // HH:mm
}

cerrarReunion(): void {
  this.reunionService.cerrarReunion(this.reunionId).subscribe({
    next: (response) => {
      console.log('Reunión cerrada exitosamente:', response);
      alert('La reunión ha sido cerrada');
      this.navigateTo('/ventana-principal');
    },
    error: (error) => {
      console.error('Error al cerrada la reunión:', error);
      alert('Hubo un problema al cerrar la reunión. Intenta nuevamente.');
    }
  });
}

navigateTo(route: string): void {
  this.isLoading = true;
  setTimeout(() => {
    this.isLoading = false;
    this.router.navigate([route]);
  }, 1000);
}

}