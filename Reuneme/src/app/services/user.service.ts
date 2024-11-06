import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpUrl } from '../commons'; // Asegúrate de que `httpUrl` esté definido

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private client: HttpClient) { }

    // Método login con headers y URL base
    login(user: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.client.put(`${httpUrl}users/login`, user, { headers, responseType: 'text' });
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
        console.log(info);

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
    forgotPassword(email: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const body = new URLSearchParams();
        body.set('email', email);
        return this.client.post(`${httpUrl}pwd/forgot`, body.toString(), { headers, responseType: 'text' });
    }
    validateToken(token: string): Observable<any> {
        return this.client.get(`${httpUrl}pwd/reset?token=${token}`, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        });
    }
    resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = {
            token: token,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        };
        return this.client.post(`${httpUrl}pwd/reset`, body, { headers, responseType: 'text' });
    }

    // Método para actualizar un administrador existente
    updateAdmin(adminData: any, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.client.put(`${httpUrl}admins/modificarAdministrador`, adminData, { headers });
    }

    // Método para actualizar un empleado existente
    updateEmpleado(empleadoData: any, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.client.put(`${httpUrl}admins/modificarEmpleado`, empleadoData, { headers });
    }

    verDatosEmpleado(email: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        // Pasar el email como parámetro en la URL
        return this.client.get(`${httpUrl}empleados/verDatos?email=${email}`, { headers });
    }
    
    verDatosAdmin(email: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.client.get(`${httpUrl}admins/verDatos?email=${email}`, { headers });
    }
    

    // Método para obtener todos los emails (solo para administradores) (GET /users/emails)
    getAllUsers(token: string): Observable<any[]> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this.client.get<any[]>(`${httpUrl}admins/all`, { headers });
    }
    deleteUserByEmail(email: string, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        const body = { email: email }; // Email en el cuerpo de la solicitud en formato JSON
        return this.client.delete(`${httpUrl}admins/borrarEmpleado`, { headers, body });
    }
    
    blockUserByEmail(email: string, bloquear: boolean, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        
        // Agregamos los parámetros email y bloquear directamente en la URL
        return this.client.put(`${httpUrl}admins/cambiarEstadoBloqueo?email=${email}&bloquear=${bloquear}`, null, { headers });
    }
    verifyUserByEmail(email: string, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        const body = { email: email }; // JSON con el email
    
        return this.client.put(`${httpUrl}admins/verificarEmpleado`, body, { headers });
    }
    getAusencias(token: string): Observable<any[]> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this.client.get<any[]>(`${httpUrl}ausencias`, { headers });
    }

    // Añadir una nueva ausencia
    addAusencia(ausencia: any, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this.client.post(`${httpUrl}ausencias`, ausencia, { headers });
    }

    // Eliminar una ausencia por ID
    deleteAusencia(id: number, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this.client.delete(`${httpUrl}ausencias/${id}`, { headers });
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
}
