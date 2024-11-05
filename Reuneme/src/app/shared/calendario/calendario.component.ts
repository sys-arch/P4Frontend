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
  diasFiltrados: Date[] = [];
  vista: 'mes' | 'semana' = 'mes';
  nombreMes: string = '';
  mesActual: number = new Date().getMonth();
  añoActual: number = new Date().getFullYear();
  semanaActual: number = 0; // Controla la semana actual

  ngOnInit() {
    this.generarDiasDelAnio();
    this.aplicarFiltro();
  }

  generarDiasDelAnio() {
    // Generar todos los días del año actual
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
    this.diasFiltrados = this.diasDelAnio.filter(
      dia => dia.getMonth() === this.mesActual && dia.getFullYear() === this.añoActual
    );
    this.nombreMes = `${this.obtenerNombreMes(this.mesActual)} ${this.añoActual}`;
    this.semanaActual = 0; // Reiniciar la semana actual al cambiar la vista de mes
  }

  filtrarPorSemana() {
    this.vista = 'semana';
    const primerDiaMes = new Date(this.añoActual, this.mesActual, 1);
    const primerDiaSemana = new Date(primerDiaMes);
    primerDiaSemana.setDate(primerDiaMes.getDate() + this.semanaActual * 7);

    const finSemana = new Date(primerDiaSemana);
    finSemana.setDate(primerDiaSemana.getDate() + 6);

    // Filtrar los días de la semana en curso
    this.diasFiltrados = this.diasDelAnio.filter(
      dia => dia >= primerDiaSemana && dia <= finSemana
    );
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
    this.generarDiasDelAnio(); // Regenera los días al cambiar de año
    this.semanaActual = 0; // Reiniciar la semana al cambiar el mes
    this.filtrarPorMes();
  }

  mesSiguiente() {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.añoActual += 1;
    } else {
      this.mesActual += 1;
    }
    this.generarDiasDelAnio(); // Regenera los días al cambiar de año
    this.semanaActual = 0; // Reiniciar la semana al cambiar el mes
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
      this.mesSiguiente(); // Cambiar al mes siguiente y reiniciar semana
    }
    this.filtrarPorSemana();
  }

  anteriorSemana() {
    if (this.semanaActual > 0) {
      this.semanaActual--;
    } else {
      this.mesAnterior(); // Cambia al mes anterior
      this.semanaActual = 4; // Cambiar a la última semana
    }
    this.filtrarPorSemana();
  }

  abrirModalReunion(dia: Date) {
    // Lógica para abrir el modal o navegar al componente de creación de reuniones
    console.log(`Crear reunión para el día: ${dia}`);
  }
}