import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartWidgetComponent } from "./components/bar-chart-widget/bar-chart-widget.component";
import { VLBoardModule } from 'ngx-dynamic-dashboard';

@NgModule({
  declarations: [BarChartWidgetComponent],
  imports: [
    CommonModule,
    VLBoardModule,
  ],
  exports: [BarChartWidgetComponent]
})
export class GadgetModule { }
