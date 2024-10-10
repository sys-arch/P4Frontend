import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  imports: [CommonModule,FormsModule,ReactiveFormsModule] // Importaciones necesarias para el uso de ngModel
})


export class PerfilComponent implements OnInit {
  
  admin = {
    nombre: 'Nombre de Administrador',
    apellidos: 'Apellidos de Administrador',
    correo: 'admin@correo.com',
    centroTrabajo: 'Centro de Trabajo',
    interno: false
  };

  profilePicture: string | ArrayBuffer | null = null;

  constructor() {}

  ngOnInit(): void {
    // Método llamado al inicializar el componente
    // Si no tienes lógica específica aquí, lo puedes dejar vacío
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.profilePicture = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }
}