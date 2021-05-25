import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { PerfilService } from 'src/app/services/perfil.service';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private perfilService: PerfilService,
    private router: Router
  ) {
    this.crearFormulario();
  }

  crearFormulario() {
    this.form = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(6)]],
      clave: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  iniciarSesion() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos de acceso', 'AVISO', { duration: 2000 });
    } else {
      this.loginService.login(formulario.usuario, formulario.clave).subscribe(
        response => {
          let helper = new JwtHelperService();
          let decodedToken = helper.decodeToken(response.access_token);

          if (decodedToken) {
            sessionStorage.setItem(environment.TOKEN_NAME, response.access_token);
            this.perfilService.obtenerUsuario();

            this.snackBar.open('Acceso correcto. Iniciando la sesión...', 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel']);
            }, 2000);
          } else {
            this.snackBar.open('Los datos de acceso no son válidos', 'AVISO', { duration: 2000 });
          }
        }
      );
    }
  }

}
