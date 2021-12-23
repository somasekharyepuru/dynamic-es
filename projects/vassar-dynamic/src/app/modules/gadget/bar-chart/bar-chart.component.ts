import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GadgetInstanceService, GadgetPropertyService, OptionsService, GadgetBase } from 'ngx-dynamic-dashboard';

import { BarChartService } from './bar-chart.service'

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends GadgetBase {

    news: any;
    resource: string;
    chartOptions;

    gadgetHasOperationControls = false;
    constructor(
        protected _gadgetInstanceService: GadgetInstanceService,
        protected _propertyService: GadgetPropertyService,
        protected _changeDetectionRef: ChangeDetectorRef,
        protected _barChartService: BarChartService,
        protected _optionsService: OptionsService
    ) {
        super(
            _gadgetInstanceService,
            _propertyService,
            _changeDetectionRef,
            _optionsService);
    }

    public preRun(): void {
        this.updateData(null);
        this.run();
    }

    public run() {
        this.news = [];
        this.initializeRunState(true);
        this.updateData(null);
    }

    public stop() {
        this.setStopState(false);
    }

    public updateData(data: any[]) {

        this._barChartService.get().subscribe(chartOptions => {
            this.chartOptions = chartOptions;
        },
            error => this.handleError(error));
    }

    public updateProperties(updatedProperties: any) {

        /**
         * todo
         *  A similar operation exists on the procmman-config-service
         *  whenever the property page form is saved, the in memory board model
         *  is updated as well as the gadget instance properties
         *  which is what the code below does. This can be eliminated with code added to the
         *  config service or the property page service.
         *
         * **/

        const updatedPropsObject = JSON.parse(updatedProperties);
        console.log(updatedPropsObject)

        this.propertyPages.forEach((propertyPage) => {


            for (let x = 0; x < propertyPage.properties.length; x++) {

                for (const prop in updatedPropsObject) {
                    if (updatedPropsObject.hasOwnProperty(prop)) {
                        if (prop === propertyPage.properties[x].key) {
                            propertyPage.properties[x].value = updatedPropsObject[prop];
                        }

                    }
                }
            }
        });

        this.title = updatedPropsObject.title;
        this.setEndPoint(updatedPropsObject.endpoint);
        this.updateData(null);
    }

}
