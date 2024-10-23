import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpUrl } from '../commons'; // Asegúrate de que `httpUrl` esté definido

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private client: HttpClient) {}

    // Método login con headers y URL base
    login(user: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.client.post(`${httpUrl}users/login`, user, { headers, responseType: 'text' });        
    }

    // Método register con headers
    register(
        email: string, 
        password1: string, 
        password2: string,
        nombre: string, 
        apellido: string, 
        apellido2: string, 
        centro: string, 
        departamento: string, 
        perfilLaboral: string,
        fechaAlta: string, 
        bloqueado: boolean, 
        verificado: boolean 
    ): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const info = {
            email: email,
            pwd1: password1,
            pwd2: password2,
            nombre: nombre,
            apellido1: apellido,
            apellido2: apellido2,
            centro: centro,
            departamento: departamento,
            perfil: perfilLaboral,
            fechaalta: fechaAlta,
            bloqueado: bloqueado,
            verificado: verificado
        };
        
        return this.client.post(`${httpUrl}users/register`, info, { headers });
    }
    
    // Método registerAdmin con headers
    registerAdmin(
        nombre: string, 
        apellido1: string, 
        apellido2: string,
        email: string, 
        centro: string, 
        password1: string, 
        password2: string, 
        interno: boolean
    ): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const info = {
            nombre: nombre,
            apellido1: apellido1,
            apellido2: apellido2,
            email: email,
            centro: centro,
            pwd1: password1,
            pwd2: password2,
            interno: interno
        };
    
        return this.client.post(`${httpUrl}admins/register`, info, { headers, responseType: 'text' });
    }
}
