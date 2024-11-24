import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpUrl } from '../commons'; // Asegúrate de que `httpUrl` esté definido

@Injectable({
    providedIn: 'root'
})

export class AusenciaService {
    constructor(private client: HttpClient) { }
    // Método para añadir una nueva ausencia
    addAusencia(email: string, ausencia: any): Observable<any> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        console.log(token);
        console.log(ausencia);
        const url = `${httpUrl}admins/anadirAusencia?email=${email}`;
    
        return this.client.put(url, ausencia, { headers });
    }

    // Método para obtener todas las ausencias
    getTodasLasAusencias(): Observable<any[]> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.client.get<any[]>(`${httpUrl}admins/todasAusencias`, { headers });
    }

    // Método para eliminar una ausencia por ID
    deleteAusencia(id: string): Observable<any> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.client.delete(`${httpUrl}admins/eliminarAusencia/${id}`, { headers });
    }

    // Método para verificar conflictos de reuniones
    verificarReunion(email: string, inicio: string, fin: string): Observable<boolean> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        });

        // Formatear las fechas al formato esperado por LocalDateTime
        const formatDateTime = (date: string): string => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato 2 dígitos
            const day = d.getDate().toString().padStart(2, '0'); // Día en formato 2 dígitos
            const hours = d.getHours().toString().padStart(2, '0'); // Hora en formato 2 dígitos
            const minutes = d.getMinutes().toString().padStart(2, '0'); // Minutos en formato 2 dígitos
            const seconds = d.getSeconds().toString().padStart(2, '0'); // Segundos en formato 2 dígitos

            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };

        const body = {
        email: email,
        inicio: formatDateTime(inicio),
        fin: formatDateTime(fin),
        };

        return this.client.put<boolean>(`${httpUrl}admins/comprobarReuniones`, body, { headers });
    }
}