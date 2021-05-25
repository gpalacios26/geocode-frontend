import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MouseEvent } from '@agm/core';
import { PerfilService } from 'src/app/services/perfil.service';
import { GeocodeService } from 'src/app/services/geocode.service';
import { EventoService } from 'src/app/services/evento.service';
import { IncidenciaService } from 'src/app/services/incidencia.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Evento } from 'src/app/models/evento.model';
import { Incidencia } from 'src/app/models/incidencia.model';

@Component({
  selector: 'app-geolocalizar',
  templateUrl: './geolocalizar.component.html',
  styleUrls: ['./geolocalizar.component.css']
})
export class GeolocalizarComponent implements OnInit {

  public form: FormGroup;
  public incidencia: Incidencia;
  public eventos: Evento[];
  public evento: Evento;
  public usuario: Usuario;

  public lat: number = -12.054182;
  public lng: number = -77.0480819;
  public zoom: number = 12;
  public height: number;
  public loader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private perfilService: PerfilService,
    private geocodeService: GeocodeService,
    private eventoService: EventoService,
    private incidenciaService: IncidenciaService,
    private router: Router
  ) {
    this.height = window.innerHeight - 64;
    this.crearFormulario();
  }

  onResize(event) {
    this.height = event.target.innerHeight - 64;
  }

  ngOnInit(): void {
    this.usuario = this.perfilService.usuario;
    this.setCurrentLocation();
    this.cargarEventos();
  }

  get latitud() {
    return this.form.get('latitud').value;
  }

  get longitud() {
    return this.form.get('longitud').value;
  }

  crearFormulario() {
    this.form = this.fb.group({
      idTipo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      latitud: [''],
      longitud: ['']
    });
  }

  cargarEventos() {
    this.eventoService.listar().subscribe(
      eventos => {
        this.eventos = eventos;
      }
    );
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 18;
        this.getAddress(this.lat, this.lng, 1);
      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    let latitud = $event.coords.lat;
    let longitud = $event.coords.lng;
    this.getAddress(latitud, longitud, 0);
  }

  getAddress(latitud: number, longitud: number, initGeo: number) {
    let formulario = this.form.value;
    if (initGeo == 1) { this.loader = true; }
    this.geocodeService.getAddress(latitud, longitud).subscribe(
      location => {
        if (location.address != '-') {
          // Actualizar dirección y coordenadas
          this.form.reset({
            idTipo: formulario.idTipo,
            descripcion: formulario.descripcion,
            direccion: location.address,
            latitud: latitud,
            longitud: longitud
          });
        } else {
          this.snackBar.open('Ocurrio un error en la consulta', 'AVISO', { duration: 2000 });
        }
        if (initGeo == 1) { this.loader = false; }
      }
    );
  }

  getCoordenadas() {
    let formulario = this.form.value;
    let direccion = formulario.direccion;
    if (direccion && direccion != '') {
      this.loader = true;
      this.geocodeService.geocodeAddress(direccion).subscribe(
        location => {
          if (location.lat != 0 && location.lng != 0) {
            // Cambiar el zoom
            this.lat = location.lat;
            this.lng = location.lng;
            this.zoom = 18;
            // Actualizar coordenadas
            this.form.reset({
              idTipo: formulario.idTipo,
              descripcion: formulario.descripcion,
              direccion: location.address,
              latitud: location.lat,
              longitud: location.lng
            });
          } else {
            this.snackBar.open('Ocurrio un error en la consulta', 'AVISO', { duration: 2000 });
          }
          this.loader = false;
        }
      );
    }
  }

  registrarIncidencia() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos para registrar', 'AVISO', { duration: 2000 });
    } else {
      this.evento = new Evento(formulario.idTipo, '');
      this.incidencia = new Incidencia(null, this.evento, formulario.descripcion, formulario.direccion, formulario.latitud, formulario.longitud, this.usuario, '');

      this.incidenciaService.registrar(this.incidencia).subscribe(
        response => {
          if (response) {
            this.snackBar.open('Incidencia registrada correctamente', 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel/home']);
            }, 1000);
          } else {
            this.snackBar.open('Error al registrar la incidencia', 'AVISO', { duration: 2000 });
          }
        }
      );
    }
  }

}
