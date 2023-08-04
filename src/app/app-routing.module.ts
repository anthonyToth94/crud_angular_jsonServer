import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* naptár */
import { LoginComponent } from './routes/login/login.component';
import { SignupComponent } from './routes/signup/signup.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';

const routes: Routes = [
  /*
  {redirectTo:'', path:'login', pathMatch:'full'}, */
  { path: '', component: SignupComponent },
  { path: 'bejelentkezes', component: LoginComponent },
  { path: 'regisztracio', component: SignupComponent },
  { path: 'kezdolap', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
