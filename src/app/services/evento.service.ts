import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Evento } from '../models/evento.model';

const base_url = `${environment.HOST}/api`;

@Injectable({
    providedIn: 'root'
})
export class EventoService {

    constructor(
        private http: HttpClient
    ) { }

    listar() {
        return this.http.get<Evento[]>(`${base_url}/eventos`);
    }

    listarPorId(id: number) {
        return this.http.get<Evento>(`${base_url}/eventos/${id}`);
    }
}