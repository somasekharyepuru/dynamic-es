import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { Observable, throwError, forkJoin } from 'rxjs';
import { HttpUtilsService } from './http-utils.service';
import { APIMapping } from './api-mapping.cnst';
import { HTTPAPIConfig } from './http-api.config';
import { isEmptyField, isEmptyObject } from '../vl_util_functions/common-utils';
import { VlDataService } from '../vl-data/vl-data.service';
import { defaultHTTPConfig } from './default-http-config.cnst';
/**
 * Handles the api calls
 * Two important things one is APIMapping, APIConfigMapping
 * APIMapping will consists of all the urls for particular feautre
 * APIConfigMapping will consists the config for the specific feautre (Interface HTTPAPIConfig)
 * process::
 * Get the api config from the APIConfigMapping
 * attach your postdata, header, params if any
 * pass the apiconfig to the httpService.placeCall() method
 * if you have a multiple apiconfigs use httpService.placeMultipleAPICalls(...apiConfigsArray)
 * subscribe to the http that retrun by the httpService
 * handle errors by using error call back if you need
 */
@Injectable({
  providedIn: 'root'
})
export class VlHttpService {
  /**
   * API_Mapping object referred to the APIMappingConstant
   */
  private API_MAPPING: object = APIMapping;
  /**
   * URL_Mapping object referred to the environment urlMapping
   */
  private URL_MAPPING: object = {};
  /**
   * defaultHTTPConfig object referred to the defaultHTTPConfig constant
   */
  private defaultHTTPConfig: HTTPAPIConfig = defaultHTTPConfig;

  constructor(
    /**
     * http client module from the angular/common/http
     */
    private http: HttpClient,
    /**
     * vl data service
     */
    private dataService: VlDataService,
    /**
     * httpUtilsService
     */
    private httpUtilService: HttpUtilsService
  ) { }
  /**
   * will return the options merged with default options
   * @param config HTTPAPIConfig
   * return Options Interface
   */
  private getOptions(config?: HTTPAPIConfig): any {
    if (isEmptyField(config.options)) {
      config.options = {};
    }
    const options = this.dataService.deepMerge(this.defaultHTTPConfig.options, config.options);
    const optionHeaders = this.dataService.deepClone(options.headers);
    const optionParams = this.dataService.deepClone(options.params);
    if (!isEmptyField(optionHeaders) && Object.keys(optionHeaders).length > 0) {
      const headers = {};
      for (const header in optionHeaders) {
        if (optionHeaders.hasOwnProperty(header)) {
          headers[header] = optionHeaders[header];
        }

      }
      options.headers = headers;
    }
    if (!isEmptyField(optionParams) && Object.keys(optionParams).length > 0) {
      const params = {};
      for (const param in optionParams) {
        if (optionParams.hasOwnProperty(param)) {
          params[param] = optionParams[param];
        }

      }
      options.params = params;
    }
    return options;
  }
  /**
   * main method need to call from the http service
   * @param config HTTPAPIConfig
   */
  public placeAPICall(config: HTTPAPIConfig): Observable<any> {
    return this.processConfig(config);
  }
  public placeMultipleAPICalls(apiConfigArray: HTTPAPIConfig[]): Observable<any> {
    const joinList = [];
    apiConfigArray.forEach(apiConfig => {
      joinList.push(this.processConfig(apiConfig));
    });
    return forkJoin(joinList);
  }

