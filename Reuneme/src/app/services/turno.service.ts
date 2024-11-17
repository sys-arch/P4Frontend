import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpUrl } from '../commons'; // Asegúrate de que httpUrl esté definido y apunte a tu backend

@Injectable({
    providedIn: 'root',
})
export class TurnoService {
    constructor(private client: HttpClient) {}

    // Método para añadir un nuevo turno
    addTurno(turno: any): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        });
        console.log(token);
        console.log(turno);
        const url = `${httpUrl}admins/anadirTurno`;
        

        return this.client.post(url, turno, { headers });
    }

    // Método para obtener todos los turnos
    getTodosLosTurnos(): Observable<any[]> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        });
        const url = `${httpUrl}admins/turnos`;
        console.log(token);
        console.log(url);

        return this.client.post<any[]>(url, {}, { headers });
    }
}
