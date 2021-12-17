import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as P from './pages/pages';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: P.HomePage },
  { path: 'about', component: P.AboutPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
