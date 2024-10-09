import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpUrl } from '../commons'; // Asegúrate de que `httpUrl` esté definido

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private readonly client: HttpClient) {}

    // Ajuste: Método login con headers y URL base
    login(user: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.client.post<any>(`${httpUrl}users/login`, user, { headers });
    }

    register(nombre: string, apellido: string, email: string, centro: string, fechaAlta: string, perfilLaboral: string, password1: string): Observable<any> {
        let info = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        centro: centro,
        fechaAlta: fechaAlta,
        perfilLaboral: perfilLaboral,
        password1: password1
            }
        
        return this.client.post("http://localhost:4200/registro", info)
    }
}
