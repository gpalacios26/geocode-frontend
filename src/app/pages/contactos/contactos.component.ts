import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PerfilService } from 'src/app/services/perfil.service';
import { ContactoService } from 'src/app/services/contacto.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Contacto } from 'src/app/models/contacto.model';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogContactosComponent } from 'src/app/dialogs/dialog-contactos/dialog-contactos.component';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent implements OnInit {

  public usuario: Usuario;
  public contactos: Contacto[];
  public displayedColumns = ['idContacto', 'nombres', 'apellidos', 'celular', 'correo', 'acciones'];
  public dataSource: MatTableDataSource<Contacto>;
  public cantidad: number = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private perfilService: PerfilService,
    private contactoService: ContactoService
  ) { }

  ngOnInit(): void {
    this.usuario = this.perfilService.usuario;
    this.cargarContactos(this.usuario.username);
  }

  cargarContactos(usuario: any, page: number = 0, size: number = 10) {
    this.contactoService.listarPorUsuarioPaginado(usuario, page, size).subscribe(
      response => {
        this.contactos = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.contactos);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idContacto', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarContactos(this.usuario.username, e.pageIndex, e.pageSize);
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(id: number) {
    const confirmDialog = this.dialog.open(DialogConfirmComponent, {
      disableClose: true,
      data: {
        titulo: 'Alerta',
        mensaje: 'Deseas eliminar el registro seleccionado?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.contactoService.eliminar(id).subscribe(
          () => {
            this.cargarContactos(this.usuario.username);
            this.snackBar.open('Contacto eliminado correctamente', 'AVISO', { duration: 2000 });
          }
        );
      }
    });
  }

  exportar() {
    this.contactoService.exportarPorUsuario(this.usuario.username).subscribe(
      response => {
        if (response) {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'contactos.xlsx';
          a.click();
        } else {
          this.snackBar.open('Error al descargar la información', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

  importar() {
    const importarDialog = this.dialog.open(DialogContactosComponent, {
      disableClose: true,
      data: {
        titulo: 'Importar Contactos'
      }
    });
    importarDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarContactos(this.usuario.username);
      }
    });
  }

}
