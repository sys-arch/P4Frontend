import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ReunionService } from '../../services/reunion.service';
import { BuzonReunionesComponent } from "../buzon-reuniones/buzon-reuniones.component";

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, BuzonReunionesComponent],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  diasDelAnio: Date[] = [];
  diasFiltrados: (Date | null)[] = [];
  vista: 'mes' | 'semana' = 'mes';
  nombreMes: string = '';
  mesActual: number = new Date().getMonth();
  añoActual: number = new Date().getFullYear();
  semanaActual: number = 0;
  horas: string[] = [
    '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00'
  ];
  reunionOrg: any[] = [];
  reunionAsist: any[] = []
  myemail: string = '';


  constructor(
    private readonly router: Router,
    private readonly reunionService: ReunionService,
    private readonly renderer: Renderer2
  )  { }

  ngOnInit() {
    this.myemail = sessionStorage.getItem('email') || '';
    this.vista = 'semana'; // Configura la vista inicial como semanal
    this.calcularSemanaActual(); // Calcula la semana actual
    this.generarDiasDelAnio();
    this.aplicarFiltro();
    this.cargarReuniones(); // Llama al método para cargar los datos mock
  }

  cargarReuniones() {
    const email = sessionStorage.getItem('email') || '';

    // Cargar reuniones organizadas
    this.reunionService.getReunionesOrganizadas(email).subscribe(
      (reunionesOrganizadas) => {
        this.reunionOrg = reunionesOrganizadas;
        console.log('Reuniones organizadas:', this.reunionOrg);

        // Cargar reuniones asistidas
        this.reunionService.getReunionesAsistidas(email).subscribe(
          (reunionesAsistidas) => {
            this.reunionAsist = reunionesAsistidas;
            
            console.log('Reuniones asistidas:', this.reunionAsist);
          },
          (error) => {
            console.error('Error al cargar reuniones asistidas:', error);
          }
        );
      },
      (error) => {
        console.error('Error al cargar reuniones organizadas:', error);
      }
    );
  }
  obtenerClaseReunion(dia: Date | null, hora: string | null): { id: string, clase: string, asunto?: string, estado?: string } | null {
    if(!dia || !hora){
      return null;
    }
    
    // Buscar en reuniones organizadas
    const reunionOrg = this.reunionOrg.find(
      (r) =>
        new Date(r.inicio).toLocaleDateString() === dia.toLocaleDateString() &&
        new Date(r.inicio).getHours() === parseInt(hora.split(':')[0], 10)
    );
  
    if (reunionOrg) {
      return {
        id: reunionOrg.id,
        clase: 'reunion-organizador',
        asunto: reunionOrg.asunto,
        estado: reunionOrg.estado.toLowerCase() // Convertir estado a minúsculas
      };
    }
  
    // Buscar en reuniones asistidas
    const reunionAsist = this.reunionAsist.find(
      (r) =>
        new Date(r.inicio).toLocaleDateString() === dia.toLocaleDateString() &&
        new Date(r.inicio).getHours() === parseInt(hora.split(':')[0], 10)
    );
  
    if (reunionAsist) {
      return {
        id: reunionAsist.id,
        clase: 'reunion-asistente',
        asunto: reunionAsist.asunto,
        estado: reunionAsist.estado.toLowerCase() 
      };
    }
  
  
    return null;
  }  

  // Mostrar información de la reunión al pulsar sobre ella en el calendario
  verReunion(id: string | undefined): void{
    if(id){
      this.router.navigate(['/ver-reuniones', id]);
    }
  }
  
  calcularSemanaActual() {
    const hoy = new Date();
    this.añoActual = hoy.getFullYear();
    this.mesActual = hoy.getMonth();
  
    // Calcular el número de la semana actual
    const primerDiaMes = new Date(this.añoActual, this.mesActual, 1);
    const diaInicioSemana = primerDiaMes.getDay() === 0 ? 6 : primerDiaMes.getDay() - 1;
  
    const diaDelMes = hoy.getDate();
    const diasDesdeInicio = diaDelMes + diaInicioSemana - 1; // Días desde el inicio del mes
    this.semanaActual = Math.floor(diasDesdeInicio / 7); // Calcula la semana actual
  }
  setVista(vista: 'mes' | 'semana') {
    this.vista = vista;
    this.aplicarFiltro(); // Aplica el filtro según la vista seleccionada
  }
  

  generarDiasDelAnio() {
    this.diasDelAnio = [];
    for (let mes = 0; mes < 12; mes++) {
      const diasMes = new Date(this.añoActual, mes + 1, 0).getDate();
      for (let dia = 1; dia <= diasMes; dia++) {
        this.diasDelAnio.push(new Date(this.añoActual, mes, dia));
      }
    }
  }

  aplicarFiltro() {
    if (this.vista === 'mes') {
      this.filtrarPorMes();
    } else if (this.vista === 'semana') {
      this.filtrarPorSemana();
    }
  }
  
  
  calcularSemanasDelMes(mes: number, año: number): number {
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);

    const diaDeLaSemanaInicio = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1;
    const diaDeLaSemanaFin = ultimoDia.getDay() === 0 ? 6 : ultimoDia.getDay() - 1;

    // Total días del mes + días de la semana antes y después del mes
    const totalDias = ultimoDia.getDate() + diaDeLaSemanaInicio + (6 - diaDeLaSemanaFin);

    // Dividir por 7 para obtener semanas completas
    return Math.ceil(totalDias / 7);
  }

  

  semanasDelMes: number = 0;

  filtrarPorMes() {
    this.vista = 'mes';
    this.diasFiltrados = this.calcularDiasDelMes(this.mesActual, this.añoActual);

    // Calcular cuántas semanas tiene el mes actual
    this.semanasDelMes = this.calcularSemanasDelMes(this.mesActual, this.añoActual);

    // Actualizar la variable CSS para ajustar la altura de las filas
    this.renderer.setStyle(
      document.documentElement,
      '--semanas-del-mes',
      this.semanasDelMes.toString()
    );

    this.nombreMes = `${this.obtenerNombreMes(this.mesActual)} ${this.añoActual}`;
    this.semanaActual = 0;
  }


  calcularDiasDelMes(mes: number, año: number): (Date | null)[] {
    const primerDiaMes = new Date(año, mes, 1);
    const diaDeLaSemanaInicio = primerDiaMes.getDay() === 0 ? 6 : primerDiaMes.getDay() - 1;
    const diasDelMes = new Date(año, mes + 1, 0).getDate();

    const diasMesConEspacios: (Date | null)[] = Array(diaDeLaSemanaInicio).fill(null);
    for (let dia = 1; dia <= diasDelMes; dia++) {
      diasMesConEspacios.push(new Date(año, mes, dia));
    }
    return diasMesConEspacios;
  }

  filtrarPorSemana() {
    this.vista = 'semana';
  
    // Determinar el lunes de la semana actual
    const hoy = new Date(this.añoActual, this.mesActual, 1 + this.semanaActual * 7);
    const diaInicioSemana = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;
    const primerDiaSemana = new Date(hoy);
    primerDiaSemana.setDate(hoy.getDate() - diaInicioSemana);
  
    // Crear un array de 7 días consecutivos
    this.diasFiltrados = Array.from({ length: 7 }, (_, i) => {
      const dia = new Date(primerDiaSemana);
      dia.setDate(primerDiaSemana.getDate() + i);
      return dia; // Incluir todos los días, incluso de diferentes meses
    });
  
    // Validar primer y último día
    const primerDia = this.diasFiltrados[0] ?? new Date();
    const ultimoDia = this.diasFiltrados[this.diasFiltrados.length - 1] ?? new Date();
  
    // Si los días cruzan meses, asegúrate de no duplicar intervalos
    this.diasFiltrados = this.diasFiltrados.filter(
      (dia) =>
        dia !== null && // Validar que dia no sea null
        (dia.getMonth() === primerDia.getMonth() || dia.getMonth() === ultimoDia.getMonth())
    );
  
    // Construir el nombre del intervalo
    const diaInicio = primerDia.getDate();
    const mesInicio = this.obtenerNombreMes(primerDia.getMonth());
    const diaFin = ultimoDia.getDate();
    const mesFin = this.obtenerNombreMes(ultimoDia.getMonth());
  
    if (primerDia.getMonth() !== ultimoDia.getMonth()) {
      // Caso en que la semana cruza a otro mes
      this.nombreMes = `${diaInicio} de ${mesInicio} - ${diaFin} de ${mesFin}`;
    } else {
      // Caso en que la semana está dentro del mismo mes
      this.nombreMes = `${diaInicio} - ${diaFin} de ${mesInicio}`;
    }
  
    console.log(`Título actualizado: ${this.nombreMes}`); // Verificar en la consola
  }
  
  obtenerNombreMes(mesIndex: number): string {
    const nombresMeses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return nombresMeses[mesIndex];
  }

  mesAnterior() {
    if (this.mesActual === 0) {
      this.mesActual = 11;
      this.añoActual -= 1;
    } else {
      this.mesActual -= 1;
    }
    this.generarDiasDelAnio();
    this.semanaActual = 0;
    this.filtrarPorMes();
  }

  mesSiguiente() {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.añoActual += 1;
    } else {
      this.mesActual += 1;
    }
    this.generarDiasDelAnio();
    this.semanaActual = 0;
    this.filtrarPorMes();
  }

  siguienteSemana() {
    const primerDiaMes = new Date(this.añoActual, this.mesActual, 1);
    const diasDelMes = new Date(this.añoActual, this.mesActual + 1, 0).getDate();
    const totalSemanas = Math.ceil(diasDelMes / 7);

    if (this.semanaActual < totalSemanas - 1) {
      this.semanaActual++;
    } else {
      this.semanaActual = 0;
      this.mesSiguiente();
    }
    this.filtrarPorSemana();
  }

  anteriorSemana() {
    if (this.semanaActual > 0) {
      this.semanaActual--;
    } else {
      this.mesAnterior();
      this.semanaActual = 4;
    }
    this.filtrarPorSemana();
  }
  crearReunion(): void {
    this.router.navigate(['/crear-reuniones']);
  }

  cambiarPeriodo(direccion: 'anterior' | 'siguiente') {
    if (this.vista === 'mes') {
      // Cambiar por mes
      direccion === 'anterior' ? this.mesAnterior() : this.mesSiguiente();
    } else if (this.vista === 'semana') {
      // Cambiar por semana
      direccion === 'anterior' ? this.anteriorSemana() : this.siguienteSemana();
    }
  }

  
  getColor(clase: string | undefined): string {
    if (!clase) {
      return 'transparent'; // Devuelve transparente si no hay clase
    }
    const colores: Record<string, string> = {
      'reunion-organizador': '#ef6c00',
    
      'reunion-asistente': '#4285f4',
    };
    return colores[clase] || 'transparent';
  }

  // Obtener color de la línea según el estado de la reunión
  getEstadoColor(estado: string | undefined): string {
    if (!estado) {
      return 'transparent';
    }
    const coloresEstado: Record<string, string> = {
      abierta: '#28a745', // Verde
      cerrada: '#6c757d', // Gris
      realizada: '#ebfe44', // Azul
      cancelada: '#dc3545', // Rojo
    };
    return coloresEstado[estado] || 'transparent';
  }
  
  
  // Ajustar cuadro reunión a la franja horaria correspondiente en la vista semanal
  calcularPosicionReunion(horaInicio: string): number {
    const inicio = new Date(horaInicio);
    const horas = inicio.getHours();
    const minutos = inicio.getMinutes();
    return horas * 60 + minutos; // Posición en minutos desde la medianoche
  }
  
  calcularAlturaReunion(horaInicio: string, horaFin: string): number {
    const inicio = new Date(horaInicio);
    const fin = new Date(horaFin);
    const duracionMinutos = (fin.getTime() - inicio.getTime()) / 60000; // Duración en minutos
    return duracionMinutos;
  }

  navigateTo(route: string, dia: Date): void {
    setTimeout(() => {
      this.router.navigate([route], { queryParams: { fecha: dia.toISOString() } });
    }, 1000);
  }
}