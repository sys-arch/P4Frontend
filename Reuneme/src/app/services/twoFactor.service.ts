import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpUrl } from '../commons';

@Injectable({
    providedIn: 'root'
})
export class TwoFactorService {
constructor(private client: HttpClient) {}

    // Activar 2FA
    activar2FA(email: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = { email: email };
        return this.client.put(`${httpUrl}users/activar-2fa`, body, { headers, responseType: 'text' as 'json' });
    }

    // Generar código QR
    generateQRCode(secretKey: string, account: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = {
        secretKey: secretKey,
        account: account
        };
        return this.client.get(`${httpUrl}users/generate-qr-code`, { headers, params, responseType: 'text' });
    }

    // Verificar código 2FA
    verificar2FA(email: string, authCode: number): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = {
        email: email,
        authCode: authCode
        };
        return this.client.put(`${httpUrl}users/verify-2fa`, body, { headers });
    }
}
