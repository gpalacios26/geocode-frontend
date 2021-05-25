import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Incidencia } from 'src/app/models/incidencia.model';

@Component({
  selector: 'app-dialog-incidencia',
  templateUrl: './dialog-incidencia.component.html',
  styleUrls: ['./dialog-incidencia.component.css']
})
export class DialogIncidenciaComponent implements OnInit {

  public titulo: string;
  public incidencia: Incidencia;
  public url: string;

  constructor(
    public dialogRef: MatDialogRef<DialogIncidenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.titulo = this.data.titulo;
    this.incidencia = this.data.incidencia;
    this.url = `https://maps.google.com/?q=${this.incidencia.latitud},${this.incidencia.longitud}`;
  }

  verGoogleMaps() {
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    document.body.appendChild(a);
    a.href = this.url;
    a.target = '_blank';
    a.click();
  }

}
