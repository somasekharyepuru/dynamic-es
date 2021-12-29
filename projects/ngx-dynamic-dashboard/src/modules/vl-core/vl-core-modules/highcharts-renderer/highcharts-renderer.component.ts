import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const threed = require('highcharts/highcharts-3d');
Boost(Highcharts);
More(Highcharts);
noData(Highcharts);
threed(Highcharts);
@Component({
  selector: 'vl-highcharts-renderer',
  templateUrl: './highcharts-renderer.component.html',
  styleUrls: ['./highcharts-renderer.component.scss']
})
export class HighchartsRendererComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  @Input() chartOptions: Options;
  @Input() height: any;
  dataPresent = false;
  updateChart = false;
  sample: any;

  constructor() { }

  ngOnInit() {
    this.sample = {
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      title: {
          text: 'Browser market shares in January, 2018'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
          }
      },
      series: [{
          name: 'Brands',
          colorByPoint: true,
          data: [{
              name: 'Chrome',
              y: 61.41,
              sliced: true,
              selected: true
          }, {
              name: 'Internet Explorer',
              y: 11.84
          }, {
              name: 'Firefox',
              y: 10.85
          }, {
              name: 'Edge',
              y: 4.67
          }, {
              name: 'Safari',
              y: 4.18
          }, {
              name: 'Sogou Explorer',
              y: 1.64
          }, {
              name: 'Opera',
              y: 1.6
          }, {
              name: 'QQ',
              y: 1.2
          }, {
              name: 'Other',
              y: 2.61
          }]
      }]
  }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.chartOptions, 'op here')
    this.chartOptions = changes.chartOptions.currentValue;
    if (Object.keys(this.chartOptions).length > 0) {
      this.dataPresent = true;
      this.updateChart = true;
    }
  }

}


