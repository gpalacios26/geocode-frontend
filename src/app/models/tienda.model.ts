export class Tienda {

    constructor(
        public idTienda: number,
        public tienda: string,
        public imagen: string,
        public titulo: string,
        public direccion: string,
        public latitud: number,
        public longitud: number
    ) { }
}