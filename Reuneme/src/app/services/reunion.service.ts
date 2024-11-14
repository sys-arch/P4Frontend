import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpUrl } from '../commons';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {

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
}
