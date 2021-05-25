import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";

const base_url = `${environment.HOST}/api`;

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(
    private http: HttpClient
  ) { }

  get usuario() {
    return JSON.parse(decodeURIComponent(atob(sessionStorage.getItem('user_data'))));
  }

  obtenerUsuario() {
    let access_token = sessionStorage.getItem(environment.TOKEN_NAME);
    let helper = new JwtHelperService();
    let decodedToken = helper.decodeToken(access_token);
    let username = decodedToken.user_name;

    this.cargarPerfil('usuario', username).subscribe(
      response => {
        sessionStorage.setItem('user_data', btoa(encodeURIComponent(JSON.stringify(response))));
      }
    );
  }

  esAdministrador() {
    let user = this.usuario;
    let roles = user.roles;
    let result = roles.filter(rol => {
      return rol.nombre == 'ADMIN';
    });

    if (result && result.length >= 1) {
      return true;
    } else {
      return false;
    }
  }

  verificarPerfil(tipo: 'correo' | 'usuario', valor: string) {
    return this.http.get<any>(`${base_url}/usuarios/verificar/${tipo}/${valor}`);
  }

  cargarPerfil(tipo: 'correo' | 'usuario', valor: string) {
    return this.http.get<Usuario>(`${base_url}/login/perfil/${tipo}/${valor}`);
  }

  actualizarPerfil(usuario: Usuario): Observable<any> {
    return this.http.post(`${base_url}/login/perfil/actualizar`, usuario);
  }

  actualizarClave(usuario: Usuario): Observable<any> {
    return this.http.post(`${base_url}/login/perfil/actualizar/clave`, usuario);
  }
}
