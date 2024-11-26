import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AusenciaService } from '../../services/ausencia.service';
import { ReunionService } from '../../services/reunion.service';
import { AsistentesService } from '../../services/asistentes.service';
import { UserService } from '../../services/user.service';

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
  showConfirmAusenciaForm : boolean = false;
  fechaInicioConflicto: Date | null = null;

  reunionOrg: any[] = [];
  reunionAsist: any[] = []
  myemail: string = ''

  constructor(
    private readonly ausenciaService: AusenciaService,
    private readonly reunionService: ReunionService,
    private readonly asistentesService: AsistentesService,
    private readonly userService: UserService
  ) {}

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
    if (
      this.nuevaAusencia.usuarioEmail &&
      this.nuevaAusencia.motivo &&
      this.nuevaAusencia.fechaInicio &&
      this.nuevaAusencia.fechaFin
    ) {
      // Validar las fechas antes de continuar
      const fechasValidas = this.validateDates(
        this.nuevaAusencia.fechaInicio,
        this.nuevaAusencia.fechaFin
      );
  
      if (!fechasValidas) {
        console.warn('Fechas inválidas. Corrige las fechas para continuar.');
        return;
      }
  
      // Crear el objeto ausencia con fechas convertidas a formato ISO compatible
      const ausencia = {
        ...this.nuevaAusencia,
        fechaInicio: `${this.nuevaAusencia.fechaInicio}T00:00:00`,
        fechaFin: `${this.nuevaAusencia.fechaFin}T23:59:59`
      };
      
      console.log('Ausencia a añadir:', ausencia);
      // Comprueba si hay reuniones en conflicto
      this.ausenciaService.verificarReunion(ausencia.usuarioEmail!, ausencia.fechaInicio, ausencia.fechaFin).subscribe({
        next: (vaBien) => {
          if (!vaBien) { // Si hay conflicto, muestra el formulario de confirmación
            this.fechaInicioConflicto = this.nuevaAusencia.fechaInicio ?? null;
            this.showConfirmAusenciaForm = true;
          } else {
            this.crearAusencia(ausencia);
          }
        },
        error: (error) => console.error('Error al verificar reuniones:', error)
      });
    }
  }

  // Método para crear una ausencia, 
  // cuando se comprueba que no hay conflictos se envía la información a este método que crea la ausencia
  crearAusencia(ausencia: any) {
    if (ausencia.usuarioEmail) { // Verificación explícita
      this.ausenciaService.addAusencia(ausencia.usuarioEmail, ausencia).subscribe({
        next: () => {
          this.getTodasLasAusencias();
          this.resetNuevaAusencia();
          this.showConfirmAusenciaForm = false;
        },
        error: (err) => {
          alert('Error: ' + err.error.message || 'No se pudo añadir la ausencia');
          console.error('Error al añadir ausencia', err);
      }
      });
    }
  } 
  
  
  cerrarModal() {
    this.showConfirmAusenciaForm = false;
  }

  confirmarAusencia(dia: Date | string | null, motivo: string | null, emailUsuario: string): void {
    this.showConfirmAusenciaForm = false;
  
    if (!dia) {
      console.error('Día no especificado');
      return;
    }
    if (!emailUsuario || emailUsuario.trim() === '') {
      console.error('Email del usuario no especificado o inválido');
      return;
    }
    if (!motivo) {
      console.error('Motivo no especificado');
      return;
    }
  
    const fechaDia: Date = typeof dia === 'string' ? new Date(dia) : dia;
  
    const email = emailUsuario.trim();
  
    // Establecer rangos de tiempo para el día
    const inicioDia = new Date(fechaDia).setHours(0, 0, 0, 0);
    const finDia = new Date(fechaDia).setHours(23, 59, 59, 999);
  
    // Cargar reuniones organizadas
    this.reunionService.getReunionesOrganizadas(email).subscribe((reunionesOrganizadas) => {
      this.reunionOrg = reunionesOrganizadas;
  
      // Buscar reuniones organizadas que coincidan con el día de la ausencia
      const reunionesOrganizadasEnElDia = this.reunionOrg.filter(
        (r) => {
          const inicioReunion = new Date(r.inicio).getTime();
          return inicioReunion >= inicioDia && inicioReunion <= finDia;
        }
      );
  
      // Eliminar cada reunión organizada encontrada
      reunionesOrganizadasEnElDia.forEach((reunion) => {
        const ausencia = {
          usuarioEmail: email,
          motivo: motivo,
          fechaInicio: `${new Date(fechaDia).toISOString().split('T')[0]}T00:00:00`,
          fechaFin: `${new Date(fechaDia).toISOString().split('T')[0]}T23:59:59`,
        };
        this.deletOrgReunion(reunion, email, ausencia);
      });
    });
  
    // Cargar reuniones asistidas
    this.reunionService.getReunionesAsistidas(email).subscribe((reunionesAsistidas) => {
      this.reunionAsist = reunionesAsistidas;
  
      // Buscar reuniones asistidas que coincidan con el día de la ausencia
      const reunionesAsistidasEnElDia = this.reunionAsist.filter(
        (r) => {
          const inicioReunion = new Date(r.inicio).getTime();
          return inicioReunion >= inicioDia && inicioReunion <= finDia;
        }
      );
  
      // Eliminar cada reunión asistida encontrada
      reunionesAsistidasEnElDia.forEach((reunion) => {
        const ausencia = {
          usuarioEmail: email,
          motivo: motivo,
          fechaInicio: `${new Date(fechaDia).toISOString().split('T')[0]}T00:00:00`,
          fechaFin: `${new Date(fechaDia).toISOString().split('T')[0]}T23:59:59`,
        };
        this.deletAsistenReunion(reunion, email, ausencia);
      });
    });
  }
  

  //metodo que cancela la reunion
  deletOrgReunion(reunion: any, email: string, ausencia: any): void {
    const idReunion = reunion.id;

    this.reunionService.cancelarReunion(idReunion).subscribe({
      next: () => {
        this.crearAusencia(ausencia);
      },
      error: (error) => {
        console.error('Error al cancelar la reunión', error);
      }
    });
  }

  //metodo que elimina la reunion solo para el asistente
  deletAsistenReunion(reunion: any, email: string, ausencia: any): void {
    const idReunion = reunion.id;
  
    // Obtener el usuario a partir del email
    this.userService.verDatosEmpleado(email).subscribe({
      next: (empleado) => {
        const idUsuario = empleado.id;
        this.asistentesService.deleteAsistente(idReunion, idUsuario).subscribe({
          next: (response) => {
            console.log('Asistente eliminado correctamente', response);
            this.crearAusencia(ausencia);
          },
          error: (error) => {
            console.error('Error al eliminar al asistente', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener el usuario por email:', error);
      }
    });
  }

  // Método para eliminar una ausencia y refrescar la lista
  deleteAusencia(id: number) {
    this.ausenciaService.deleteAusencia(id.toString()).subscribe({
      next: () => {
        this.getTodasLasAusencias(); // Refresca la lista tras eliminar la ausencia
      },
      error: error => console.error('Error al eliminar la ausencia:', error)
    });
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

  validateDates(startDate: Date, endDate: Date): boolean {
    if (!startDate || !endDate) {
      console.error('Las fechas de inicio y fin son obligatorias.');
      return false;
    }
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(0, 0, 0, 0);
    if (start > end) {
      console.error('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return false;
    }
    const today = new Date().setHours(0, 0, 0, 0);
    if (start < today) {
      console.error('La fecha de inicio no puede ser anterior a la fecha actual.');
      return false;
    }
    return true;
  }
}
