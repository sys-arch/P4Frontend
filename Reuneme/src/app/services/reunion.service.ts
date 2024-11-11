import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpUrl } from '../commons';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {

  constructor(private client: HttpClient) { }

  getReunionById(reunionId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    return this.client.get(`${httpUrl}empleados/reunionByID/${reunionId}`, { headers });
  }

  // Método para obtener todos los emails 
  getAllUsers(): Observable<any[]> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    return this.client.get<any[]>(`${httpUrl}admins/listaEmpleados`, { headers });
}

  crearReunion(
    asunto: string,
    fecha: string,
    todoElDia: boolean,
    horaDesde: string,
    horaHasta: string,
    ubicacion: string,
    observaciones: string
): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const info = {
        asunto: asunto,
        fecha: fecha,
        todoElDia: todoElDia,
        horaDesde: horaDesde,
        horaHasta: horaHasta,
        ubicacion: ubicacion,
        observaciones: observaciones
    };
    return this.client.post(`${httpUrl}empleados/reunion`, info, { headers, responseType: 'text' });
}

  updateReunion(id: any, reunionData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.client.put(`${httpUrl}empleado/reunion/${id}/modificar`, reunionData, { headers });
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
}
