import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
    })
    export class GravatarService {
    getGravatarUrl(email: string): string {
        const hash = Array.from(email.trim().toLowerCase())
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
        .toString(16); // Convierte el hash en hexadecimal

        return `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon&r=g`;
    }

    constructor() { }

    
}
