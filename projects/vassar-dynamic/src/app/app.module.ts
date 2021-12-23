import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';

import { GridModule, MenuModule, DynamicFormModule, ErrorHandlerModule, ConfigurationModule, AddGadgetModule, GadgetFactory,ExternalService} from 'ngx-dynamic-dashboard';

import { GadgetModule } from "./modules/gadget/gadget.module";
import { BarChartComponent } from './modules/gadget/bar-chart/bar-chart.component';
import { APIURLS } from '../../../../constants/api.url';





export function GadgetRegistry(): () => void {
  return () => {
    GadgetFactory.setComponentType('barChartComponent', BarChartComponent);
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
    MenuModule,
    GridModule,
    DynamicFormModule,
    ErrorHandlerModule,
    ConfigurationModule,
    AddGadgetModule,
    GadgetModule
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
  bootstrap: [AppComponent]
})
export class AppModule { }
