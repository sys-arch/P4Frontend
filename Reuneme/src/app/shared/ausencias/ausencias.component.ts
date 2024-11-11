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
            usuarioEmail: ausencia.usuario.email,
            usuarioNombreCompleto: `${ausencia.usuario.nombre} ${ausencia.usuario.apellido1}`,
            motivo: ausencia.motivo,
            fechaInicio: new Date(ausencia.fechaInicio),
            fechaFin: new Date(ausencia.fechaFin)
          }))
          .filter(ausencia => ausencia.fechaFin >= today) // Excluir ausencias pasadas
          .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime()); // Ordenar por fecha de inicio ascendente
        
        // Inicializar la lista filtrada
        this.filteredAusencias = [...this.ausencias];
      },
      error => console.error('Error al obtener ausencias:', error)
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
      this.ausenciaService.addAusencia(this.nuevaAusencia.usuarioEmail, this.nuevaAusencia).subscribe(
        response => {
          this.getTodasLasAusencias(); // Refresca la lista tras añadir una nueva ausencia
          this.resetNuevaAusencia();
          this.showAddAusenciaForm = false;
        },
        error => console.error('Error al añadir la ausencia:', error)
      );
    }
  }

  // Método para eliminar una ausencia y refrescar la lista
  deleteAusencia(id: number) {
    this.ausenciaService.deleteAusencia(id.toString(), this.token).subscribe(
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
