import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KezdolapComponent } from './kezdolap/kezdolap.component';
import { LekerdezesComponent } from './lekerdezes/lekerdezes.component';
import { KivalasztComponent } from './kivalaszt/kivalaszt.component';
import { NemTalalhatoComponent } from './nem-talalhato/nem-talalhato.component';

const routes: Routes = [
  // / nincs szükség az angularban
  { path: "", component: KezdolapComponent},
  { path: "lekerdezes", component:LekerdezesComponent },
  { path: "kivalaszt/:id", component:KivalasztComponent },
  { path: "**", component: NemTalalhatoComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
