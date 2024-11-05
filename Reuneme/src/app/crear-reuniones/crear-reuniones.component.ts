import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class CrearReunionesComponent implements OnInit {
  isLoading: boolean=false;
  asunto: string = '';
  fecha: string = '';
  todoElDia: boolean = false;
  horaDesde: string = '';
  horaHasta: string = '';
  ubicacion: string = '';
  observaciones: string = '';
  estado: string = 'abierta';
  
  ubicaciones = ['Sala 1', 'Sala 2', 'Sala 3', 'Online'];
  fechaInvalid = false;
  errorMessage: string = '';

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}
  ngOnInit(): void {
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

  validarHorario(): boolean {
    const inicioLaboral = '08:00';
    const finLaboral = '18:00';
    return this.horaDesde >= inicioLaboral && this.horaHasta <= finLaboral && this.horaDesde < this.horaHasta;
  }

  onSubmit(): void {

    if (this.fechaInvalid) {
      this.errorMessage = 'Fecha inválida. No puede ser una fecha pasada.';
      return;
    }

    // Validar si los campos obligatorios están vacíos
    if (!this.asunto || !this.estado || !this.fecha || !this.horaDesde || !this.horaHasta || !this.ubicacion) {
      this.errorMessage = 'Todos los campos obligatorios deben estar llenos.';
      return; 
    }

    this.userService.crearReunion(this.asunto, this.fecha,this.todoElDia, this.horaDesde,
              this.horaHasta, this.ubicacion, this.observaciones)
      .subscribe({
        next: (response) => {
          console.log('Reunión creada con éxito:', response);
          this.navigateTo('/calendario');
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
