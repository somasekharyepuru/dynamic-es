import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';

import { GridModule, MenuModule, DynamicFormModule, ErrorHandlerModule, ConfigurationModule, AddGadgetModule, GadgetFactory,ExternalService, VLBoardModule, VlCoreModule} from 'ngx-dynamic-dashboard';
import { APIURLS } from '../../../../constants/api.url';
import { AppRoutingModule } from './app-routing.module';
import { BarChartWidgetComponent } from './modules/gadget/components/bar-chart-widget/bar-chart-widget.component';

import { GadgetModule } from './modules/gadget/gadget.module';





export function GadgetRegistry(): () => void {
  return () => {
    GadgetFactory.setComponentType('barChartComponent', BarChartWidgetComponent);
  };
}


export function dashboardAPI(externalService:ExternalService): () => void {
  return () => {
    let missingURL = externalService.setURLList(APIURLS.DASHBAORD_URLS);
    console.log(missingURL)
    
  };
}





@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MenuModule,
    GridModule,
    DynamicFormModule,
    ErrorHandlerModule,
    ConfigurationModule,
    AddGadgetModule,
    AppRoutingModule,
    VLBoardModule,
    VlCoreModule,
    GadgetModule
    // GadgetModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: GadgetRegistry,
      deps: [],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: dashboardAPI,
      deps: [ExternalService],
      multi: true
    },
  ],
  entryComponents: [BarChartWidgetComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
