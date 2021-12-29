import { HTTPAPIConfig } from './http-api.config';

export const defaultHTTPConfig: HTTPAPIConfig = {
  method: 'get',
  apiKeyName: 'authenticate',
  postData: {},
  isEntireUrl: false,
  urlString: 'PROJ_API',
  userFieldsToAdd: [],
  routerParamsToAdd: {},
  options: {
    headers: {
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*'
    }
  }
};
