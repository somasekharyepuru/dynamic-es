import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RainfallRoutingModule } from './rainfall-routing.module';
import { RainfallComponent } from './rainfall.component';
import { BoardModule } from 'ngx-dynamic-dashboard';


@NgModule({
  declarations: [RainfallComponent],
  imports: [
    CommonModule,
    RainfallRoutingModule,
    BoardModule
  ]
})
export class RainfallModule { }
