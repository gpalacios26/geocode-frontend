import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';

const base_url = `${environment.HOST}/api`;

@Injectable({
    providedIn: 'root'
})
export class RegistroService {

    constructor(
        private http: HttpClient
    ) { }

    registrar(usuario: Usuario): Observable<any> {
        return this.http.post(`${base_url}/usuarios`, usuario);
    }

    enviarCorreo(correo: string, webUrl: string): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("correo", correo);
        formData.append("webUrl", webUrl);

        return this.http.post(`${base_url}/usuarios/enviar/correo`, formData);
    }

    verificarToken(token: string) {
        return this.http.get<number>(`${base_url}/usuarios/restablecer/verificar/${token}`);
    }

    cambiarClave(token: string, clave: string): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("clave", clave);

        return this.http.post(`${base_url}/usuarios/restablecer/${token}`, formData);
    }
}
