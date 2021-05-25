import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PerfilService } from 'src/app/services/perfil.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public form: FormGroup;
  public usuario: Usuario;
  public labelRol: string;
  public inputRol: string;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private perfilService: PerfilService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.usuario = this.perfilService.usuario;
    this.cargarPerfil();
  }

  crearFormulario() {
    let regExLetrasEspacios = '[a-zA-ZÀ-ÿ ]+';

    this.form = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExLetrasEspacios)]],
      apellidos: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExLetrasEspacios)]],
    });
  }

  cargarPerfil() {
    this.form.reset({
      nombres: this.usuario.nombres,
      apellidos: this.usuario.apellidos
    });

    let roles = this.usuario.roles;
    let rol = '';
    roles.forEach(r => {
      rol += r.descripcion + ',';
    });

    if (roles.length > 1) {
      this.labelRol = "Roles de Usuario";
    } else {
      this.labelRol = "Rol de Usuario";
    }

    this.inputRol = rol.slice(0, -1);
  }

  actualizarPerfil() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos para guardar los cambios', 'AVISO', { duration: 2000 });
    } else {
      let usuario = this.usuario;
      usuario.nombres = formulario.nombres;
      usuario.apellidos = formulario.apellidos;

      this.perfilService.actualizarPerfil(usuario).subscribe(
        response => {
          if (response == 1) {
            this.perfilService.obtenerUsuario();
            this.snackBar.open('Los datos fueron actualizados correctamente', 'AVISO', { duration: 2000 });
          } else {
            this.snackBar.open('Error al actualizar los datos', 'AVISO', { duration: 2000 });
          }
        }
      );
    }
  }

}
