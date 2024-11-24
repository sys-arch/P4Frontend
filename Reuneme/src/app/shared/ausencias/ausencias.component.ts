import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AusenciaService } from '../../services/ausencia.service';

interface Ausencia {
  id?: number;
  usuarioEmail: string;
  usuarioNombreCompleto: string;
  motivo: string;
  fechaInicio: Date;
  fechaFin: Date;
}

@Component({
  selector: 'app-ausencias',
  standalone: true,
  templateUrl: './ausencias.component.html',
  styleUrls: ['./ausencias.component.css'],
  imports: [FormsModule, CommonModule],
  providers: [AusenciaService]
})
export class AusenciasComponent implements OnInit {
  ausencias: Ausencia[] = [];
  filteredAusencias: Ausencia[] = [];
  showAddAusenciaForm: boolean = false;
  nuevaAusencia: Partial<Ausencia> = { usuarioEmail: '', motivo: '', fechaInicio: new Date(), fechaFin: new Date() };
  token: string = 'your-auth-token-here'; // Reemplaza con el token real o ajusta para obtenerlo dinámicamente
  searchBy: string = 'name';
  searchQuery: string = '';

  constructor(private ausenciaService: AusenciaService) {}

  ngOnInit() {
    this.getTodasLasAusencias();
  }

  // Método para obtener todas las ausencias
  getTodasLasAusencias() {
    const today = new Date();
    this.ausenciaService.getTodasLasAusencias().subscribe(
      (data: any[]) => {
        // Filtramos y ordenamos las ausencias
        this.ausencias = data
          .map(ausencia => ({
            id: ausencia.id,
            usuarioEmail: ausencia.empleado.email, // Cambiado para acceder al campo email dentro de empleado
            usuarioNombreCompleto: `${ausencia.empleado.nombre} ${ausencia.empleado.apellido1}`, // Cambiado para acceder al campo nombre y apellido1 dentro de empleado
            motivo: ausencia.motivo,
            fechaInicio: new Date(ausencia.fechaInicio), // Convertimos fechaInicio a Date
            fechaFin: new Date(ausencia.fechaFin) // Convertimos fechaFin a Date
          }))
          .filter(ausencia => ausencia.fechaFin >= today) // Excluir ausencias pasadas
          .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime()); // Ordenar por fecha de inicio ascendente
        
        // Inicializar la lista filtrada
        this.filteredAusencias = [...this.ausencias];
      },
    );
  }


  // Método para alternar la visibilidad del formulario de añadir ausencia
  toggleAddAusenciaForm() {
    this.showAddAusenciaForm = !this.showAddAusenciaForm;
    if (!this.showAddAusenciaForm) {
      this.resetNuevaAusencia();
    }
  }

  // Método para añadir una nueva ausencia
  addAusencia() {
    if (this.nuevaAusencia.usuarioEmail && this.nuevaAusencia.motivo && this.nuevaAusencia.fechaInicio && this.nuevaAusencia.fechaFin) {
      // Crear el objeto ausencia con fechas convertidas a formato ISO compatible
      const ausencia = {
        ...this.nuevaAusencia,
        fechaInicio: this.formatDate(this.nuevaAusencia.fechaInicio as Date),
        fechaFin: this.formatDate(this.nuevaAusencia.fechaFin as Date)
      };
  
      if (ausencia.usuarioEmail) { // Verificación explícita
        this.ausenciaService.addAusencia(ausencia.usuarioEmail, ausencia).subscribe(
          response => {
            this.getTodasLasAusencias(); // Refresca la lista tras añadir la nueva ausencia
            this.resetNuevaAusencia();
            this.showAddAusenciaForm = false;
          },
          error => console.error('Error al añadir la ausencia:', error)
        );
      } else {
        console.error("El email del usuario es undefined.");
      }
    }
  }
  
  
  // Método para formatear la fecha en `yyyy-MM-ddTHH:mm:ss`
  // Método para formatear la fecha en `yyyy-MM-ddTHH:mm:ss`
private formatDate(date: any): string {
  const dateObj = date instanceof Date ? date : new Date(date); // Asegúrate de que `date` sea un objeto Date
  return dateObj.toISOString().split('.')[0]; // Remueve la parte de milisegundos para mantener `yyyy-MM-ddTHH:mm:ss`
}


  // Método para eliminar una ausencia y refrescar la lista
  deleteAusencia(id: number) {
    this.ausenciaService.deleteAusencia(id.toString()).subscribe(
      () => {
        this.getTodasLasAusencias(); // Refresca la lista tras eliminar la ausencia
      },
      error => console.error('Error al eliminar la ausencia:', error)
    );
  }

  // Método para filtrar ausencias en base a searchBy y searchQuery
  filterAusencias() {
    const query = this.searchQuery.toLowerCase();
    this.filteredAusencias = this.ausencias.filter(ausencia => {
      if (this.searchBy === 'name') {
        return ausencia.usuarioNombreCompleto.toLowerCase().includes(query);
      } else if (this.searchBy === 'email') {
        return ausencia.usuarioEmail.toLowerCase().includes(query);
      } else if (this.searchBy === 'motivo') {
        return ausencia.motivo.toLowerCase().includes(query);
      }
      return false;
    });
  }

  // Método para reiniciar los valores de la nueva ausencia
  private resetNuevaAusencia() {
    this.nuevaAusencia = { usuarioEmail: '', motivo: '', fechaInicio: new Date(), fechaFin: new Date() };
  }
}
