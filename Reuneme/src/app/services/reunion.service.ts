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
    return this.client.put(`${httpUrl}empleado/reunion/${id}/modificar`, reunionData, { headers });
  }

  cerrarReunion(idReunion: any): Observable<any> {
    const headers = this.getHeaders();
    return this.client.put(`${httpUrl}empleados/reunion/${idReunion}/cerrar`, { headers });
  }

  addAsistente(idReunion: any, idUsuario: any): Observable<any> {
    const headers = this.getHeaders();
    return this.client.post(`${httpUrl}empleado/reunion/${idReunion}/asistente/${idUsuario}`, { headers });
  }

  deleteAsistente(idReunion: any, idUsuario: any): Observable<any> {
    const headers = this.getHeaders();
    return this.client.delete(`${httpUrl}empleado/reunion/${idReunion}/asistente/${idUsuario}`, { headers });
  }

  getPosiblesAsistentes(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.client.get<any[]>(`${httpUrl}empleado/reunion/asistentes`, { headers });
  }

  setFechaSeleccionada(fecha: string): void {
    this.fechaSeleccionada = fecha;
  }

  getFechaSeleccionada(): string | null {
    return this.fechaSeleccionada;
  }
}
