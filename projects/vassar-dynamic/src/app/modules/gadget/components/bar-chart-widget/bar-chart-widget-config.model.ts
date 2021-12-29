export interface IBarChartWidgetConfig {
  basic: IBarChartWidgetBasic,
  styling: IBarChartWidgetStyling,
  advanced: IBarChartWidgetAdvanced
}

export interface IBarChartWidgetBasic {
  title: string;
  method: 'get' | 'post';
  url: string;
  postData: any;
}

export interface IBarChartWidgetStyling {
  xAxisLabel: string;
  xAxisPath: 'get' | 'post';
  yAxisLabel: string;
  applications: IBarChartWidgetStylingApplications[];
  backgroundColor: string;
  isThreeD: string;
  showLegend: boolean;
}

export interface IBarChartWidgetStylingApplications {
  title: string;
  path: string;
  color: string;
  position: string;
}

export interface IBarChartWidgetAdvanced {
  highChartsJSON: string;
  customJS: string;
}

