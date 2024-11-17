import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderComponent } from "../shared/loader/loader.component";
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
  organizador: string = '';  // Correo del organizador
  asunto: string = '';
  fecha: string = '';
  todoElDia: boolean = false;
  inicio: string = '';
  fin: string = '';
  ubicacion: string = '';
  observaciones: string = '';
  estado: string = '';

  idUsuario: string = '';  // ID del asistente a añadir

  asistentes: string[] = [];  // Lista de IDs de los asistentes
  usuarios: any[] = [];  // Lista de usuarios

  fechaInvalid = false;
  horasInvalid = false;
  errorMessage: string = '';

  searchQuery: string = '';  // Búsqueda de usuarios
  filteredUsers: any[] = [];  // Lista de usuarios filtrados

  reunionData: any;
  

  constructor(
    private readonly router: Router,
    private readonly reunionService: ReunionService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { 
      reunionId: string ,
      reunionData: any,
      organizador: string,
      fecha: string,
      inicio: string,
      fin: string,
    };

    if(state){
      const { reunionData, organizador, reunionId, fecha, inicio, fin } = state;
      this.organizador = organizador || '';
      this.reunionId = reunionId || '';
      this.fecha = fecha || '';
      this.inicio = inicio || '';
      this.fin = fin || '';
      if (reunionData) {
        this.asunto = reunionData.asunto;
        this.ubicacion = reunionData.ubicacion;
        this.estado = reunionData.estado;
        this.observaciones = reunionData.observaciones;
        this.todoElDia = reunionData.todoElDia || false;
      }
    }
  }

  ngOnInit(): void {

    this.getReunion("1"); // ID de reunión de prueba

  }

  getReunion(reunionId: string): void {
    this.reunionService.getReunionById(this.reunionId).subscribe({
      next: (data) => {
        this.reunionData = data;
        console.log('Datos de la reunión:', this.reunionData);
      },
      error: (err) => {
        console.error('Error al obtener la reunión:', err);
      }
    }); 
  }

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
    if (!this.asunto || !this.fecha || (!this.todoElDia && (!this.inicio || !this.fin)) || !this.ubicacion) {
      this.errorMessage = 'Todos los campos obligatorios deben estar llenos.';
      return;
    }

    const reunionData = {
      asunto: this.asunto,
      fecha: this.fecha,
      inicio: this.inicio,
      fin: this.fin,
      ubicacion: this.ubicacion,
      observaciones: this.observaciones
    };

    this.reunionService.updateReunion(this.reunionId, reunionData)
      .subscribe({
        next: (response) => {
          console.log('Reunión actualizada con éxito:', response);
          this.navigateTo('/calendario');
        },
        error: (error) => {
          console.error('Error al actualizar la reunión:', error);
        }
      });
  }

  cargarUsuarios() {
    this.reunionService.getPosiblesAsistentes().subscribe({
      next: (data) => {
        this.asistentes = data;
        this.filteredUsers = data;
        this.marcarAsistentes();
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });
  }

  // Marcar a los usuarios que son asistentes de la reunión (compara por ID)
  marcarAsistentes() {
    this.filteredUsers.forEach(user => {
      // Verificar si el usuario es un asistente de la reunión
      user.isAsistente = this.asistentes.some(asistente => asistente === user.id);
    });
  }

  filterUsuarios(): void {
    // Si no hay texto en el campo de búsqueda, simplemente se muestra todos los usuarios
    if (!this.searchQuery) {
      this.filteredUsers = [...this.usuarios];  // Muestra todos los usuarios
    } else {
      
      const normalizedSearchQuery = this.normalizeString(this.searchQuery.toLowerCase());

      this.filteredUsers = this.usuarios.filter(usuario =>
        this.normalizeString(usuario.nombre.toLowerCase()).startsWith(normalizedSearchQuery) ||
        this.normalizeString(usuario.correo.toLowerCase()).startsWith(normalizedSearchQuery) ||
        this.normalizeString(usuario.apellido.toLowerCase()).startsWith(normalizedSearchQuery)
      );
    }
  }
  // Normalizar el texto para hacer coincidencias sin importar las tildes
  normalizeString(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  onSearchEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;  // Aseguramos que sea un KeyboardEvent
    if (keyboardEvent.key === 'Enter') {
      this.filterUsuarios();  // Filtra los usuarios cuando se presiona Enter
    }
  }
  

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
    if (this.inicio && this.fin) {
      const horaDesde = parseInt(this.inicio.split(':')[0]);
      const horaHasta = parseInt(this.fin.split(':')[0]);
      if (horaDesde >= horaHasta) {
        this.horasInvalid = true;
      }
    }
  }

  onToggleTodoElDia(): void {
    if (this.todoElDia) {
      this.inicio = '';
      this.fin = '';
    }
  }

  // Añadir o eliminar un asistente
  toggleAsistente(usuario: any): void {
    const action = usuario.isAsistente ? 'añadir' : 'eliminar';
    const confirmMessage = `¿Quieres ${action} este participante?`;

    if (confirm(confirmMessage)) {
      if (usuario.isAsistente) {
        this.reunionService.addAsistente(this.reunionId, usuario.correo).subscribe({
          next: (response) => {
            console.log('Asistente añadido con éxito:', response);
            this.asistentes.push(usuario.correo);
          },
          error: (error) => {
            console.error('Error al añadir al asistente:', error);
          }
        });
      } else {
        this.reunionService.deleteAsistente(this.reunionId, usuario.correo).subscribe({
          next: (response) => {
            console.log('Asistente eliminado con éxito:', response);
            this.asistentes = this.asistentes.filter(email => email !== usuario.correo);
          },
          error: (error) => {
            console.error('Error al eliminar al asistente:', error);
          }
        });
      }
    } else {
      usuario.isAsistente = !usuario.isAsistente;
    }
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


