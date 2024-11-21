import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderComponent } from "../shared/loader/loader.component";
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { ReunionService } from '../services/reunion.service';
import { AsistentesService } from '../services/asistentes.service';


@Component({
  selector: 'app-modificar-reuniones',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, FooterComponent, HeaderComponent],
  templateUrl: './modificar-reuniones.component.html',
  styleUrls: ['./modificar-reuniones.component.css']
})
export class ModificarReunionesComponent implements OnInit {

  isLoading: boolean = false;
  reunionData: any;

  reunionId: string = '';
  organizador: string = '';
  asunto: string = '';
  fecha: string = '';
  todoElDia: boolean = false;
  inicio: string = '';
  fin: string = '';
  ubicacion: string = '';
  observaciones: string = '';
  estado: string = '';

  showModal: boolean = false; // Modal de confirmación en modificacion
  showErrorModal: boolean = false; // Modal de error

  showAddModal: boolean = false; // Modal para añadir asistentes
  showDeleteModal: boolean = false; // Modal para eliminar asistentes
  selectedUsuario: any = null;

  

  asistentes: string[] = [];  // Lista de IDs de los asistentes
  usuarios: any[] = [];  // Lista de usuarios
  filteredUsers: any[] = [];  // Lista de usuarios filtrados

  fechaInvalid = false;
  horasInvalid = false;
  errorMessage: string = '';

