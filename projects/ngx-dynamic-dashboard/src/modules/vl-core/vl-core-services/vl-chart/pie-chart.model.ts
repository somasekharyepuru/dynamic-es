export interface IPieChartConfig {
  name: string;
  config: IPieChartConfigModel[]
}
export interface IPieChartConfigModel {
  /**
   * backend value name to pic from the strLabels
   */
  key: string;
  /**
   * color for the value
   */
  color?: string;
  /**
   * title will be replaced by key if provided
   */
  title?: string;
}

export interface IPieChartResponseModel {
  data: PieChartActualData[];
  labels?: any;
  strlables: string[];
}

interface PieChartActualData {
  data: (number | string)[][];
}
