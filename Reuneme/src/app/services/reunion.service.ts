import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpUrl } from '../commons';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {
//esto luego se borra es por hacer pruebas que no me va el back 
private reunionesMock = [
  {
    id: 1,
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 9, 0).toISOString(),
    fin: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 10, 0).toISOString(),
    creador: 'organizador',
    asistencia: 'asistida',
    asunto: "Reunión de prueba",
    asistente: ['USUARIO_ACTUAL'],
  },
  {
    id: 2,
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 10, 15).toISOString(),
    fin: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 11, 15).toISOString(),
    creador: 'organizador',
    asistencia: 'no-asistida',
    asunto: "Seguimiento del proyecto",
    asistente: ['otro_usuario'],
  },
  {
    id: 3,
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 12, 0).toISOString(),
    fin: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 13, 0).toISOString(),
    creador: 'otro_usuario',
    asistencia: 'asistida',
    asunto: "Planificación mensual",
    asistente: ['USUARIO_ACTUAL'],
  },
  {
    id: 4,
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 13, 30).toISOString(),
    fin: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 14, 30).toISOString(),
    creador: 'organizador',
    asistencia: 'asistida',
    asunto: "Revisión de tareas",
    asistente: ['otro_usuario'],
  },
  {
    id: 5,
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 15, 0).toISOString(),
    fin: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 16, 0).toISOString(),
    creador: 'organizador',
    asistencia: 'no-asistida',
    asunto: "Evaluación de desempeño",
    asistente: ['USUARIO_ACTUAL'],
  },
  {
    id: 6,
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 16, 30).toISOString(),
    fin: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 17, 30).toISOString(),
    creador: 'otro_usuario',
    asistencia: 'asistida',
    asunto: "Cierre del trimestre",
    asistente: ['USUARIO_ACTUAL'],
  },
  {
    id: 7,
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 19, 13, 0).toISOString(),
    fin: new Date(new Date().getFullYear(), new Date().getMonth(), 19, 15, 0).toISOString(),
    creador: 'organizador',
    asunto: "Reunión de prototipo",
    asistencia: 'no-asistida',
    asistente: ['otro_usuario'],
  },
  {
    id: 8,
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 11, 0).toISOString(),
    fin: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 12, 0).toISOString(),
    creador: 'otro_usuario',
    asistencia: 'asistida',
    asistente: ['USUARIO_ACTUAL'],
  },
  {
    id: 9,
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 16, 0).toISOString(),
    fin: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 17, 0).toISOString(),
    creador: 'organizador',
    asunto: "Testing",
    asistencia: 'asistida',
    asistente: ['otro_usuario'],
  },
];

  private fechaSeleccionada: string = '';

  constructor(private client: HttpClient) { }

  private getHeaders(withAuth: boolean = true): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (withAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      } else {
        throw new Error('Token no encontrado.');
      }
    }
    return headers;
  }
  

  getReunionById(reunionId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.client.post(`${httpUrl}empleados/reunion/${reunionId}/ver`,{}, { headers });
  }

  crearReunion(
    organizador: string,
    asunto: string,
    horaDesde: string,
    horaHasta: string,
    ubicacion: string,
    observaciones: string,
    estado: string
): Observable<any> {
    const headers = this.getHeaders();
    const info = {
        organizador: organizador,
        asunto: asunto,
        inicio: horaDesde,
        fin: horaHasta,
        ubicacion: ubicacion,
        observaciones: observaciones,
        estado: estado
    };
    console.log("Token enviado en Authorization:", headers.get('Authorization'));
    return this.client.post(`${httpUrl}empleados/reunion`, info, { headers });
}

  updateReunion(id: any, reunionData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.client.put(`${httpUrl}empleados/reunion/${id}/modificar`, reunionData, { headers });
  }

  cerrarReunion(idReunion: any): Observable<any> {
    const headers = this.getHeaders();
    return this.client.put(`${httpUrl}empleados/reunion/${idReunion}/cerrar`, { },{ headers });
  }

  addAsistente(idReunion: any, idUsuario: any): Observable<any> {
    const headers = this.getHeaders();
    return this.client.post(`${httpUrl}empleados/reunion/${idReunion}/asistente/${idUsuario}`, {},{ headers });
  }

  deleteAsistente(idReunion: any, idUsuario: any): Observable<any> {
    const headers = this.getHeaders();
    return this.client.delete(`${httpUrl}empleado/reunion/${idReunion}/asistente/${idUsuario}`, { headers });
  }

  getPosiblesAsistentes(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.client.get<[]>(`${httpUrl}empleados/reunion/asistentes`, { headers });
  }

  setFechaSeleccionada(fecha: string): void {
    this.fechaSeleccionada = fecha;
  }

  getFechaSeleccionada(): string | null {
    return this.fechaSeleccionada;
  }
  //esto tambien se borra 

  obtenerReunionesMock() {
    return this.reunionesMock;
  }
}

