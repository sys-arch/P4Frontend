import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class RoleGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole = route.data['role']; // Obtiene el rol esperado desde la configuración de rutas
        const userRole = this.authService.getRole(); // Obtiene el rol del usuario desde el servicio de autenticación

        if (this.authService.isAuthenticated() && userRole === expectedRole) {
        return true; // Permite acceso si el usuario tiene el rol esperado
        } else {
        this.router.navigate(['/login']); // Redirige al login si no está autorizado
            return false;
        }
    }
}
