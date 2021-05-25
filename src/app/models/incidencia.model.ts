import { Evento } from "./evento.model";
import { Usuario } from "./usuario.model";

export class Incidencia {

    constructor(
        public idIncidencia: number,
        public evento: Evento,
        public descripcion: string,
        public direccion: string,
        public latitud: number,
        public longitud: number,
        public usuario: Usuario,
        public fecha: string
    ) { }
}