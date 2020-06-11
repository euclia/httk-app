import { HttkmodelsComponent } from './httkmodels/httkmodels.component';
import { BaseComponent } from './base/base.component';
import {CreatehttkmodelComponent  } from "./createhttkmodel/createhttkmodel.component";
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  // {path: 'models', component:  HttkmodelsComponent},
  // {path: 'createmodel', component:  CreatehttkmodelComponent},
  // {path: 'home', component:  BaseComponent},
  // {path: '' , redirectTo: 'AppComponent', pathMatch: 'full'}

  {path: 'models', component:  HttkmodelsComponent},
  {path: 'createmodel', component:  CreatehttkmodelComponent},
  //{path: 'home', component:  CreatehttkmodelComponent},
  {path: '' , redirectTo: 'createmodel', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
