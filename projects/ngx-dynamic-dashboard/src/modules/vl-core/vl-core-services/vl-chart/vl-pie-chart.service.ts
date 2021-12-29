import { Injectable } from '@angular/core';
import { AxisOptions, Options, Series, SeriesPieOptions } from 'highcharts';
import { VlDataService } from '../vl-data/vl-data.service';
import { isEmptyField } from '../vl_util_functions/common-utils';
import { DonutChartMergerOptions, PieChartSkeleton } from './highcharts-pie--skeleton.cnst';
import { Chart3dMergerOptions } from './highcharts.cnst';
import { IPieChartConfig, IPieChartConfigModel, IPieChartResponseModel } from './pie-chart.model';

@Injectable({
  providedIn: 'root'
})
export class VlPieChartService {

  constructor(
    private dataService: VlDataService
  ) { }
  /**
   * Skeleton config for the pie chart
   * @param type type of the pie chart whether it's a pie or donut (default: pie)
   * @param is3d decides whether 3d should enable or not (default: true)
   * @returns Highchart options for pie chart
   */
  public getPieChartConfig(type: 'pie' | 'donut' = 'pie', is3d: boolean = false): Options {
    let chartOptions: Options = this.dataService.deepClone(PieChartSkeleton);
    if (type === 'donut') {
      chartOptions = this.dataService.deepMerge(chartOptions, this.dataService.deepClone(DonutChartMergerOptions))
    }
    if (is3d) {
      chartOptions = this.dataService.deepMerge(chartOptions, this.dataService.deepClone(Chart3dMergerOptions))
    }
    return chartOptions;
  }

  public formatPieChartData(chartOptions: Options, data: IPieChartResponseModel, config: IPieChartConfig): Options {
    chartOptions.series = [{ name: config.name, data: [], type: 'pie'}]
    let dataObject = this.convertActualDataToObject(data);
    config.config.forEach( innerConfig => {
      let actualTitle = innerConfig.title || innerConfig.key;
      let seriesObject: any = {
        name: actualTitle,
        color: innerConfig.color,
        y: dataObject[innerConfig.key] || null
      };
      (<AxisOptions>(chartOptions.xAxis)).categories.push(actualTitle);
      (<SeriesPieOptions>(chartOptions.series[0])).data.push(seriesObject);
    })
    return chartOptions;
  }

  private convertActualDataToObject(data: IPieChartResponseModel): {[key: string]: string} {
    const dataObject = {};
    if (isEmptyField(data) || isEmptyField(data.data) || isEmptyField(data.data[0]) || isEmptyField(data.data[0].data)) return;
    let actualData = data.data[0].data;
    for (let value of actualData) {
      const [title, chartValue] = value;
      dataObject[title] = chartValue;
    }
    return dataObject;
  }
}
