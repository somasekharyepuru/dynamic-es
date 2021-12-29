import { Options } from "highcharts";

export const PieChartSkeleton: Options = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
  },
  title: {
    text: ''
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
  },
  plotOptions: {
    pie: {
      shadow: false,
      // innerSize: '50%',
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: false
      },
      showInLegend: true
    },
  },
  exporting: {
    enabled: true
  },
  credits: {
    enabled: false
  },
  xAxis: {
    categories: []
  },
  yAxis: {
    title: {
      text: ""
    }
  },
  series: []
};

export const DonutChartMergerOptions :Options = {
  plotOptions: {
    pie: {
      innerSize: 100,
      depth: 45,
      center: ['50%', '50%'],
      size: '100%',
    }
  }
}
