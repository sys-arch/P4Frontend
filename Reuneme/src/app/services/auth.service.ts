import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly TOKEN_KEY = 'token'; // Clave para almacenar el token en el almacenamiento local
    private userRole: 'admin' | 'employee' = 'employee'; // Valor por defecto
    private email: string = '';

    constructor() {}

    // Verificar si el usuario está autenticado basado en la validez del token
    isAuthenticatedMini(): boolean {
        const token = this.getToken();
        if (!token) {
        return false; // No hay token, no está autenticado
        }

        try {
        const payload = this.decodeToken(token);
        const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
        return payload.exp > currentTime; // Retorna true si el token no ha expirado
        } catch (error) {
        console.error('Error al decodificar el token:', error);
        return false; // Token inválido
        }
    }
    isAuthenticated(): boolean {
        const token = this.getToken();
        const is2FAEnabled = sessionStorage.getItem('2f') === 'true';

        if (!token || !is2FAEnabled) {
          return false; // No está autenticado si falta el token o el 2FA
        }
    
        try {
            const payload = this.decodeToken(token);
            const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
            return payload.exp > currentTime; // Token válido si no ha expirado
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                return false; // Token inválido
            }
    }


    // Decodifica el payload del token
    private decodeToken(token: string): any {
        const payloadBase64 = token.split('.')[1]; // Extraer la parte del payload
        const payloadDecoded = atob(payloadBase64); // Decodificar Base64
        return JSON.parse(payloadDecoded); // Convertir a JSON
    }

    // Obtén el token del localStorage
    getToken(): string | null {
        return sessionStorage.getItem(this.TOKEN_KEY);
    }

    // Guarda el token en el localStorage
    saveToken(token: string): void {
        sessionStorage.setItem(this.TOKEN_KEY, token);
    }

    // Elimina el token (logout)
    logout(): void {
        sessionStorage.removeItem(this.TOKEN_KEY);
    }

    // Obtener el rol del usuario desde el token o una API en el futuro
    getRole(): 'admin' | 'employee' {
        const token = this.getToken();
        if (token) {
            try {
                const payload = this.decodeToken(token);
                // Extrae el rol del token y normaliza a minúsculas
                const role = payload.role?.toLowerCase() || 'employee'; // Predeterminado a 'employee' si no hay rol
                // Asegúrate de devolver un rol válido ('admin' o 'employee')
                this.userRole = role === 'admin' ? 'admin' : 'employee';
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                this.userRole = 'employee'; // Valor predeterminado en caso de error
            }
        }
        return this.userRole;
    }
    
    

    // Cambiar el rol del usuario (simulación)
    setRole(role: 'admin' | 'employee'): void {
        this.userRole = role;
    }

    // Método para guardar el correo del usuario
    setEmail(email: string): void {
        this.email = email;
    }

    // Método para obtener el correo del usuario
    getEmail(): string {
        return this.email;
    }
}

