import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PeriodicalComponent } from './periodical/periodical.component';
import { PeriodicalsComponent } from './periodicals/periodicals.component';

const routes: Routes = [
  { path: '', redirectTo: 'periodicals', pathMatch: 'full' },
  { path: 'periodical/:id', component: PeriodicalComponent },
  { path: 'periodicals', component: PeriodicalsComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
