import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PerfilService } from '../services/perfil.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private perfilService: PerfilService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {

    //1) VERIFICAR SI TIENES EL ROL NECESARIO PARA ACCEDER A ESA PAGINA
    let rpta = this.perfilService.esAdministrador();
    if (rpta) {

      return true;
    } else {
      this.snackBar.open('No tiene permisos para acceder al recurso solicitado', 'AVISO', { duration: 2500 });
      this.router.navigate(['panel']);

      return false;
    }
  }

}
