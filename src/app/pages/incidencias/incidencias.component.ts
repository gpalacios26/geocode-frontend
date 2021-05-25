import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PerfilService } from 'src/app/services/perfil.service';
import { IncidenciaService } from 'src/app/services/incidencia.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Incidencia } from 'src/app/models/incidencia.model';
import { DialogIncidenciaComponent } from 'src/app/dialogs/dialog-incidencia/dialog-incidencia.component';

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.component.html',
  styleUrls: ['./incidencias.component.css']
})
export class IncidenciasComponent implements OnInit {

  public usuario: Usuario;
  public incidencias: Incidencia[];
  public displayedColumns = ['idIncidencia', 'evento', 'direccion', 'fecha', 'acciones'];
  public dataSource: MatTableDataSource<Incidencia>;
  public cantidad: number = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private perfilService: PerfilService,
    private incidenciaService: IncidenciaService
  ) { }

  ngOnInit(): void {
    this.usuario = this.perfilService.usuario;
    this.cargarIncidencias();
  }

  cargarIncidencias(page: number = 0, size: number = 10) {
    this.incidenciaService.listarPaginado(page, size).subscribe(
      response => {
        this.incidencias = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.incidencias);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idIncidencia', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarIncidencias(e.pageIndex, e.pageSize);
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  mostrarDetalle(incidencia: Incidencia) {
    this.dialog.open(DialogIncidenciaComponent, {
      disableClose: true,
      data: {
        titulo: 'Incidencia Reportada',
        incidencia: incidencia
      }
    });
  }

  exportar(id: number) {
    this.incidenciaService.exportarPdf(id).subscribe(
      response => {
        if (response) {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'incidencia.pdf';
          a.click();
        } else {
          this.snackBar.open('Error al descargar la información', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

}
