import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpUrl } from '../commons';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {
  constructor(private client: HttpClient) { }

  private getHeaders(withAuth: boolean = true): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (withAuth) {
      const token = sessionStorage.getItem('token');
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
    return this.client.post(`${httpUrl}empleados/reunion`, info, { headers });
}

  updateReunion(id: any, reunionData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.client.put(`${httpUrl}empleados/reunion/${id}/modificar`, reunionData, { headers });
  }

  cancelarReunion(idReunion: any): Observable<any> {
    const headers = this.getHeaders();
    return this.client.put(`${httpUrl}empleados/reunion/${idReunion}/cancelar`, { },{ headers });
  }

  getReunionesAsistidas(email: string): Observable<any[]> {

    const headers = this.getHeaders();
    const payload = { email: email }; // Crear el cuerpo de la petición
    return this.client.put<any[]>(`${httpUrl}empleados/reunion/asiste`, payload, { headers });
  }

  getReunionesOrganizadas(email: string): Observable<any[]> {
    const headers = this.getHeaders();
    const payload = { email: email }; // Crear el cuerpo de la petición
    return this.client.put<any[]>(`${httpUrl}empleados/reunion/organizador`, payload, { headers });
  }
  getReunionesPendientes(email: string): Observable<any[]> {
    const headers = this.getHeaders(); // Ya incluye el token
    const payload = { email: email };
  
    return this.client.put<any[]>(`${httpUrl}empleados/reunion/asiste-pendiente`, payload, { headers });
  }
  actualizarEstadoAsistencia(
    idReunion: string,
    idUsuario: string,
    estado: 'ACEPTADA' | 'RECHAZADA'
  ): Observable<any> {
    const headers = this.getHeaders();
    const params = { estado }; // Agregar el estado como parámetro
    return this.client.put(
      `${httpUrl}empleados/reunion/${idReunion}/asistente/${idUsuario}/estado`,
      {},
      { headers, params }
    );
  }
  getAsistenteByEmail(idReunion: string, email: string): Observable<any> {
    const headers = this.getHeaders(); // Incluye el token en los headers
    const params = { email }; // Envía el correo como parámetro de consulta
    return this.client.get<any>(`${httpUrl}empleados/reunion/${idReunion}/asistente`, { headers, params });
  }
  

}

