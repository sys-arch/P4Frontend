import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReunionService } from '../services/reunion.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { LoaderComponent } from "../shared/loader/loader.component";

@Component({
  selector: 'app-crear-reuniones',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, FooterComponent, HeaderComponent],
  templateUrl: './crear-reuniones.component.html',
  styleUrl: './crear-reuniones.component.css'
})
export class CrearReunionesComponent implements OnInit {
  isLoading: boolean=false;
  organizador: string = '';
  asunto: string = '';
  fecha: string = '';
  todoElDia: boolean = false;
  horaDesde: string = '';
  horaHasta: string = '';
  ubicacion: string = '';
  observaciones: string = '';
  estado: string = 'ABIERTA'; // Cuando creas reunion siempre esta en estado abierta
  
  fechaInvalid = false;
  horasInvalid = false;
  errorMessage: string = '';
  token: string = '';

  constructor(
    private readonly router: Router,
    private readonly reunionService: ReunionService,
    private readonly authService: AuthService

  ) {}
  
  ngOnInit(): void {
    const fechaSeleccionada = this.reunionService.getFechaSeleccionada();
    if (fechaSeleccionada) {
      this.fecha = fechaSeleccionada
    }
  }

  // Validación de la fecha de la reunión debe ser mayor o igual a la fecha actual
  validateFecha(): void {
    this.fechaInvalid = false;
    const reunion = new Date(this.fecha);
    const fechaActual = new Date();
    if (reunion < fechaActual) {
      this.fechaInvalid = true;
    }
  }

  validarHorario(): void {
    this.horasInvalid = false;
    if (this.horaDesde && this.horaHasta) {
      const horaDesde = parseInt(this.horaDesde.split(':')[0]);
      const horaHasta = parseInt(this.horaHasta.split(':')[0]);
      if (horaDesde >= horaHasta || horaDesde < 8 || horaHasta > 19) {
        this.horasInvalid = true;
      } 
    }
  }


  // Funciones que generan el formato (yyyy-MM-dd HH:mm)
  combinarFechasYHoras(): { inicio: string, fin: string } {
    // Combinar la fecha y hora de inicio
    const inicioFecha = this.combineFechaHora(this.fecha, this.horaDesde);
    const finFecha = this.combineFechaHora(this.fecha, this.horaHasta);

    return { inicio: inicioFecha, fin: finFecha };
  }
  combineFechaHora(fecha: string, hora: string): string {
    if (!fecha || !hora) {
      throw new Error("La fecha o la hora no pueden estar vacías.");
    }
    return `${fecha} ${hora}`; // Combina la fecha y la hora
  }

  onToggleTodoElDia(): void {
    if (this.todoElDia) {
      this.horaDesde = '08:00';
      this.horaHasta = '19:00';
    } else {
      this.horaDesde = '';
      this.horaHasta = '';
    }
  }

  onSubmit(): void {

    this.organizador = this.authService.getEmail();
    const { inicio, fin } = this.combinarFechasYHoras();

    if (this.fechaInvalid) {
      this.errorMessage = 'Fecha inválida. No puede ser una fecha pasada.';
      return;
    }

    if(this.horasInvalid) {
      this.errorMessage = 'Horario inválido. La hora de inicio debe ser menor a la hora de fin y estar entre las 8:00 y 19:00.';
      return;
    }
    // Validar si los campos obligatorios están vacíos
    if (!this.asunto ||
      !this.fecha ||
      (!this.todoElDia && (!this.horaDesde || !this.horaHasta)) ||
      !this.ubicacion) {
      this.errorMessage = 'Todos los campos obligatorios deben estar llenos.';
      alert(this.errorMessage);
      return; 
    }
    console.log("Organizador:", this.organizador);

    this.reunionService.crearReunion(this.organizador,this.asunto, inicio,
      fin, this.ubicacion, this.observaciones, this.estado)
      .subscribe({
        next: (response) => {
          console.log('Reunión creada con éxito:', response);
          this.navigateTo('/reuniones');  
        },
        error: (error) => {
          console.error('Error al crear la reunión:', error);
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
