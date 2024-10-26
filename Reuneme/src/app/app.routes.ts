import { Routes } from '@angular/router';
import { ContrasenaOlvidadaComponent } from './contrasena-olvidada/contrasena-olvidada.component';
import { DoblefactorComponent } from './doblefactor/doblefactor.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { PerfilComponent } from './perfil/perfil.component';
import { RegistroAdminComponent } from './registro-admin/registro-admin.component';
import { RegistroComponent } from './registro/registro.component';
import { ResetContrasenaComponent } from './reset-contrasena/reset-contrasena.component';
import { VentanaPrincipalComponent } from './ventana-principal/ventana-principal.component';
import { EdicionUsuarioComponent } from './edicion-usuario/edicion-usuario.component';

export const routes: Routes = [
    {path: '', component: LandingPageComponent},
    {path: 'login', component: LoginComponent},
    { path: 'registro', component: RegistroComponent },
    { path: 'doblefactor', component: DoblefactorComponent },
    { path: 'perfil-admin', component: PerfilComponent },
    { path: 'perfil-usuario', component: PerfilUsuarioComponent },
    { path: 'registro-admin', component: RegistroAdminComponent },
    { path: 'ventana-principal', component: VentanaPrincipalComponent },
    { path: 'contrasena-olvidada', component: ContrasenaOlvidadaComponent },
    { path: 'reset-contrasena', component: ResetContrasenaComponent },
    { path: 'edicion-usuario/:email', component: EdicionUsuarioComponent },
    { path: '**', redirectTo: '' }
    
];
