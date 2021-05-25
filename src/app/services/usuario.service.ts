import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';

const base_url = `${environment.HOST}/api`;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient
  ) { }

  listar() {
    return this.http.get<Usuario[]>(`${base_url}/admin/usuarios`);
  }

  listarPaginado(page: number, size: number) {
    return this.http.get<any>(`${base_url}/admin/usuarios/pageable?page=${page}&size=${size}`);
  }

  listarPorId(id: number) {
    return this.http.get<Usuario>(`${base_url}/admin/usuarios/${id}`);
  }

  registrar(usuario: Usuario): Observable<any> {
    return this.http.post(`${base_url}/admin/usuarios/registrar`, usuario);
  }

  actualizarEstado(usuario: Usuario): Observable<any> {
    return this.http.post(`${base_url}/admin/usuarios/actualizar`, usuario);
  }

  exportar() {
    return this.http.get(`${base_url}/admin/usuarios/descargar`, {
      responseType: 'blob'
    });
  }
}
