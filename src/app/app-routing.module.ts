import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as P from './pages/pages';


const routes: Routes = [
  { path: '', component: P.HomeComponent }
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'home', component: P.HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
