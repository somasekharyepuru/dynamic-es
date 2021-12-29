import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RainfallComponent } from './rainfall.component';

const routes: Routes = [
  {
    path: '',
    component: RainfallComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RainfallRoutingModule { }
