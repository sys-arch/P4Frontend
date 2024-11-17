import { HttpClient , HttpHeaders} from '@angular/common/http';
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
    asunto:"reunion de prueba",
    asistente: ['USUARIO_ACTUAL'],
  },
  {
    id: 2,
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 19, 13, 0).toISOString(),
    fin: new Date(new Date().getFullYear(), new Date().getMonth(), 10, 15, 0).toISOString(),
    creador: 'organizador',
    asunto:"reunion de prototipo",
    asistencia: 'no-asistida',
    asistente: ['otro_usuario'],
  },
  {
    id: 3,
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 11, 0).toISOString(),
    fin: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 12, 0).toISOString(),
    creador: 'otro_usuario',
    asistencia: 'asistida',
    asistente: ['USUARIO_ACTUAL'],
  },
  {
    id: 4,
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 16, 0).toISOString(),
    fin: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 17, 0).toISOString(),
    creador: 'organizador',
    asunto:"testing",
    asistencia: 'asistida',
    asistente: ['otro_usuario'],
  },
];
  private fechaSeleccionada: string = '';

  constructor(private client: HttpClient) { }

  getReunionById(reunionId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return this.client.get(`${httpUrl}empleados/reunion/${reunionId}/ver`, { headers });
  }

  // Método para obtener todos los emails 
  getAllUsers(): Observable<any[]> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    return this.client.get<any[]>(`${httpUrl}admins/listaEmpleados`, { headers });
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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const info = {
        organizador: organizador,
        asunto: asunto,
        inicio: horaDesde,
        fin: horaHasta,
        ubicacion: ubicacion,
        observaciones: observaciones,
        estado: estado
    };
    return this.client.post(`${httpUrl}empleados/reunion`, info, { headers, responseType: 'text' });
}

  updateReunion(id: any, reunionData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.client.put(`${httpUrl}empleado/reunion/${id}/modificar`, reunionData, { headers });
  }

  cerrarReunion(idReunion: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.client.put(`${httpUrl}empleados/reunion/${idReunion}/cerrar`, { headers });
  }

  addAsistente(idReunion: any, idUsuario: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.client.post(`${httpUrl}empleado/reunion/${idReunion}/asistente/${idUsuario}`, { headers });
  }

  deleteAsistente(idReunion: any, idUsuario: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.client.delete(`${httpUrl}empleado/reunion/${idReunion}/asistente/${idUsuario}`, { headers });
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

