import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

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

const routes: Routes = [
  {
    path: 'panel',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'cambiar-clave', component: CambioClaveComponent },
      { path: 'registrar-incidencia', component: GeolocalizarComponent },
      { path: 'contactos', component: ContactosComponent },
      { path: 'contactos/registrar', component: ContactoFormComponent },
      { path: 'contactos/editar/:id', component: ContactoFormComponent },
      { path: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard] },
      { path: 'usuarios/registrar', component: UsuarioFormComponent, canActivate: [AdminGuard] },
      { path: 'incidencias', component: IncidenciasComponent, canActivate: [AdminGuard] },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
