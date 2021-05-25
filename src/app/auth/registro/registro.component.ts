import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PerfilService } from 'src/app/services/perfil.service';
import { RegistroService } from 'src/app/services/registro.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private registroService: RegistroService,
    private perfilService: PerfilService,
    private router: Router
  ) {
    this.crearFormulario();
  }

  crearFormulario() {
    let regExLetrasEspacios = '[a-zA-ZÀ-ÿ ]+';
    let regExCorreo = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$';
    let regExPassword = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}';

    this.form = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExLetrasEspacios)]],
      apellidos: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExLetrasEspacios)]],
      correo: ['', [Validators.required, Validators.pattern(regExCorreo)]],
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(regExPassword)]],
    });
  }

  validarCorreo() {
    let formulario = this.form.value;
    let correo = formulario.correo;
    if (this.form.get('correo').valid) {
      this.perfilService.verificarPerfil('correo', correo).subscribe(
        response => {
          if (response.existe == '1') {
            this.snackBar.open('El correo ingresado ya está registrado en el sistema', 'AVISO', { duration: 2000 });
            this.form.get('correo').setErrors({ existe: true });
          }
        }
      );
    }
  }

  validarUsuario() {
    let formulario = this.form.value;
    let username = formulario.username;
    if (this.form.get('username').valid) {
      this.perfilService.verificarPerfil('usuario', username).subscribe(
        response => {
          if (response.existe == '1') {
            this.snackBar.open('El usuario ingresado ya está registrado en el sistema', 'AVISO', { duration: 2000 });
            this.form.get('username').setErrors({ existe: true });
          }
        }
      );
    }
  }

  registrarUsuario() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos para registrar su cuenta', 'AVISO', { duration: 2000 });
    } else {
      this.registroService.registrar(formulario).subscribe(
        response => {
          if (response) {
            this.snackBar.open('Usuario registrado correctamente', 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 2000);
          } else {
            this.snackBar.open('Error al registrar el usuario', 'AVISO', { duration: 2000 });
          }
        }
      );
    }
  }

}
