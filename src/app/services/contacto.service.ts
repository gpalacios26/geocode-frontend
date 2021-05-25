import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Contacto } from '../models/contacto.model';
import { Observable } from 'rxjs';

const base_url = `${environment.HOST}/api`;

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(
    private http: HttpClient
  ) { }

  listar() {
    return this.http.get<Contacto[]>(`${base_url}/contactos`);
  }

  listarPorId(id: number) {
    return this.http.get<Contacto>(`${base_url}/contactos/${id}`);
  }

  listarPorUsuario(usuario: string) {
    return this.http.get<Contacto[]>(`${base_url}/contactos/usuario/${usuario}`);
  }

  listarPorUsuarioPaginado(usuario: string, page: number, size: number) {
    return this.http.get<any>(`${base_url}/contactos/usuario/${usuario}/pageable?page=${page}&size=${size}`);
  }

  registrar(contacto: Contacto): Observable<any> {
    return this.http.post(`${base_url}/contactos`, contacto);
  }

  modificar(contacto: Contacto): Observable<any> {
    return this.http.put(`${base_url}/contactos`, contacto);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${base_url}/contactos/${id}`);
  }

  exportarPorUsuario(usuario: string) {
    return this.http.get(`${base_url}/contactos/descargar/${usuario}`, {
      responseType: 'blob'
    });
  }

  exportarFormato() {
    return this.http.get(`${base_url}/contactos/formato`, {
      responseType: 'blob'
    });
  }

  cargarFormato(data: File): Observable<any> {
    let formData: FormData = new FormData();
    formData.append("adjunto", data);

    return this.http.post(`${base_url}/contactos/cargar`, formData);
  }

  procesarContactos(contactos: Contacto[]): Observable<any> {
    return this.http.post(`${base_url}/contactos/procesar`, contactos);
  }
}
