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

    register(nombre: string, apellido: string, email: string, centro: string, fechaAlta: string, perfilLaboral: string, password1: string,isVerified:boolean): Observable<any> {
        let info = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        centro: centro,
        fechaAlta: fechaAlta,
        perfilLaboral: perfilLaboral,
        password1: password1,
        isVerified: isVerified//recordad que ahora mismo aqui no esta verificado, esta a false
            }
        
        return this.client.post("http://localhost:4200/registro", info)
    }

    */
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
        const info = {
            nombre: nombre,
            apellido1: apellido1,
            apellido2: apellido2,
            email: email,
            centro: centro,
            password1: password1,
            password2: password2,
            interno: interno
        };
    
        return this.client.post("http://localhost:4200/registro-admin", info);
    }
    }
