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
  profileForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    // Aquí puedes manejar la carga de archivos (por ejemplo, mostrar la imagen seleccionada)
    console.log(file);
  }

  onSubmit() {
    this.submitted = true;
    if (this.profileForm.valid) {
      console.log('Profile data:', this.profileForm.value);
      // Aquí puedes manejar la lógica para guardar el perfil
    }
  }
}
