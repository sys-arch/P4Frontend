import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
    })
    export class AuthService {
    private userRole: 'admin' | 'user' = 'user';  // Valor por defecto es 'user'

    constructor() { }

    // Simular la obtención del rol del usuario, podría ser una API en un futuro
    getRole(): 'admin' | 'user' {
        return this.userRole;
    }

    // Cambiar el rol del usuario, podrías obtener esto de una autenticación real
    setRole(role: 'admin' | 'user'): void {
        this.userRole = role;
    }
}
