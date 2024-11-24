import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
        return true; // Permite el acceso si el token es válido
        } else {
        this.router.navigate(['/login']); // Redirige al login si no está autenticado
        return false;
        }
    }
}
@Injectable({
    providedIn: 'root',
})
export class AuthGuardMini implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
        if (this.authService.isAuthenticatedMini()) {
            return true; // Permitir acceso si está autenticado sin requerir 2FA
        } else {
            this.router.navigate(['/login']); // Redirigir al login si no está autenticado
            return false;
        }
    }
}
