import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Ausencia {
  usuario: string;
  motivo: string;
  fechaInicio: Date;
  fechaFin: Date;
}

@Component({
  selector: 'app-ausencias',
  standalone: true,
  templateUrl: './ausencias.component.html',
  styleUrls: ['./ausencias.component.css'],
  imports: [FormsModule, CommonModule] // Importar FormsModule y CommonModule directamente en el componente
})
export class AusenciasComponent {
  ausencias: Ausencia[] = [
    { usuario: 'Juan Delgado Pérez', motivo: 'Vacaciones', fechaInicio: new Date(2024, 0, 15), fechaFin: new Date(2024, 0, 20) },
    { usuario: 'Guillermo Espejo Palome', motivo: 'Enfermedad', fechaInicio: new Date(2024, 1, 1), fechaFin: new Date(2024, 1, 10) }
  ]; // Ejemplo de datos iniciales

  showAddAusenciaForm: boolean = false;
  showDeleteModalAusencia: boolean = false;
  nuevaAusencia: Ausencia = { usuario: '', motivo: '', fechaInicio: new Date(), fechaFin: new Date() };
  indexToDelete: number | null = null;

  // Método para alternar la visibilidad del formulario de añadir ausencia
  toggleAddAusenciaForm() {
    this.showAddAusenciaForm = !this.showAddAusenciaForm;
    if (!this.showAddAusenciaForm) {
      this.resetNuevaAusencia();
    }
  }

  // Método para añadir una nueva ausencia
  addAusencia() {
    if (this.nuevaAusencia.usuario && this.nuevaAusencia.motivo && this.nuevaAusencia.fechaInicio && this.nuevaAusencia.fechaFin) {
      this.ausencias.push({ ...this.nuevaAusencia });
      this.resetNuevaAusencia();
      this.showAddAusenciaForm = false;
    }
  }

  // Método para abrir el modal de confirmación de eliminación de ausencia
  openDeleteModalAusencia(index: number) {
    this.indexToDelete = index;
    this.showDeleteModalAusencia = true;
  }

  // Método para confirmar la eliminación de una ausencia
  confirmDeleteAusencia() {
    if (this.indexToDelete !== null) {
      this.ausencias.splice(this.indexToDelete, 1);
      this.indexToDelete = null;
      this.showDeleteModalAusencia = false;
    }
  }

  // Método para cancelar la eliminación de una ausencia
  cancelDeleteAusencia() {
    this.showDeleteModalAusencia = false;
    this.indexToDelete = null;
  }

  // Método para reiniciar los valores de la nueva ausencia
  private resetNuevaAusencia() {
    this.nuevaAusencia = { usuario: '', motivo: '', fechaInicio: new Date(), fechaFin: new Date() };
  }
}