  private processConfig(config: HTTPAPIConfig): Observable<any> {
    // tslint:disable-next-line: prefer-const

    const actualConfig: HTTPAPIConfig = this.dataService.deepMerge(this.defaultHTTPConfig, config);
    if (isEmptyField(actualConfig.urlString)) {
      actualConfig.urlString = 'PROJ_API';
    }
    if (isEmptyField(actualConfig.isEntireUrl)) {
      actualConfig.isEntireUrl = false;
    }
    // please uncomment after the you have added the authService
    // if (!isEmptyField(config.userFieldsToAdd)) {
    //   actualConfig.postData = this.httpUtilService.addUserFields(config.userFieldsToAdd, actualConfig.postData);
    // }
    if (!isEmptyObject(config.routerParamsToAdd)) {
      // actualConfig.postData = this.httpUtilService.addRouteFields(config, actualConfig.postData);
    }
    if (!isEmptyField(config.postDataFormatter)) {
      if (!isEmptyField(config.postDataFormatter.functionName)) {
        actualConfig.postData = this.httpUtilService[actualConfig.postDataFormatter.functionName](actualConfig.postData, config);
      }
      if (!isEmptyField(config.postDataFormatter.formatter)) {
        actualConfig.postData = config.postDataFormatter.formatter(actualConfig.postData, config);
      }
    }
    const urlStringMap = this.URL_MAPPING[actualConfig.urlString];
    const apiStatus: any = this.isValidAPICall(actualConfig.apiKeyName, urlStringMap, actualConfig.isEntireUrl);
    // console.log(apiStatus, 'api status here');
    let finalUrl = apiStatus.api;
    if (!actualConfig.isEntireUrl) {
      finalUrl = urlStringMap + apiStatus.api;
    }
    if (apiStatus.valid) {
      return this[actualConfig.method](finalUrl, actualConfig.postData, actualConfig);
    } else {
      return throwError({ status: false, msg: apiStatus.msg });
    }
  }
  /**
   * instantiate post method
   * @param url finalUrl to get called
   * @param postData postData
   * @param config apiConfig
   * return Observable with http call
   */
  private post(url: string, postData: any, config: HTTPAPIConfig): Observable<any> {
    return this.http.post(url, postData, this.getOptions(config));
  }
  /**
   * instantiate multipart method
   * @param url finalUrl to get called
   * @param postData postData
   * @param config apiConfig
   * return Observable with http call
   */
  private multipart(url: string, postData: any, config: HTTPAPIConfig): Observable<any> {
    const fd = this.createFormData(postData);
    return this.http.post(url, fd, this.getOptions(config));
  }
  /**
   * will convert object to flat structure
   * @param object object to get converted as form data
   * @param form form to attach
   * @param namespace namespace to be added
   * return formData with flat Structure
   */
  // tslint:disable-next-line: ban-types
  private createFormData(object: Object, form?: FormData, namespace?: string): FormData {
    const formData = form || new FormData();
    for (const property in object) {
      if (!object.hasOwnProperty(property) || isNullOrUndefined(object[property])) {
        continue;
      }
      const formKey = namespace ? `${namespace}[${property}]` : property;
      if (object[property] instanceof Date) {
        formData.append(formKey, object[property].toISOString());
      } else if (typeof object[property] === 'object' && !(object[property] instanceof File)) {
        this.createFormData(object[property], formData, formKey);
      } else {
        formData.append(formKey, object[property]);
      }
    }
    return formData;
  }
  /**
   * instantiate get method
   * @param url finalUrl to get called
   * @param postData postData
   * @param config apiConfig
   * return Observable with http call
   */
  private get(url: string, postData: any, config: HTTPAPIConfig): Observable<any> {
    const splitUrl = url.split('/');
    for (const postVal in postData) {
      if (postData.hasOwnProperty(postVal)) {
        const paramIndex = splitUrl.indexOf(':' + postVal);
        if (paramIndex !== -1) {
          splitUrl[paramIndex] = postData[postVal];
        }
      }
    }
    url = splitUrl.join('/');
    return this.http.get(url, this.getOptions(config));
  }
  /**
   * verify the status of api whether it is present or not in the api mapping
   * @param api api from the apiConfig
   * @param url url from the urlMapping
   * @param isEntireUrl boolean for isEntireUrl or not
   * return success or failure
   */
  private isValidAPICall(api: string, url: string, isEntireUrl: boolean): object {
    if (isEntireUrl) {
      return { valid: true, api };
    }
    if (!isNullOrUndefined(this.API_MAPPING)) {
      const currentApi = this.API_MAPPING[api];
      if (!isNullOrUndefined(currentApi)) {
        return { valid: true, api: currentApi };
      } else {
        console.log('API_MAPPING not found for for ' + api + '..Please update API_MAPPING in Project Constants (ProjConst)');
        return { valid: false, msg: 'API_MAPPING not found for ' + api };
      }
    } else {
      console.log('API_MAPPING not found in Project Constants (ProjConst)');
      return { valid: false, msg: 'API_MAPPING not found in Project Constants (ProjConst)' };
    }
  }
}
