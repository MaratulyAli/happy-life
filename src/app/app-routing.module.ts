import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PeriodicalComponent } from './periodical/periodical.component';
import { PeriodicalsComponent } from './periodicals/periodicals.component';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToPeriodicals = () => redirectLoggedInTo(['periodicals']);

const routes: Routes = [
  { path: '', redirectTo: 'periodicals', pathMatch: 'full' },
  { path: 'periodicals', component: PeriodicalsComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'periodical/:id', component: PeriodicalComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToPeriodicals) },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
