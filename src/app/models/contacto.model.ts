import { Usuario } from "./usuario.model";

export class Contacto {

    constructor(
        public idContacto: number,
        public nombres: string,
        public apellidos: string,
        public celular: number,
        public correo: string,
        public usuario: Usuario,
        public fecha: string
    ) { }
}