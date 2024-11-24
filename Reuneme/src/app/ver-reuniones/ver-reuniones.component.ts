import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReunionService } from '../services/reunion.service';
import { AsistentesService } from '../services/asistentes.service';
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
  asistentes: any[] = [];
  idsAsistentes: string[] = [];
  usuarios: any[] = [];

  showModal: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly reunionService: ReunionService,
    private readonly asistentesService: AsistentesService
  ) {}

  ngOnInit(): void {
    const reunionId = this.route.snapshot.paramMap.get('id');
    if (reunionId) {
      this.getReunion(reunionId); // Cargar detalles de la reunión
      this.cargarAsistentes(reunionId); // Cargar asistentes
    } else {
      console.error('ID de reunión no proporcionado');
    }
  }

  getReunion (reunionId: string): void {
    this.reunionService.getReunionById(reunionId).subscribe({
      next: (response) => {
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

  getAsistentesPorReunion(reunionId: string): void {
    this.asistentesService.getAsistentesPorReunion(reunionId).subscribe({
      next: (response) => {
        this.asistentes = response; // Asigna la lista de asistentes obtenida
        console.log('Asistentes cargados:', this.asistentes);
      },
      error: (error) => {
        console.error('Error al cargar asistentes de la reunión:', error);
      }
    });
  }

  cargarAsistentes(reunionId: string): void {
    // Obtener los IDs de los asistentes
    this.asistentesService.getAsistentesPorReunion(reunionId).subscribe({
      next: (ids) => {
        this.idsAsistentes = ids.map((asistente: any) => asistente.idUsuario); // Extraer IDs
        // Obtener todos los usuarios posibles
        this.asistentesService.getPosiblesAsistentes().subscribe({
          next: (usuarios) => {
            this.usuarios = usuarios;
            // Filtrar los usuarios cuyo ID coincida con los asistentes
            this.asistentes = this.usuarios.filter((usuario) =>
              this.idsAsistentes.includes(usuario.id)
            );
            console.log('Asistentes finales:', this.asistentes);
          },
          error: (err) => {
            console.error('Error al obtener usuarios posibles:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error al obtener IDs de asistentes:', err);
      },
    });
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

  cancelarReunion(): void {
    this.showModal = true;
  }

  //Modales para cancelar reunión
  onConfirmCancel(): void {
    this.showModal = false;
    this.reunionService.cancelarReunion(this.reunionData.id).subscribe({
      next: (response) => {
        console.log('Reunión cancelada exitosamente:', response);
        this.navigateTo('/ventana-principal');
      },
      error: (error) => {
        console.error('Error al cancelar la reunión:', error);
      }
    });
  }
  onCancelModal(): void {
    this.showModal = false;
  }

  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }
}