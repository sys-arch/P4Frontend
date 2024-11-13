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

  constructor(
    private readonly router: Router,
    private readonly reunionService: ReunionService
  )  { }

  ngOnInit() {
    this.generarDiasDelAnio();
    this.aplicarFiltro();
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

  abrirModalReunion(dia: Date): void {
    // Usar Intl.DateTimeFormat para convertir la fecha a la zona horaria de España
    const formatter = new Intl.DateTimeFormat("es-ES", {
      timeZone: "Europe/Madrid",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    const formattedDate = formatter.format(dia);
    const fechaFormateada = formattedDate.split(',')[0].split('/').reverse().join('-');
    this.reunionService.setFechaSeleccionada(fechaFormateada);
    this.router.navigate(['/crear-reuniones']);
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
