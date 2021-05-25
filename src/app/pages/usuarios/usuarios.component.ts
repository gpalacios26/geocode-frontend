import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PerfilService } from 'src/app/services/perfil.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public usuario: Usuario;
  public usuarios: Usuario[];
  public displayedColumns = ['idUsuario', 'nombres', 'apellidos', 'correo', 'username', 'estado', 'acciones'];
  public dataSource: MatTableDataSource<Usuario>;
  public cantidad: number = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private perfilService: PerfilService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuario = this.perfilService.usuario;
    this.cargarUsuarios();
  }

  cargarUsuarios(page: number = 0, size: number = 10) {
    this.usuarioService.listarPaginado(page, size).subscribe(
      response => {
        this.usuarios = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idUsuario', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarUsuarios(e.pageIndex, e.pageSize);
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  cambiarEstado(usuario: Usuario) {
    if (this.usuario.username !== usuario.username) {
      const confirmDialog = this.dialog.open(DialogConfirmComponent, {
        disableClose: true,
        data: {
          titulo: 'Alerta',
          mensaje: 'Deseas cambiar el estado del usuario ' + usuario.username + ' ?'
        }
      });
      confirmDialog.afterClosed().subscribe(result => {
        if (result === true) {
          let user = usuario;
          if (usuario.enabled) {
            user.enabled = false;
          } else {
            user.enabled = true;
          }
          this.usuarioService.actualizarEstado(user).subscribe(
            () => {
              this.cargarUsuarios();
              this.snackBar.open('El estado fue actualizado correctamente', 'AVISO', { duration: 2000 });
            }
          );
        }
      });
    } else {
      this.snackBar.open('No puede cambiar de estado su propio usuario', 'AVISO', { duration: 2000 });
    }
  }

  exportar() {
    this.usuarioService.exportar().subscribe(
      response => {
        if (response) {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'usuarios.xlsx';
          a.click();
        } else {
          this.snackBar.open('Error al descargar la información', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

}
