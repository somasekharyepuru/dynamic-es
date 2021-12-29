import * as Highcharts from 'highcharts';
import { Options } from "highcharts";

export const BarChartSkeleton: Options = {
  chart: {
    type: 'column'
  },
  title: {
    text: null
  },
  subtitle: {
    text: null
  },
  xAxis: {
    categories: [],
    title: {
      text: null
    }
  },
  yAxis: {
    title: {
      text: null
    }
  },
  tooltip: {
    valueSuffix: ' millions'
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0
    }
  },
  legend: {
    enabled: true
  },
  credits: {
    enabled: false
  },
  series: []
};

export const PercentageBarChartMerger: Options = {
  plotOptions: {
    column: {
      stacking: 'percent'
    }
  }
}

export const StackedBarChartMerger: Options = {
  plotOptions: {
    column: {
      stacking: 'normal'
    }
  }
}

