import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { httpUrl } from '../commons'; // Asegúrate de que `httpUrl` esté definido

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private client: HttpClient) { }
    
    login(user: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.client.put(`${httpUrl}users/login`, user, { headers }).pipe(
          catchError((error: HttpErrorResponse) => {
            // Propagar el error para manejarlo en el componente
            return throwError(() => error);
          })
        );
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
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
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
        return this.client.post(`${httpUrl}admins/register`, info, { headers });
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
    updateAdmin(adminData: any): Observable<any> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    
        // Enviar adminData directamente en el cuerpo de la solicitud
    
        return this.client.put(`${httpUrl}admins/modificarAdministrador`, adminData, { headers });
    }

    // Método para actualizar un empleado existente
    updateEmpleado(empleadoData: any): Observable<any> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

         // Enviar adminData directamente en el cuerpo de la solicitud

        // Usar el email como parámetro en la URL
        return this.client.put(`${httpUrl}admins/modificarEmpleado`, empleadoData, { headers });
    }

    verDatosEmpleado(email: string): Observable<any> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        // Imprimir el valor del token directamente antes de la solicitud
        return this.client.get(`${httpUrl}empleados/verDatos?email=${email}`, { headers });
    }

    verDatosAdmin(email: string): Observable<any> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.client.get(`${httpUrl}admins/verDatos?email=${email}`, { headers });
    }


    // Método para obtener todos los emails (solo para administradores) (GET /users/emails)
    getAllUsers(token: string): Observable<any[]> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Agregamos "Bearer " antes del token
        });
        return this.client.get<any[]>(`${httpUrl}admins/all`, { headers });
    }
    

    deleteUserByEmail(email: string, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        const body = { email: email }; // Email en el cuerpo de la solicitud en formato JSON
        return this.client.delete(`${httpUrl}admins/borrarEmpleado`, { headers, body });
    }

    blockUserByEmail(email: string, bloquear: boolean, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        // Agregamos los parámetros email y bloquear directamente en la URL
        return this.client.put(`${httpUrl}admins/cambiarEstadoBloqueo?email=${email}&bloquear=${bloquear}`, null, { headers });
    }
    verifyUserByEmail(email: string, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        const body = { email: email }; // JSON con el email

        return this.client.put(`${httpUrl}admins/verificarEmpleado`, body, { headers });
    }
    getAusencias(): Observable<any[]> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.client.get<any[]>(`${httpUrl}ausencias`, { headers });
    }
    

    // Añadir una nueva ausencia con token en Authorization
    addAusencia(ausencia: any, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.client.post(`${httpUrl}ausencias`, ausencia, { headers });
    }

    // Eliminar una ausencia por ID con token en Authorization
    deleteAusencia(id: number, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.client.delete(`${httpUrl}ausencias/${id}`, { headers });
    }

    // Obtener el rol de un usuario por email
    getUserRoleByEmail(email: string, token: string): Observable<{ role: string }> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        return this.client.get<{ role: string }>(`${httpUrl}admins/getUserRoleByEmail?email=${email}`, { headers });
    }

    desactivar2FA(email: string, secretKey: string): Observable<any> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        const body = {
            email: email,
            clavesecreta: secretKey,
            twoFA: false
        };

        // Llamada al backend para desactivar el 2FA
        return this.client.put(`${httpUrl}users/desactivar-2fa`, body, { headers });
    }
}
