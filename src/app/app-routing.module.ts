import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KezdolapComponent } from './routes/kezdolap/kezdolap.component';
import { LekerdezesComponent } from './routes/lekerdezes/lekerdezes.component';
import { NemTalalhatoComponent } from './routes/nem-talalhato/nem-talalhato.component';


const routes: Routes = [
  { path:"", component: KezdolapComponent},
  { path:"lekerdez", component: LekerdezesComponent},
  { path:"**", component: NemTalalhatoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
