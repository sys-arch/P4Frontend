import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule] ,// Importaciones necesarias para el uso de ngModel
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent {
 
  user = {
    nombre: 'Nombre de usuario',
    apellidos: 'Apellidos de usuario',
    correo: 'user@correo.com',
    depart: 'Departamento',
    centroTrabajo: 'Centro de Trabajo',
    alta: 'Fecha de alta',
    perfil: 'Perfil'
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
