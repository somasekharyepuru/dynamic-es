import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VlFilterComponent } from './vl-core-modules/vl-filter/vl-filter.component';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { SharedModule } from '../shared/shared.module';
import { HighchartsRendererModule } from './vl-core-modules/highcharts-renderer/highcharts-renderer.module';



@NgModule({
  declarations: [VlFilterComponent],
  imports: [
    CommonModule,
    HighchartsRendererModule,
    SharedModule,
    MonacoEditorModule,
  ],
  exports: [
    HighchartsRendererModule,
    SharedModule,
    VlFilterComponent
  ]
})
export class VlCoreModule { }
