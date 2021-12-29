import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartWidgetComponent } from "./components/bar-chart-widget/bar-chart-widget.component";
import { VLBoardModule } from 'ngx-dynamic-dashboard/public-api';


@NgModule({
  declarations: [BarChartWidgetComponent],
  imports: [
    CommonModule
  ],
  exports: [BarChartWidgetComponent]
})
export class GadgetModule { }
