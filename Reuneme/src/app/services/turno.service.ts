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
    addTurnos(turnos: any[]): Observable<any> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        });
        console.log('Token:', token);
        console.log('Turnos a añadir:', turnos);
        
        const url = `${httpUrl}admins/anadirTurnos`;
        
        // Enviar la lista de turnos en el cuerpo de la solicitud
        return this.client.post(url, turnos, { headers });
    }
    

    // Método para obtener todos los turnos
    getTodosLosTurnos(): Observable<any[]> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        });
        const url = `${httpUrl}admins/turnos`; // Asegúrate de que httpUrl sea tu URL base correcta
        console.log(token);
        console.log(url);
    
        // Cambia `post` por `get`
        return this.client.get<any[]>(url, { headers });
    }
    
}
