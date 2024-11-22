import { Routes } from '@angular/router';
import { ContrasenaOlvidadaComponent } from './contrasena-olvidada/contrasena-olvidada.component';
import { CrearReunionesComponent } from './crear-reuniones/crear-reuniones.component';
import { DoblefactorComponent } from './doblefactor/doblefactor.component';
import { EdicionUsuarioComponent } from './edicion-usuario/edicion-usuario.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { ModificarReunionesComponent } from './modificar-reuniones/modificar-reuniones.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { PerfilComponent } from './perfil/perfil.component';
import { RegistroAdminComponent } from './registro-admin/registro-admin.component';
import { RegistroComponent } from './registro/registro.component';
import { ResetContrasenaComponent } from './reset-contrasena/reset-contrasena.component';
import { AuthGuard, AuthGuardMini } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';
import { BuzonReunionesComponent } from './shared/buzon-reuniones/buzon-reuniones.component';
import { VentanaPrincipalComponent } from './ventana-principal/ventana-principal.component';
import { VerReunionesComponent } from './ver-reuniones/ver-reuniones.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent }, // Ruta pública
    { path: 'login', component: LoginComponent }, // Ruta pública
    { path: 'registro', component: RegistroComponent }, // Ruta pública
    { path: 'doblefactor', component: DoblefactorComponent, canActivate: [AuthGuardMini] }, // Ruta protegida
    { path: 'perfil-admin', component: PerfilComponent, canActivate: [RoleGuard], data: { role: 'admin' } }, // Solo para admin
    { path: 'perfil-usuario', component: PerfilUsuarioComponent, canActivate: [AuthGuard] }, // Ruta protegida
    { path: 'registro-admin', component: RegistroAdminComponent, canActivate: [RoleGuard], data: { role: 'admin' } }, // Solo para admin
    { path: 'ventana-principal', component: VentanaPrincipalComponent, canActivate: [AuthGuard] }, // Ruta protegida
    { path: 'contrasena-olvidada', component: ContrasenaOlvidadaComponent }, // Ruta pública
    { path: 'reset-contrasena', component: ResetContrasenaComponent }, // Ruta pública
    { path: 'edicion-usuario', component: EdicionUsuarioComponent, canActivate: [AuthGuard] }, // Ruta protegida
    { path: 'crear-reuniones', component: CrearReunionesComponent, canActivate: [RoleGuard], data: { role: 'employee' } }, // Solo para empleados
    { path: 'modificar-reuniones', component: ModificarReunionesComponent, canActivate: [RoleGuard], data: { role: 'employee' } }, // Solo para empleados
    { path: 'ver-reuniones', component: VerReunionesComponent, canActivate: [RoleGuard], data: { role: 'employee' } }, // Solo para empleados
    { path: 'buzon', component: BuzonReunionesComponent, canActivate: [AuthGuard] }, // Ruta protegida
    { path: '**', redirectTo: '' }, // Redirige rutas desconocidas a la página principal

];


