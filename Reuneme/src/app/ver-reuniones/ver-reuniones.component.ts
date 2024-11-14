import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from "../shared/loader/loader.component";
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { ReunionService } from '../services/reunion.service';


@Component({
  selector: 'app-ver-reuniones',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, FooterComponent, HeaderComponent],
  templateUrl: './ver-reuniones.component.html',
  styleUrl: './ver-reuniones.component.css'
})
export class VerReunionesComponent implements OnInit{

  isLoading: boolean=false;
  organizador: string = '';
  asunto: string = '';
  fecha: string = '';
  todoElDia: boolean = false;
  horaDesde: string = '';
  horaHasta: string = '';
  ubicacion: string = '';
  observaciones: string = '';
  estado: string = '';
  reunionData: any;


  constructor(
    private readonly router: Router,
    private readonly reunionService: ReunionService
  ) {}

ngOnInit(): void {
  this.getReunion('1');
}

getReunion (reunionId: string): void {
  this.reunionService.getReunionById(reunionId).subscribe({
    next: (data) => {
      this.reunionData = data; // Asignar todos los datos obtenidos
        this.organizador = data.organizador?.email || '';
    },
    error: (error) => {
      console.error('Error al obtener la reunion', error);
    }

  })

}

deleteReunion() {
  throw new Error('Method not implemented.');
}

navigateTo(route: string): void {
  this.isLoading = true;
  setTimeout(() => {
    this.isLoading = false;
    this.router.navigate([route]);
  }, 1000);
}

}
