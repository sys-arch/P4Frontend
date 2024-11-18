import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReunionService } from '../services/reunion.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { LoaderComponent } from "../shared/loader/loader.component";


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

  reunionData: any = {};
  token: string = '';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly reunionService: ReunionService
  ) {}

  ngOnInit(): void {
    
    const reunionId = this.route.snapshot.paramMap.get('id');
    if (reunionId) {
      this.getReunion(reunionId);
    } else {
      console.error('ID de reunión no proporcionado');
    }
  }


getReunion (reunionId: string): void {
  this.reunionService.getReunionById(reunionId).subscribe({
    next: (response) => {
      console.log('Reunión obtenida:', response);
      this.reunionData = response; // Asignar todos los datos obtenidos
      this.organizador = response.organizador?.email || '';
      this.fecha = this.formatDate(response.inicio);
      this.inicio = this.formatTime(response.inicio);
      this.fin = this.formatTime(response.fin);

    },
    error: (error) => {
      console.error('Error al obtener la reunion', error);
    }
  })
}

editReunion(): void {
  console.log('Reunión a modificar:', this.reunionData);
  this.router.navigate(['/modificar-reuniones', this.reunionData.id]);
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
  this.reunionService.cerrarReunion(this.reunionData.id).subscribe({
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
