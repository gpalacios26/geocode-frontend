import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

// Angular Material
import { MaterialModule } from '../material/material.module';

import { AppRoutingModule } from '../app-routing.module';
import { DialogsModule } from '../dialogs/dialogs.module';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CambioClaveComponent } from './cambio-clave/cambio-clave.component';
import { GeolocalizarComponent } from './geolocalizar/geolocalizar.component';
import { ContactosComponent } from './contactos/contactos.component';
import { ContactoFormComponent } from './contactos/contacto-form/contacto-form.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioFormComponent } from './usuarios/usuario-form/usuario-form.component';
import { IncidenciasComponent } from './incidencias/incidencias.component';

@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    PerfilComponent,
    CambioClaveComponent,
    GeolocalizarComponent,
    ContactosComponent,
    ContactoFormComponent,
    UsuariosComponent,
    UsuarioFormComponent,
    IncidenciasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    DialogsModule,
    AgmCoreModule.forRoot({
      apiKey: 'XXXXXX'
    }),
    AgmJsMarkerClustererModule
  ],
  exports: [
    PagesComponent,
    HomeComponent,
    PerfilComponent,
    CambioClaveComponent,
    GeolocalizarComponent,
    ContactosComponent,
    ContactoFormComponent,
    UsuariosComponent,
    UsuarioFormComponent,
    IncidenciasComponent
  ]
})
export class PagesModule { }
