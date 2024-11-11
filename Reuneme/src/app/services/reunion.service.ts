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
    return this.client.get(`${httpUrl}/${reunionId}`, { headers });
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
    return this.client.post(`${httpUrl}users/crearReunion`, info, { headers, responseType: 'text' });
}

  updateReunion(reunionData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });

    return this.client.put(`${httpUrl}/reunion/modificarReunion`, reunionData, {headers});
  }
}
