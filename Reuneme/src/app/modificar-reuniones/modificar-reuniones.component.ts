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
  asunto: string = '';
  fecha: string = '';
  todoElDia: boolean = false;
  horaDesde: string = '';
  horaHasta: string = '';
  ubicacion: string = '';
  observaciones: string = '';
  idUsuario: string = '';  // ID del asistente a añadir
  asistentes: string[] = [];  // Lista de IDs de los asistentes
  //usuarios: any[] = [];  // Lista de usuarios
  fechaInvalid = false;
  horasInvalid = false;
  errorMessage: string = '';
  token: string = ''; 

  searchQuery: string = '';  // Búsqueda de usuarios
  filteredUsers: any[] = [];  // Lista de usuarios filtrados

  mockReunion = {
    id: '12345',
    asunto: 'Revisión trimestral de proyectos',
    fecha: '2024-11-15',
    todoElDia: false,
    horaDesde: '10:00',
    horaHasta: '12:00',
    ubicacion: 'Sala de conferencias B',
    observaciones: 'Revisar el estado actual de los proyectos y proyecciones.',
    asistentes: ['user1@example.com', 'user2@example.com']
  };
  

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly reunionService: ReunionService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    // this.reunionId = this.route.snapshot.paramMap.get('id') || '';  // Obtener el ID de la reunión desde la URL

    // if (this.reunionId) {
    //   this.getReunionDetails();
    // }

    this.loadMockReunion();  // Cargar la reunión de prueba
  }

  usuarios = [
    { nombre: 'Juan', apellido: 'Pérez', correo: 'user1@example.com', isAsistente: this.asistentes.includes('user1@example.com') },
    { nombre: 'Ana', apellido: 'Gómez', correo: 'user2@example.com', isAsistente: this.asistentes.includes('user2@example.com') },
    { nombre: 'Carlos', apellido: 'López', correo: 'user3@example.com', isAsistente: this.asistentes.includes('user3@example.com') },
    { nombre: 'Raul', apellido: 'Moya', correo: 'use4@example.com', isAsistente: this.asistentes.includes('user4@example.com') },
    { nombre: 'Alvaro', apellido: 'Fernández', correo: 'user5@example.com', isAsistente: this.asistentes.includes('user5@example.com') }
  ];
  // Reunion de prueba
  loadMockReunion(): void {
    const reunion = this.mockReunion;  // Usa el objeto de prueba
    this.reunionId = reunion.id;
    this.asunto = reunion.asunto;
    this.fecha = reunion.fecha;
    this.todoElDia = reunion.todoElDia;
    this.horaDesde = reunion.horaDesde;
    this.horaHasta = reunion.horaHasta;
    this.ubicacion = reunion.ubicacion;
    this.observaciones = reunion.observaciones;
    this.asistentes = reunion.asistentes || [];
  
    // Obtener la lista simulada de usuarios y marcar los asistentes
    this.usuarios.forEach(usuario => {
      usuario.isAsistente = this.asistentes.includes(usuario.correo);
    });

    this.filteredUsers = [...this.usuarios];
  }

  // Obtener los detalles de la reunión a editar
  getReunionDetails(): void {
    // Obtener los detalles de la reunión
    this.reunionService.getReunionById(this.reunionId).subscribe({
      next: (response: any) => {
        const reunion = response.data;
        this.asunto = reunion.asunto;
        this.fecha = reunion.fecha;
        this.todoElDia = reunion.todoElDia;
        this.horaDesde = reunion.horaDesde;
        this.horaHasta = reunion.horaHasta;
        this.ubicacion = reunion.ubicacion;
        this.observaciones = reunion.observaciones;
        this.asistentes = reunion.asistentes || []; // Lista de correos de los asistentes
  
        // Obtener la lista de todos los empleados sin `token`
        this.reunionService.getAllUsers().subscribe({
          next: (users: any[]) => {
            // Marcar los empleados que ya son asistentes de la reunión
            this.usuarios = users.map(user => ({
              ...user,
              isAsistente: this.asistentes.includes(user.correo) // Marcar como asistente si está en la lista
            }));
          },
          error: (error: any) => {
            console.error('Error al obtener la lista de empleados:', error);
          }
        });
      },
      error: (error: any) => {
        console.error('Error al obtener la reunión:', error);
      }
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

    const reunionData = {
      asunto: this.asunto,
      fecha: this.fecha,
      todoElDia: this.todoElDia,
      horaDesde: this.horaDesde,
      horaHasta: this.horaHasta,
      ubicacion: this.ubicacion,
      observaciones: this.observaciones,
      asistentes: this.asistentes
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

  // Navegar a otra ruta
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}