  searchQuery: string = '';  // Búsqueda de usuarios
  


  
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly reunionService: ReunionService,
    private readonly asistentesService: AsistentesService
  ) {  }

  ngOnInit(): void {
    const reunionId = this.route.snapshot.paramMap.get('id');
    if (reunionId) {
      this.cargarDatosReunion(reunionId);
      this.cargarAsistentesPorReunion(reunionId);
      this.cargarUsuarios(); // Carga todos los posibles asistentes
    } else {
      console.error('Reunion ID is null');
    }
  }

  validarFormulario(): { valido: boolean, mensaje: string } {
    if (this.fechaInvalid) {
      return { valido: false, mensaje: 'Fecha inválida. No puede ser una fecha pasada.' };
    }
  
    if (this.horasInvalid) {
      return { valido: false, mensaje: 'Horario inválido. La hora de inicio debe ser menor a la hora de fin y estar entre las 8:00 y 19:00.' };
    }
  
    if (!this.asunto || !this.fecha || (!this.todoElDia && (!this.inicio || !this.fin)) || !this.ubicacion) {
      return { valido: false, mensaje: 'Todos los campos obligatorios deben estar llenos.' };
    }
    return { valido: true, mensaje: '' };
  }

  // Mostrar el modal con un mensaje de error para errores en el formulario
  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorModal = true;
  }
  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = '';
    this.showModal = false;
  }

  onSubmit(): void {
    this.showModal = true; // Modal confirmación modificación
  }
  
  onConfirmUpdate(): void { // Pulsar confirmar en el modal de actualización
    const { valido, mensaje } = this.validarFormulario();
    if (!valido) {
      this.showError(mensaje);
      return;
    }
    const { inicio, fin } = this.combinarFechasYHoras();
    const reunionData = {
      asunto: this.asunto,
      inicio: inicio,
      fin: fin,
      ubicacion: this.ubicacion,
      observaciones: this.observaciones,
      estado: this.estado
    };

    this.reunionService.updateReunion(this.reunionData.id, reunionData).subscribe({
      next: () => {
        this.router.navigate(['/ver-reuniones', this.reunionData.id]);
      },
      error: (error) => {
        console.error('Error al actualizar la reunión:', error);
        if (this.estado === 'Cancelada' || this.estado === 'Realizada' || this.estado === 'Cerrada') {
          this.errorMessage = 'No se puede modificar una reunión cancelada, realizada o cerrada.';
        }
    }
    });
    this.showModal = false;
  }
  onCancelModal() {
    this.showModal = false;
  }


  cargarDatosReunion(id: string): void {
    this.reunionService.getReunionById(id).subscribe({
      next: (data) => {
        this.reunionData = data;
        this.asistentes = this.reunionData.asistentes || [];
        this.mapearDatosReunion();
        this.marcarAsistentes();
      },
      error: (err) => {
        console.error('Error al cargar la reunión:', err);
      }
    });
  }

  mapearDatosReunion(): void {
    // Asigna los valores recibidos a las propiedades del componente
    this.asunto = this.reunionData.asunto;
    this.fecha = this.formatDate(this.reunionData.inicio);
    this.todoElDia = this.reunionData.todoElDia || false;
    this.inicio = this.formatTime(this.reunionData.inicio);
    this.fin = this.formatTime(this.reunionData.fin);
    this.ubicacion = this.reunionData.ubicacion;
    this.observaciones = this.reunionData.observaciones;
    this.estado = this.reunionData.estado;
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

  // Cargando lista de todos los asistentes 
  cargarUsuarios() {
    this.asistentesService.getPosiblesAsistentes().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.filteredUsers = data;
        this.marcarAsistentes();
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });
  }

  // Cargar asistentes de la reunión
  cargarAsistentesPorReunion(reunionId: string): void {
    this.asistentesService.getAsistentesPorReunion(reunionId).subscribe({
      next: (asistentes) => {
        this.asistentes = asistentes.map(a => a.idUsuario); // Extraer IDs de los usuarios asistentes
        this.marcarAsistentes();
      },
      error: (err) => {
        console.error('Error al cargar asistentes de la reunión:', err);
      }
    });
  }

  // Marcar a los usuarios que son asistentes de la reunión (compara por ID)
  marcarAsistentes() {
    this.filteredUsers.forEach(user => {
      user.isAsistente = this.asistentes.includes(user.id);
    });
  }

  // Filtrar usuarios por nombre, apellido o email en la barra de búsqueda
  filterUsuarios(): void {
    if(!this.searchQuery) {
      this.filteredUsers = [...this.usuarios];
      return;
    }
    const normalizedSearchQuery = this.normalizeString(this.searchQuery.toLowerCase());
    this.filteredUsers = this.usuarios.filter(usuario =>
      this.normalizeString(usuario.nombre.toLowerCase()).startsWith(normalizedSearchQuery) ||
      this.normalizeString(usuario.email.toLowerCase()).startsWith(normalizedSearchQuery) ||
      this.normalizeString(usuario.apellido1.toLowerCase()).startsWith(normalizedSearchQuery)
    );
  }
  
  // Normalizar el texto para hacer coincidencias sin importar las tildes
  normalizeString(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Filtrar usuarios al presionar Enter
  onSearchEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      this.filterUsuarios();  // Filtra los usuarios cuando se presiona Enter
    }
  }

  // Validación de la fecha
  validateFecha(): void {
    this.fechaInvalid = false;
    const reunion = new Date(this.fecha);
    const fechaActual = new Date();

    // Comparar fecha y hora si es el mismo día
    if (reunion.toDateString() === fechaActual.toDateString() && this.inicio) {
      const horaActual = fechaActual.getHours() * 60 + fechaActual.getMinutes();
      const horaInicio = parseInt(this.inicio.split(':')[0]) * 60 + parseInt(this.inicio.split(':')[1]);
      if (horaInicio < horaActual) {
        this.fechaInvalid = true;
      }
    } else if (reunion < fechaActual) {
      this.fechaInvalid = true;
    }
  }

  // Validación de horarios. Hora de inicio < Hora de fin
  validarHorario(): void {
    this.horasInvalid = false;
    if (this.inicio && this.fin) {
      const horaDesde = parseInt(this.inicio.split(':')[0]);
      const horaHasta = parseInt(this.fin.split(':')[0]);
  
      if (horaDesde >= horaHasta || horaDesde < 8 || horaHasta > 19) {
        this.horasInvalid = true;
      }
    }
  }

  // Funciones que generan el formato (yyyy-MM-dd HH:mm)
  combinarFechasYHoras(): { inicio: string, fin: string } {
    const inicioFecha = this.combineFechaHora(this.fecha, this.inicio);
    const finFecha = this.combineFechaHora(this.fecha, this.fin);
    return { inicio: inicioFecha, fin: finFecha };
  }
  combineFechaHora(fecha: string, hora: string): string {
    if (!fecha || !hora) {
      throw new Error("La fecha o la hora no pueden estar vacías.");
    }
    return `${fecha}T${hora}:00`; // Formato ISO 8601
  }

  // Si se selecciona TodoElDia, establecer la hora de inicio y fin predeterminadas
  onToggleTodoElDia(): void {
    if (this.todoElDia) {
      this.inicio = '08:00';
      this.fin = '19:00';
    } else {
      this.inicio = '';
      this.fin = '';
    }
  }

  // Añadir o eliminar asistentes
  confirmAddAsistente(): void {
    if (!this.selectedUsuario) return;

    this.asistentesService.addAsistente(this.reunionData.id, this.selectedUsuario.email).subscribe({
      next: () => {
        this.selectedUsuario.isAsistente = true; // Actualiza el estado en la interfaz
        this.showAddModal = false; // Cierra el modal
        console.log('Asistente añadido con éxito.');
      },
      error: (error) => {
        console.error('Error al añadir asistente:', error);
      }
    });
  }
  confirmDeleteAsistente(): void {
    if (!this.selectedUsuario) return;

    this.asistentesService.deleteAsistente(this.reunionData.id, this.selectedUsuario.id).subscribe({
      next: () => {
        this.selectedUsuario.isAsistente = false;
        this.showDeleteModal = false;
      },
      error: (error) => {
        console.error('Error al eliminar asistente:', error);
      }
    });
  }

  // Modales de añadir y eliminar asistentes
  openAddModal(usuario: any): void {
    this.selectedUsuario = usuario;
    this.showAddModal = true;
  }
  openDeleteModal(usuario: any): void {
    this.selectedUsuario = usuario;
    this.showDeleteModal = true;
  }
  closeAddModal(): void {
    this.showAddModal = false;
    this.selectedUsuario = null;
  }
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedUsuario = null;
  }
  
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}


