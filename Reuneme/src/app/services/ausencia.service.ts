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
}