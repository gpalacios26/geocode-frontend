import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PerfilService } from 'src/app/services/perfil.service';
import { CapasService } from 'src/app/services/capas.service';
import { IncidenciaService } from 'src/app/services/incidencia.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Banco } from 'src/app/models/banco.model';
import { Farmacia } from 'src/app/models/farmacia.model';
import { Tienda } from 'src/app/models/tienda.model';
import { Bombero } from 'src/app/models/bombero.model';
import { Comisaria } from 'src/app/models/comisaria.model';
import { Incidencia } from 'src/app/models/incidencia.model';
import { combineLatest, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  public lat: number = -12.054182;
  public lng: number = -77.0480819;
  public zoom: number = 12;
  public height: number;
  public loader: boolean = false;

  public usuario: Usuario;
  public userLocation: boolean = false;

  public tiendas: Tienda[];
  public farmacias: Farmacia[];
  public bancos: Banco[];
  public bomberos: Bombero[];
  public comisarias: Comisaria[];
  public incidencias: Incidencia[];

  public divLayers: boolean = true;
  public checkedTiendas: boolean = true;
  public checkedFarmacias: boolean = true;
  public checkedBancos: boolean = true;
  public checkedBomberos: boolean = true;
  public checkedComisarias: boolean = true;

  public infoWindowOpened = null;
  public previous_info_window = null;

  public dataSubscription: Subscription;
  public timerSubscription: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    private perfilService: PerfilService,
    private capasService: CapasService,
    private incidenciaService: IncidenciaService
  ) {
    this.height = window.innerHeight - 64;
  }

  onResize(event) {
    this.height = event.target.innerHeight - 64;
  }

  ngOnInit(): void {
    this.usuario = this.perfilService.usuario;
    this.setCurrentLocation();
    this.initMapaCapas();
    this.initDataIncidencias();
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;
        this.userLocation = true;
      });
    }
  }

  initMapaCapas() {
    this.loader = true;
    combineLatest([
      this.capasService.listarTiendas(),
      this.capasService.listarFarmacias(),
      this.capasService.listarBancos(),
      this.capasService.listarBomberos(),
      this.capasService.listarComisarias()
    ]).subscribe(([tiendas, farmacias, bancos, bomberos, comisarias]) => {
      if (this.checkedTiendas) { this.tiendas = tiendas; }
      if (this.checkedFarmacias) { this.farmacias = farmacias; }
      if (this.checkedBancos) { this.bancos = bancos; }
      if (this.checkedBomberos) { this.bomberos = bomberos; }
      if (this.checkedComisarias) { this.comisarias = comisarias; }

      setTimeout(() => {
        this.loader = false;
      }, 1000);
    });
  }

  initDataIncidencias() {
    this.infoWindowOpened = null;
    this.previous_info_window = null;

    this.dataSubscription = this.incidenciaService.listar().subscribe(
      incidencias => {
        this.incidencias = incidencias;
        //this.subscribeToData();
      }
    );
  }

  subscribeToData() {
    this.timerSubscription = timer(5000).subscribe(() => this.initDataIncidencias());
  }

  closeWindow() {
    if (this.previous_info_window != null) {
      this.previous_info_window.close();
    }
  }

  selectMarker(infoWindow) {
    if (this.previous_info_window == null) {
      this.previous_info_window = infoWindow;
    } else {
      this.infoWindowOpened = infoWindow;
      this.previous_info_window.close();
    }
    this.previous_info_window = infoWindow;
  }

  toogleDiv() {
    if (this.divLayers) {
      this.divLayers = false;
    } else {
      this.divLayers = true;
    }
  }

  changeLayerValue() {
    this.infoWindowOpened = null;
    this.previous_info_window = null;

    // Capa de Tiendas
    if (this.checkedTiendas) {
      this.capasService.listarTiendas().subscribe(
        tiendas => {
          this.tiendas = tiendas;
        }
      );
    } else {
      this.tiendas = [];
    }
    // Capa de Farmacias
    if (this.checkedFarmacias) {
      this.capasService.listarFarmacias().subscribe(
        farmacias => {
          this.farmacias = farmacias;
        }
      );
    } else {
      this.farmacias = [];
    }
    // Capa de Bancos
    if (this.checkedBancos) {
      this.capasService.listarBancos().subscribe(
        bancos => {
          this.bancos = bancos;
        }
      );
    } else {
      this.bancos = [];
    }
    // Capa de Bomberos
    if (this.checkedBomberos) {
      this.capasService.listarBomberos().subscribe(
        bomberos => {
          this.bomberos = bomberos;
        }
      );
    } else {
      this.bomberos = [];
    }
    // Capa de Comisarias
    if (this.checkedComisarias) {
      this.capasService.listarComisarias().subscribe(
        comisarias => {
          this.comisarias = comisarias;
        }
      );
    } else {
      this.comisarias = [];
    }
  }

  enviarAlerta() {
    this.snackBar.open('Se envió una alerta con su ubicación a sus contactos', 'AVISO', { duration: 2000 });
  }

}
