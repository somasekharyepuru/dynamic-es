import { Injectable } from '@angular/core';
import { Axis, AxisOptions, SeriesBarOptions, SeriesPieOptions } from 'highcharts';
import { Options } from 'highcharts';
import { Observable } from 'rxjs';
import { IBarChartWidgetStyling } from './bar-chart-widget-config.model';
import { BarChartSkeleton, PercentageBarChartMerger, StackedBarChartMerger } from './bar-chart.cnst';
import {Board, Gadget, BoardService, VlDataService, GadgetService, Chart3dMergerOptions, Chart3dDeMergerOptions} from 'ngx-dynamic-dashboard';


@Injectable({
  providedIn: 'root'
})
export class BarChatWidgetService {

  constructor(
    private dataService: VlDataService,
    private gadgetService: GadgetService
  ) { }

  getData() {

  }

  public getConfig(config: Gadget): Observable<Options> {
    const {componentType} = config;
    let chartOptions: Options = this.dataService.deepClone(BarChartSkeleton);
    if (componentType === 'percent') {
      chartOptions = this.dataService.deepMerge(chartOptions, this.dataService.deepClone(PercentageBarChartMerger))
    }
    if (componentType === 'stackedBar') {
      chartOptions = this.dataService.deepMerge(chartOptions, this.dataService.deepClone(StackedBarChartMerger))
    }

    return new Observable( observer => {
      this.gadgetService.getDataFromBasicConfig(config).subscribe( data => {
        data = this.dataService.flattenObject(data);
        chartOptions = this.handleStylingTab(config, chartOptions, data);
        observer.next(chartOptions);
        observer.complete();
      })
    });
  }

  public handleStylingTab(config: Gadget, chartOptions: Options, apiData: any[]) {
    const stylingData: IBarChartWidgetStyling = config.value.styling;
    const applicationPaths: string[] = []
    // generating the series array starts
    const {applications: applicationData} = stylingData;
    applicationData.forEach( application => {
      applicationPaths.push(application.path);
      const seriesObject: any = {
        name: application.title,
        color: application.color,
        data: []
      };
      chartOptions.series.push(seriesObject);
    })
    // generating the series array ends
    // label changes starts
    if (stylingData.xAxisLabel) {
      (<AxisOptions>(chartOptions.xAxis)).title.text = stylingData.xAxisLabel;
    }
    if (stylingData.yAxisLabel) {
      (<AxisOptions>(chartOptions.yAxis)).title.text = stylingData.yAxisLabel;
    }
    // label changes ends

    if (stylingData.backgroundColor) {
      chartOptions.chart.backgroundColor = stylingData.backgroundColor;
    }
    if (stylingData.isThreeD) {
      chartOptions = this.dataService.deepMerge(chartOptions, this.dataService.deepClone(Chart3dMergerOptions))
    } else {
      chartOptions = this.dataService.deepMerge(chartOptions, {Chart3dDeMergerOptions})
    }
    if (stylingData.showLegend) {
      chartOptions.legend.enabled = true;
    } else {
      chartOptions.legend.enabled = false;
    }
    // handling applications data
    apiData.forEach( entityData => {
      (<AxisOptions>(chartOptions.xAxis)).categories.push(entityData[stylingData.xAxisPath]);
      applicationPaths.forEach( (path, index) => {
        (<SeriesBarOptions>(chartOptions.series[index])).data.push(entityData[path])
      })
    })
    // handling applications data ends
    // if (config.yAxis && config.yAxis.length > 0) {
    //   chartOptions.yAxis = [];

    // }
    return chartOptions;
  }
}
