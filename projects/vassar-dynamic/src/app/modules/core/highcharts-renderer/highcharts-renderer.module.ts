import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsRendererComponent } from './highcharts-renderer.component';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [
    HighchartsRendererComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule
  ],
  exports: [HighchartsRendererComponent]
})
export class HighchartsRendererModule { }
