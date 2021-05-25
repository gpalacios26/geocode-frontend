import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const base_url = `${environment.HOST}`;

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    login(usuario: string, contrasena: string) {
        let body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;

        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
            .set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))

        return this.http.post<any>(`${base_url}/oauth/token`, body, { headers: headers });
    }

    estaLogueado() {
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        return token != null;
    }

    cerrarSesion() {
        let token = sessionStorage.getItem(environment.TOKEN_NAME);

        if (token) {
            this.http.get(`${environment.HOST}/api/tokens/anular/${token}`).subscribe(() => {
                sessionStorage.clear();
                this.router.navigate(['login']);
            });
        } else {
            sessionStorage.clear();
            this.router.navigate(['login']);
        }
    }
}