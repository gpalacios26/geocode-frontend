export class Banco {

    constructor(
        public idBanco: number,
        public banco: string,
        public imagen: string,
        public titulo: string,
        public direccion: string,
        public latitud: number,
        public longitud: number
    ) { }
}