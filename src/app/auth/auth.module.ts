import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material
import { MaterialModule } from '../material/material.module';

import { AppRoutingModule } from '../app-routing.module';

import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ReseteoComponent } from './reseteo/reseteo.component';
import { CambioComponent } from './cambio/cambio.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent,
    ReseteoComponent,
    CambioComponent
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
    LoginComponent,
    RegistroComponent,
    ReseteoComponent,
    CambioComponent
  ]
})
export class AuthModule { }
