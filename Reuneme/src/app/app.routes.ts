import { Routes } from '@angular/router';
import { DoblefactorComponent } from './doblefactor/doblefactor.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';

export const routes: Routes = [
    {path: '', component: LandingPageComponent},
    {path: 'login', component: LoginComponent},
    { path: 'registro', component: RegistroComponent },
    { path: 'doblefactor', component: DoblefactorComponent },
    { path: '**', redirectTo: '' }
    
];
