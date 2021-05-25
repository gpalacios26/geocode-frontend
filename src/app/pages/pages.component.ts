import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../services/perfil.service';
import { LoginService } from '../services/login.service';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  public usuario: Usuario;
  public admin: boolean = false;

  constructor(
    private perfilService: PerfilService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.usuario = this.perfilService.usuario;
    this.admin = this.perfilService.esAdministrador();
  }

  cerrarSesion() {
    this.loginService.cerrarSesion();
  }

}
