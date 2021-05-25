import { Rol } from "./rol.model";

export class Usuario {

    constructor(
        public idUsuario: number,
        public nombres: string,
        public apellidos: string,
        public correo: string,
        public username: string,
        public password: string,
        public enabled: boolean,
        public roles: Rol[]
    ) { }
}