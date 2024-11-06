import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from "../loader/loader.component";
import { UserService } from '../services/user.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
@Component({
  selector: 'app-crear-reuniones',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, FooterComponent, HeaderComponent],
  templateUrl: './crear-reuniones.component.html',
  styleUrl: './crear-reuniones.component.css'
})
export class CrearReunionesComponent{
  isLoading: boolean=false;
  asunto: string = '';
  fecha: string = '';
  todoElDia: boolean = false;
  horaDesde: string = '';
  horaHasta: string = '';
  ubicacion: string = '';
  observaciones: string = '';
  
  fechaInvalid = false;
  horasInvalid = false;
  errorMessage: string = '';


  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}
  

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
      return; 
    }

    this.userService.crearReunion(this.asunto, this.fecha,this.todoElDia, this.horaDesde,
              this.horaHasta, this.ubicacion, this.observaciones)
      .subscribe({
        next: (response) => {
          console.log('Reunión creada con éxito:', response);
          this.navigateTo('/');
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
