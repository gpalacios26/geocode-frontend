import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ContactoService } from 'src/app/services/contacto.service';
import { PerfilService } from 'src/app/services/perfil.service';
import { Contacto } from 'src/app/models/contacto.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contacto-form',
  templateUrl: './contacto-form.component.html',
  styleUrls: ['./contacto-form.component.css']
})
export class ContactoFormComponent implements OnInit {

  public form: FormGroup;
  public contacto: Contacto;
  public usuario: Usuario;
  public id: number;
  public edicion: boolean;
  public titulo: string;
  public txtBoton: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private perfilService: PerfilService,
    private contactoService: ContactoService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.usuario = this.perfilService.usuario;

    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        this.edicion = true;
        this.titulo = "Editar Contacto de Emergencia";
        this.txtBoton = "EDITAR";
        this.cargarContacto();
      } else {
        this.edicion = false;
        this.titulo = "Registrar Contacto de Emergencia";
        this.txtBoton = "REGISTRAR";
      }
    });
  }

  crearFormulario() {
    let regExLetrasEspacios = '[a-zA-ZÀ-ÿ ]+';
    let regExCelular = '[0-9]{9,9}$';
    let regExCorreo = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$';

    this.form = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExLetrasEspacios)]],
      apellidos: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExLetrasEspacios)]],
      celular: ['', [Validators.required, Validators.pattern(regExCelular)]],
      correo: ['', [Validators.required, Validators.pattern(regExCorreo)]],
    });
  }

  cargarContacto() {
    this.contactoService.listarPorId(this.id).subscribe(
      response => {
        this.contacto = response;

        this.form.reset({
          nombres: this.contacto.nombres,
          apellidos: this.contacto.apellidos,
          celular: this.contacto.celular,
          correo: this.contacto.correo
        });
      }
    );
  }

  guardarContacto() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos para registrar', 'AVISO', { duration: 2000 });
    } else {
      let peticion: Observable<any>;
      let mensaje: string;
      let mensajeError: string;

      if (this.edicion) {
        let contacto = this.contacto;
        contacto.nombres = formulario.nombres;
        contacto.apellidos = formulario.apellidos;
        contacto.celular = formulario.celular;
        contacto.correo = formulario.correo;

        peticion = this.contactoService.modificar(contacto);
        mensaje = 'El contacto fue actualizado correctamente';
        mensajeError = 'Error al actualizar el contacto';
      } else {
        this.contacto = new Contacto(null, formulario.nombres, formulario.apellidos, formulario.celular, formulario.correo, this.usuario, '');

        peticion = this.contactoService.registrar(this.contacto);
        mensaje = 'El contacto fue registrado correctamente';
        mensajeError = 'Error al registrar el contacto';
      }

      peticion.subscribe(
        response => {
          if (response) {
            this.snackBar.open(mensaje, 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel/contactos']);
            }, 1000);
          } else {
            this.snackBar.open(mensajeError, 'AVISO', { duration: 2000 });
          }
        }
      );
    }
  }

}
