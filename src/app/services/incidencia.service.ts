import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Incidencia } from '../models/incidencia.model';
import { Observable } from 'rxjs';

const base_url = `${environment.HOST}/api`;

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {

  constructor(
    private http: HttpClient
  ) { }

  listar() {
    return this.http.get<Incidencia[]>(`${base_url}/incidencias`);
  }

  listarPaginado(page: number, size: number) {
    return this.http.get<any>(`${base_url}/incidencias/pageable?page=${page}&size=${size}`);
  }

  listarPorId(id: number) {
    return this.http.get<Incidencia>(`${base_url}/incidencias/${id}`);
  }

  registrar(incidencia: Incidencia): Observable<any> {
    return this.http.post(`${base_url}/incidencias`, incidencia);
  }

  exportarPdf(id: number) {
    return this.http.get(`${base_url}/incidencias/descargar/${id}`, {
      responseType: 'blob'
    });
  }
}
