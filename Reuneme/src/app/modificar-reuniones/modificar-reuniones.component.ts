import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderComponent } from "../loader/loader.component";
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { ReunionService } from '../services/reunion.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-modificar-reuniones',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, FooterComponent, HeaderComponent],
  templateUrl: './modificar-reuniones.component.html',
  styleUrls: ['./modificar-reuniones.component.css']
})
export class ModificarReunionesComponent implements OnInit {
  isLoading: boolean = false;
  reunionId: string = '';  // ID de la reunión que se va a modificar
  asunto: string = '';
  fecha: string = '';
  todoElDia: boolean = false;
  horaDesde: string = '';
  horaHasta: string = '';
  ubicacion: string = '';
  observaciones: string = '';
  idUsuario: string = '';  // ID del asistente a añadir
  asistentes: string[] = [];  // Lista de IDs de los asistentes
  usuarios: any[] = [];  // Lista de usuarios
  fechaInvalid = false;
  horasInvalid = false;
  errorMessage: string = '';
  token: string = ''; 

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly reunionService: ReunionService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.reunionId = this.route.snapshot.paramMap.get('id') || '';  // Obtener el ID de la reunión desde la URL

    if (this.reunionId) {
      this.getReunionDetails();
    }

    // // Cargar todos los usuarios
    // this.getAllUsers();
  }

  // Obtener los detalles de la reunión a editar
  getReunionDetails(): void {
    this.isLoading = true;
    this.reunionService.getReunionById(this.reunionId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        const reunion = response.data;
        this.asunto = reunion.asunto;
        this.fecha = reunion.fecha;
        this.todoElDia = reunion.todoElDia;
        this.horaDesde = reunion.horaDesde;
        this.horaHasta = reunion.horaHasta;
        this.ubicacion = reunion.ubicacion;
        this.observaciones = reunion.observaciones;
        this.asistentes = reunion.asistentes || [];
        
        // Marcar como asistentes los usuarios correspondientes
        this.usuarios.forEach(usuario => {
          usuario.isAsistente = this.asistentes.includes(usuario.correo);
        });
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error al obtener la reunión:', error);
      }
    });
  }


  
  // // Obtener todos los usuarios
  // getAllUsers(): void {
  //   this.isLoading = true;
  //   this.userService.getAllUsers(this.token).subscribe({
  //     next: (response) => {
  //       this.isLoading = false;
  //       this.usuarios = response;
  //     },
  //     error: (error) => {
  //       this.isLoading = false;
  //       console.error('Error al cargar los usuarios:', error);
  //     }
  //   });
  // }

  // Validación de la fecha
  validateFecha(): void {
    this.fechaInvalid = false;
    const reunion = new Date(this.fecha);
    const fechaActual = new Date();
    if (reunion < fechaActual) {
      this.fechaInvalid = true;
    }
  }

  // Validación de horarios
  validarHorario(): void {
    this.horasInvalid = false;
    if (this.horaDesde && this.horaHasta) {
      const horaDesde = parseInt(this.horaDesde.split(':')[0]);
      const horaHasta = parseInt(this.horaHasta.split(':')[0]);
      if (horaDesde >= horaHasta) {
        this.horasInvalid = true;
      }
    }
  }

  onToggleTodoElDia(): void {
    if (this.todoElDia) {
      this.horaDesde = '';
      this.horaHasta = '';
    }
  }

  // Añadir asistente
  toggleAsistente(usuario: any): void {
    if (usuario.isAsistente) {
      this.asistentes.push(usuario.correo);
    } else {
      const index = this.asistentes.indexOf(usuario.correo);
      if (index !== -1) {
        this.asistentes.splice(index, 1);
      }
    }
  }

  // Enviar la actualización de la reunión
  onSubmit(): void {
    if (this.fechaInvalid) {
      this.errorMessage = 'Fecha inválida. No puede ser una fecha pasada.';
      return;
    }

    if (this.horasInvalid) {
      this.errorMessage = 'Horario inválido. La hora de inicio debe ser menor a la hora de fin y estar entre las 8:00 y 19:00.';
      return;
    }

    // Validar si los campos obligatorios están vacíos
    if (!this.asunto || !this.fecha || (!this.todoElDia && (!this.horaDesde || !this.horaHasta)) || !this.ubicacion) {
      this.errorMessage = 'Todos los campos obligatorios deben estar llenos.';
      return;
    }

    this.reunionService.updateReunion(this.reunionId)
      .subscribe({
        next: (response) => {
          console.log('Reunión actualizada con éxito:', response);
          this.navigateTo('/');
        },
        error: (error) => {
          console.error('Error al actualizar la reunión:', error);
        }
      });
  }

  // Navegar a otra ruta
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}
