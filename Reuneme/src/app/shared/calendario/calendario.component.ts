import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


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
    const primerDiaMes = new Date(this.añoActual, this.mesActual, 1);
    const primerDiaSemana = new Date(primerDiaMes);
    primerDiaSemana.setDate(primerDiaMes.getDate() + this.semanaActual * 7);

    const finSemana = new Date(primerDiaSemana);
    finSemana.setDate(primerDiaSemana.getDate() + 6);

    this.diasFiltrados = Array(7).fill(null); // Rellenar inicialmente con null
    this.diasDelAnio.forEach((dia) => {
      if (dia >= primerDiaSemana && dia <= finSemana) {
        const dayOfWeek = dia.getDay() === 0 ? 6 : dia.getDay() - 1;
        this.diasFiltrados[dayOfWeek] = dia;
      }
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

  abrirModalReunion(dia: Date) {
    console.log(`Crear reunión para el día: ${dia}`);
  }
}
