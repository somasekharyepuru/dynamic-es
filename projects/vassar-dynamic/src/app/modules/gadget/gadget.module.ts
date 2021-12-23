import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import {DynamicFormModule, ErrorHandlerModule, GadgetSharedModule} from 'ngx-dynamic-dashboard';

import {HighchartsRendererModule} from '../core/highcharts-renderer/highcharts-renderer.module'




@NgModule({
  declarations: [BarChartComponent],
  imports: [
    CommonModule,
    GadgetSharedModule,
    DynamicFormModule,
    HighchartsRendererModule,
    ErrorHandlerModule
  ],
  entryComponents: [BarChartComponent]
})
export class GadgetModule { }
