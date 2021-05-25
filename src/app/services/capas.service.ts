import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Banco } from '../models/banco.model';
import { Bombero } from '../models/bombero.model';
import { Comisaria } from '../models/comisaria.model';
import { Farmacia } from '../models/farmacia.model';
import { Tienda } from '../models/tienda.model';

const base_url = `${environment.HOST}/api`;

@Injectable({
    providedIn: 'root'
})
export class CapasService {

    constructor(
        private http: HttpClient
    ) { }

    listarBancos() {
        return this.http.get<Banco[]>(`${base_url}/bancos`);
    }

    listarBomberos() {
        return this.http.get<Bombero[]>(`${base_url}/bomberos`);
    }

    listarComisarias() {
        return this.http.get<Comisaria[]>(`${base_url}/comisarias`);
    }

    listarFarmacias() {
        return this.http.get<Farmacia[]>(`${base_url}/farmacias`);
    }

    listarTiendas() {
        return this.http.get<Tienda[]>(`${base_url}/tiendas`);
    }
}