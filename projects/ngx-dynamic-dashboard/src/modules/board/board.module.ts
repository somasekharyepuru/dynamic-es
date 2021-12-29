import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  VlBoardComponent } from './board.component';
import { FormTabsComponent } from './components/form-tabs/form-tabs.component';
import { VlCoreModule } from '../vl-core/vl-core.module';
import { HttpClientModule } from '@angular/common/http';
import { TabsModule } from 'ngx-bootstrap/tabs';



@NgModule({
  declarations: [
    VlBoardComponent,
    FormTabsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    VlCoreModule,
    TabsModule
  ],
  exports: [
    FormTabsComponent,
    VlBoardComponent,
    VlCoreModule
  ]
})
export class VLBoardModule { }
