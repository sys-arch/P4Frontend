import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsistentesService } from '../../services/asistentes.service';
import { AusenciaService } from '../../services/ausencia.service';
import { ReunionService } from '../../services/reunion.service';
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
  providers: [AusenciaService, UserService]
})
export class AusenciasComponent implements OnInit {
  ausencias: Ausencia[] = [];
  filteredAusencias: Ausencia[] = [];
  showAddAusenciaForm: boolean = false;
  nuevaAusencia: Partial<Ausencia> = { usuarioEmail: '', motivo: '', fechaInicio: new Date(), fechaFin: new Date() };
  token: string = ''; // Reemplaza con el token real o ajusta para obtenerlo dinámicamente
  searchBy: string = 'name';
  searchQuery: string = '';

  filteredEmails: string[] = [];
  showConfirmAusenciaForm : boolean = false;
  fechaInicioConflicto: Date | null = null;

  reunionOrg: any[] = [];
  reunionAsist: any[] = []
  myemail: string = ''
  constructor(
    private ausenciaService: AusenciaService,
    private reunionService: ReunionService,
    private asistentesService: AsistentesService,
    private userService: UserService
  ) {}


  ngOnInit() {
    this.token = sessionStorage.getItem('token') || ''; // Reemplaza con el token real o ajusta para obtenerlo dinámicamente
    this.getTodasLasAusencias();
  }
  getEmployeeEmails(query: string): void {
    if (!query.trim()) {
      this.filteredEmails = [];
      return;
    }
  
    this.userService.getAllUsers(this.token).subscribe(
      (userList: any[]) => {
        // Procesa y filtra los usuarios
        this.filteredEmails = userList
          .filter(user => {
            // Determina si es un empleado (no admin y no bloqueado, ajusta según tus datos)
            const isAdmin = user.hasOwnProperty('interno') && user.interno !== undefined;
            return !isAdmin && user.email.toLowerCase().includes(query.toLowerCase());
          })
          .map(user => user.email); // Solo extrae los correos electrónicos
  
        console.log('Emails filtrados:', this.filteredEmails);
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }
  
  onEmailInputChange() {
    console.log('Input cambiado:', this.nuevaAusencia.usuarioEmail);
    this.getEmployeeEmails(this.nuevaAusencia.usuarioEmail || '');
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
        fechaInicio: new Date(this.nuevaAusencia.fechaInicio as Date).toISOString(),
        fechaFin: new Date(this.nuevaAusencia.fechaFin as Date).toISOString(),
      };
      
      // Comprueba si hay reuniones en conflicto
      this.ausenciaService.verificarReunion(ausencia.usuarioEmail!, ausencia.fechaInicio, ausencia.fechaFin).subscribe( 
        (vaBien) => {
          if (!vaBien) {
            // Si hay conflicto, muestra el modal
            this.fechaInicioConflicto = this.nuevaAusencia.fechaInicio ?? null;
            this.showConfirmAusenciaForm = true;
            
          } else {
            // Si no hay conflicto, añade la ausencia directamente
            this.crearAusencia(ausencia);
          }
        },
      //error => console.error('Error al verificar reuniones:', error)
      );
    }
}

  // Método para crear una ausencia, cuando se comprueba que no hay conflictos se envía la información a este método que crea la ausencia
  
