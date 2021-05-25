import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material
import { MaterialModule } from '../material/material.module';

import { AppRoutingModule } from '../app-routing.module';

import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { DialogIncidenciaComponent } from './dialog-incidencia/dialog-incidencia.component';
import { DialogContactosComponent } from './dialog-contactos/dialog-contactos.component';

@NgModule({
  declarations: [
    DialogConfirmComponent,
    DialogIncidenciaComponent,
    DialogContactosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule
  ],
  exports: [
    DialogConfirmComponent,
    DialogIncidenciaComponent,
    DialogContactosComponent
  ]
})
export class DialogsModule { }
