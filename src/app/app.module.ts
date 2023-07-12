import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { KezdolapComponent } from './kezdolap/kezdolap.component';
import { LekerdezesComponent } from './lekerdezes/lekerdezes.component';
import { KivalasztComponent } from './kivalaszt/kivalaszt.component';
import { NemTalalhatoComponent } from './nem-talalhato/nem-talalhato.component';

@NgModule({
  declarations: [
    AppComponent,
    KezdolapComponent,
    LekerdezesComponent,
    KivalasztComponent,
    NemTalalhatoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