  crearAusencia(ausencia: any) {
    if (ausencia.usuarioEmail) { // Verificación explícita
      this.ausenciaService.addAusencia(ausencia.usuarioEmail!, ausencia).subscribe(
        () => {
          console.log('Ausencia creada correctamente');
          this.getTodasLasAusencias();
          this.resetNuevaAusencia();
          this.showConfirmAusenciaForm = false;
        },
        error => console.error('Error al añadir la ausencia:', error)
      );
    }
  } 
  
  
cerrarModal() {
  this.showConfirmAusenciaForm = false;
}

confirmarAusencia(dia: Date | string | null, motivo: string | null, emailUsuario: string): void {
    this.showConfirmAusenciaForm = false;

    if(!dia){
      console.error('Dia no especificado');
      return;
    }
    if (!emailUsuario || emailUsuario.trim() === '') {
      console.error('Email del usuario no especificado o inválido');
      return;
    }
    if(!motivo){
      console.error('Motivo no especificado');
      return;
    }

    // Convierte `dia` a un objeto `Date` si no lo es
    const fechaDia: Date = typeof dia === 'string' ? new Date(dia) : dia as Date;

    // Usar el email del usuario a verificar en lugar del email en sesión
    const email = emailUsuario.trim();

    // Cargar reuniones organizadas
    this.reunionService.getReunionesOrganizadas(email).subscribe((reunionesOrganizadas) => {
      this.reunionOrg = reunionesOrganizadas;

      // Buscar reuniones organizadas que coincidan con el día de la ausencia
      const reunionesOrganizadasEnElDia = this.reunionOrg.filter(
        (r) => new Date(r.inicio).toLocaleDateString() === fechaDia.toLocaleDateString()
      );

      // Eliminar cada reunión organizada encontrada
      reunionesOrganizadasEnElDia.forEach((reunion) => {
        const ausencia = {
          usuarioEmail: email,
          motivo: motivo,
          fechaInicio: fechaDia.toISOString(),
          fechaFin: fechaDia.toISOString(),
        };
        this.deletOrgReunion(reunion, email, ausencia);
      });
    });

    // Cargar reuniones asistidas
    this.reunionService.getReunionesAsistidas(email).subscribe((reunionesAsistidas) => {
      this.reunionAsist = reunionesAsistidas;

      // Buscar reuniones asistidas que coincidan con el día de la ausencia
      const reunionesAsistidasEnElDia = this.reunionAsist.filter(
        (r) => new Date(r.inicio).toLocaleDateString() === fechaDia.toLocaleDateString()
      );

      // Eliminar cada reunión asistida encontrada
      reunionesAsistidasEnElDia.forEach((reunion) => {
        const ausencia = {
          usuarioEmail: email,
          motivo: motivo,
          fechaInicio: fechaDia.toISOString(),
          fechaFin: fechaDia.toISOString(),
        };
        this.deletAsistenReunion(reunion, email, ausencia);
      });
    });
}

  //metodo que cancela la reunion
  deletOrgReunion(reunion: any, email: string, ausencia: any): void {
    const idReunion = reunion.id; // Asegúrate de que 'reunion' contiene el ID de la reunión.
  
    if (!idReunion) {
      console.error('Falta el ID de la reunión para cancelarla.');
      return;
    }

    this.reunionService.cancelarReunion(idReunion).subscribe(
      (response) => {
        console.log('Reunión cancelada correctamente', response);
        // Aquí puedes actualizar el listado de reuniones o realizar alguna acción adicional.
      this.crearAusencia(ausencia);
      },
      (error) => {
        console.error('Error al cancelar la reunión', error);
      }
    );
  }

  //metodo que elimina la reunion solo para el asistente
  deletAsistenReunion(reunion: any, email: string, ausencia: any): void {
    const idReunion = reunion.id; // Asegúrate de que 'reunion' contiene el ID de la reunión.
  
    if (!idReunion || !email) {
      console.error('Faltan datos necesarios para eliminar al asistente de la reunión');
      return;
    }
  
    // Obtener el usuario a partir del email
    this.userService.verDatosEmpleado(email).subscribe(
    (empleado) => {
      const idUsuario = empleado.id; // ID del usuario obtenido del backend

      if (!idUsuario) {
        console.error('No se pudo obtener el ID del usuario asistente.');
        return;
      }

      this.asistentesService.deleteAsistente(idReunion, idUsuario).subscribe(
        (response) => {
          console.log('Asistente eliminado correctamente', response);

          // Crear la ausencia después de eliminar la asistencia
          this.crearAusencia(ausencia);
        },
        (error) => {
          console.error('Error al eliminar al asistente', error);
        }
      );
    },
    (error) => {
      console.error('Error al obtener el usuario por email:', error);
    }
  );
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
