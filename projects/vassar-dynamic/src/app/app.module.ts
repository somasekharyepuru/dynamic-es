import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';

import { GridModule, MenuModule, DynamicFormModule, ErrorHandlerModule, ConfigurationModule, AddGadgetModule, GadgetFactory} from 'ngx-dynamic-dashboard';

import { GadgetModule } from "./modules/gadget/gadget.module";
import { BarChartComponent } from './modules/gadget/bar-chart/bar-chart.component';




export function GadgetRegistry(): () => void {
  return () => {
    GadgetFactory.setComponentType('BarChart', BarChartComponent);
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
