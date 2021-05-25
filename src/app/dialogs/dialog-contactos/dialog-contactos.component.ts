import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactoService } from 'src/app/services/contacto.service';
import { PerfilService } from 'src/app/services/perfil.service';
import { Contacto } from 'src/app/models/contacto.model';
import { Usuario } from 'src/app/models/usuario.model';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-dialog-contactos',
  templateUrl: './dialog-contactos.component.html',
  styleUrls: ['./dialog-contactos.component.css']
})
export class DialogContactosComponent implements OnInit {

  public titulo: string;
  public archivos: FileList;
  public contactos: Contacto[] = [];
  public usuario: Usuario;

  constructor(
    public dialogRef: MatDialogRef<DialogContactosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private contactosService: ContactoService,
    private perfilService: PerfilService
  ) { }

  ngOnInit(): void {
    this.titulo = this.data.titulo;
    this.usuario = this.perfilService.usuario;
  }

  exportarFormato() {
    this.contactosService.exportarFormato().subscribe(
      response => {
        if (response) {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'formato.xlsx';
          a.click();
        } else {
          this.snackBar.open('Error al descargar el formato', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

  seleccionarArchivo(evento: any) {
    this.archivos = evento.target.files;
  }

  cargarFormato() {
    if (this.archivos) {
      let archivo = this.archivos.item(0);
      this.contactosService.cargarFormato(archivo).subscribe(
        response => {
          if (response.estado == '1') {
            if (response.contactos.length > 0) {
              this.contactos = response.contactos;
            } else {
              this.snackBar.open('Debe ingresar información de acuerdo al formato establecido', 'AVISO', { duration: 2000 });
            }
          } else {
            this.snackBar.open('Error al cargar la información, verifique que sea de acuerdo al formato establecido', 'AVISO', { duration: 2000 });
          }
        }
      );
    } else {
      this.snackBar.open('Debe seleccionar el archivo', 'AVISO', { duration: 2000 });
    }
  }

  procesarFormato() {
    const confirmDialog = this.dialog.open(DialogConfirmComponent, {
      disableClose: true,
      data: {
        titulo: 'Alerta',
        mensaje: 'Deseas procesar la información? Sólo se procesan los registros válidos'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        let contactos: Contacto[] = [];
        this.contactos.forEach(contacto => {
          contacto.usuario = this.usuario;
          contactos.push(contacto);
        });

        this.contactosService.procesarContactos(contactos).subscribe(
          response => {
            if (response.estado == '1') {
              this.snackBar.open('Se registraron los datos correctamente', 'AVISO', { duration: 2000 });
            } else {
              this.snackBar.open('Error al registrar la información, comuníquese con el administrador', 'AVISO', { duration: 2000 });
            }
          }
        );

        this.dialogRef.close(true);
      }
    });
  }

}
