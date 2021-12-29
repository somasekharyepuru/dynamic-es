import { HTTPAPIConfig } from './http-api.config';
/**
 * will have all the api config mapping for the project
 */
export const APIConfigMapping: {
  [key: string]: HTTPAPIConfig;
} = {
  RAINFALL_CHART: {
    method: 'post',
    apiKeyName: 'RAINFALL_CHART',
    postData: {
      // hardcoded currently will get from the component or the url parameters
      cType: 'MANDAL',
      aggr: 'SUM',
      component: 'rainfall',
      chartType: 'pie',
      summary: false,
      pEUUID: '6f86292b-dd9a-4987-bb8f-c3940263b349',
      format: 'yyyyMMdd',
      lType: 'STATE',
      lUUID: '6f86292b-dd9a-4987-bb8f-c3940263b349',
      src: 'AWS',
      sDate: '20210601',
      eDate: '20210716',
      view: 'ADMIN',
    },
  },
  MITANK_TABLE: {
    method: 'post',
    apiKeyName: 'MITANK_TABLE',
    postData: {
      structureType: 'MI_TANK',
      cMDType: 'ALL',
      cType: 'DISTRICT',
      sUUID: '6f86292b-dd9a-4987-bb8f-c3940263b349',
      timePeriod: 'LASTKNOWN',
      pUUID: '6f86292b-dd9a-4987-bb8f-c3940263b349',
      view: 'ADMIN',
      lType: 'STATE',
      src: 'AWS',
    }
  },
  RAINFALL_MAP: {
    method: 'post',
    urlString: 'FORECAST_API',
    apiKeyName: 'RAINFALL_MAP',
    postData: { view: "ADMIN", lUUID: "2b9beab2-1495-4f05-b4da-29761ebeb2ee", sUUID: "2b9beab2-1495-4f05-b4da-29761ebeb2ee", format: "yyyyMMdd", src: 'AP_AWS', sDate: "20210731", eDate: 20210731, aggr: 'SUM', component: 'rainfall', daterange: "Yesterday", type: "ACTUAL" }
  },

  LIBRARY_CONFIG: {
    method: 'get',
    apiKeyName: '/assets/api/gadget-library-model.json',
    postData: {},
    isEntireUrl: true
  },
  FETCH_BOARDS: {
    method: 'get',
    apiKeyName: 'FETCH_BOARDS',
    postData: {}
  },
  FETCH_BOARD_DATA: {
    method: 'get',
    apiKeyName: 'FETCH_BOARD_DATA',
    postData: {},
  },
  UPDATE_BOARD_DATA: {
    method: 'post',
    apiKeyName: 'FETCH_BOARD_DATA',
    postData: {},
  },
  UPDATE_WIDGET_DATA: {
    method: 'post',
    apiKeyName: 'UPDATE_WIDGET_DATA',
    postData: {},
  }
};
