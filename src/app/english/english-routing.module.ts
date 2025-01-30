import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WeekByPageComponent } from './week-by-page/week-by-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {path:'weeks', component: WeekByPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnglishRoutingModule { }
