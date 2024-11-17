import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReunionService } from '../../services/reunion.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
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
  diaSeleccionado: Date | null = null;
  reuniones: any[] = [];


  constructor(
    private readonly router: Router,
    private readonly reunionService: ReunionService
  )  { }

  ngOnInit() {
    this.generarDiasDelAnio();
    this.aplicarFiltro();
    this.cargarReunionesMock(); // Llama al método para cargar los datos mock
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

  filtrarPorMes() {
    this.vista = 'mes';
    this.diasFiltrados = this.calcularDiasDelMes(this.mesActual, this.añoActual);
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
    const primerDiaSemana = new Date(this.añoActual, this.mesActual, 1 + this.semanaActual * 7);
    const diaInicioSemana = primerDiaSemana.getDay() === 0 ? 6 : primerDiaSemana.getDay() - 1;
    
    primerDiaSemana.setDate(primerDiaSemana.getDate() - diaInicioSemana);

    // Crear un array para los 7 días de la semana
    this.diasFiltrados = Array.from({ length: 7 }, (_, i) => {
      const dia = new Date(primerDiaSemana);
      dia.setDate(primerDiaSemana.getDate() + i);
      // Filtra los días que no son del mes actual
      return dia.getMonth() === this.mesActual ? dia : null;
    });

    this.nombreMes = `${this.obtenerNumeroSemana()} semana de ${this.obtenerNombreMes(this.mesActual)} ${this.añoActual}`;
  }

  obtenerNombreMes(mesIndex: number): string {
    const nombresMeses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return nombresMeses[mesIndex];
  }

  obtenerNumeroSemana(): string {
    const semanas = ['Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta'];
    return semanas[this.semanaActual] || '';
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
  crearReunion0(): void {
    // Navegar directamente a la página de creación de reuniones
    this.router.navigate(['/crear-reuniones']);
  }
  

  //borrar esto
  cargarReunionesMock() {
    this.reuniones = this.reunionService.obtenerReunionesMock();
  }
  //esto no 
  
  
  obtenerClaseReunion(dia: Date, hora: string): { clase: string, asunto?: string } | null {
    const reunion = this.reuniones.find(
      (r) =>
        new Date(r.inicio).toLocaleDateString() === dia.toLocaleDateString() &&
        new Date(r.inicio).getHours() === parseInt(hora.split(':')[0], 10)
    );
  
    if (!reunion) return null;
  
    let clase = '';
    if (reunion.creador === 'organizador') clase = 'reunion-organizador';
    else if (reunion.asistencia === 'asistida') clase = 'reunion-asistida';
    else if (reunion.asistencia === 'no-asistida') clase = 'reunion-no-asistida';
    else if (reunion.asistente.includes('USUARIO_ACTUAL')) clase = 'reunion-asistente';
  
    return { clase, asunto: reunion.asunto };
  }
  
  getColor(clase: string | undefined): string {
    if (!clase) {
      console.warn('Clase no definida, devolviendo color transparente.');
      return 'transparent'; // Por defecto, transparente si no hay clase
    }
  
    const colores: Record<string, string> = {
      'reunion-organizador': 'orange',
      'reunion-asistida': 'green',
      'reunion-no-asistida': 'gray',
      'reunion-asistente': 'blue',
    };
  
    return colores[clase] ?? 'transparent'; // Devuelve el color o transparente si no coincide
  }
  
  
  mostrarBtnCrearReunion(dia: Date) {
    this.diaSeleccionado = dia;
  }
  ocultarBtnCrearReunion() {
    this.diaSeleccionado = null;
  }
  navigateTo(route: string, dia: Date): void {
    setTimeout(() => {
      this.router.navigate([route], { queryParams: { fecha: dia.toISOString() } });
    }, 1000);
  }
}
