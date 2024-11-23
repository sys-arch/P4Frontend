import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpUrl } from '../commons';

@Injectable({
  providedIn: 'root'
})
export class AsistentesService {

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

  addAsistente(idReunion: any, EmailUsuario: any): Observable<any> {
    const headers = this.getHeaders();
    return this.client.post(`${httpUrl}empleados/reunion/${idReunion}/asistente/${EmailUsuario}`, {},{ headers });
  }

  deleteAsistente(idReunion: any, idUsuario: any): Observable<any> {
    const headers = this.getHeaders();
    return this.client.delete(`${httpUrl}empleados/reunion/${idReunion}/asistente/${idUsuario}`, { headers });
  }

  getPosiblesAsistentes(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.client.get<[]>(`${httpUrl}empleados/reunion/asistentes`, { headers });
  }

  getAsistentesPorReunion(reunionId: string): Observable<any[]> {
    const headers = this.getHeaders();
    return this.client.get<[]>(`${httpUrl}empleados/reunion/${reunionId}/asistentes`, { headers });
  }
}
