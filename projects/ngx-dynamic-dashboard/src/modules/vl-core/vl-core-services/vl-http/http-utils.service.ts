import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
}
)
export class HttpUtilsService {

  constructor(
  ) { }
  /**
   * add the user fields from the existing authService and should have get userDetails method
   * @param config userFieldsNeedsToAdd config from the apiConfig
   * @param postData existing post data
   * returns postdata after adding fields
   */
  // addUserFields(config, postData) {
  //   if (Array.isArray(config)) {
  //     config.forEach( userField => {
  //       postData[userField] = this.dummyAuth.getUserDetails(userField);
  //     });
  //   } else {
  //     for (let field of Object.keys(config)) {
  //       postData[config[field]] = this.dummyAuth.getUserDetails(field);
  //     }
  //   }
  //   return postData;
  // }
  /**
   * will add the router fields based on the router config
   * add param fields from params config and queryParam fields from the queryParamConfig
   * @param routerConfig routerConfig from the apiConfig
   * @param postData existing Postdata
   * returns the new Postdata after adding all the router data
   */
  //  addRouteFields(config: HTTPAPIConfig, postData) {
  //    let queryParams: Params = this.route.snapshot.queryParams;
  //    if (config.urlPrefix) {
  //     queryParams = this.paramService.getParams(this.route.snapshot.queryParams, config.urlPrefix);
  //    }
  //    const routerConfig = config.routerParamsToAdd;
  //    if (!isEmptyObject(routerConfig.queryParams)) {
  //     for (const param of Object.keys(routerConfig.queryParams)) {
  //       postData[routerConfig.queryParams[param]] = queryParams[param];
  //     }
  //   }
  //    if (!isEmptyObject(routerConfig.params)) {
  //     for (const param of Object.keys(routerConfig.params)) {
  //       postData[routerConfig.params[param]] = this.route.snapshot.params[param];
  //     }
  //   }
  //    return postData;
  // }
}
