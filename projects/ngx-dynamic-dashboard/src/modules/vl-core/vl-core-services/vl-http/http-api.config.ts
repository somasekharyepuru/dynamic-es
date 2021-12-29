import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface HTTPAPIConfig {
  /**
   * type of http method currently supports get, post, and multipart
   * get method url will be api/geturl/:param1/:param2 (send param1, param2 in the postdata)
   * post method url will be api/posturl
   * multipart method url will be api/posturl
   * multipart will convert all the postdata to  the flat multi-form data
   */
  method: 'get' | 'post' | 'multipart';
  /**
   * api actual url name which will pick from APIMapping
   */
  apiKeyName: string;
  /**
   * body of the url
   * just send an object with key, value pair
   */
  postData?: any;
  /**
   * will pick from the environment.urlMapping
   * this will append to the url you mentioned in the APIMapping
   * default Value :: PROJ_API
   */
  urlString?: string;
  /**
   * boolean which represents whether the APIKeyName is entire URL or not
   * if entire url won't be combined with urlString
   */
  isEntireUrl?: boolean;
  /**
   * @deprecated
   * any fields need to add from the user Service
   * required the auth service for this
   */
  userFieldsToAdd?: string[] | { [propName: string]: any };
  /**
   * any fields from route will add here
   * params will add from the params
   * queryParams will add from the query params
   */
  routerParamsToAdd?: {
    params?: { [propName: string]: any },
    queryParams?: { [propName: string]: any }
  };
  /**
   * post data formatter is executed once all the fields added to postdata
   * will call a function with function name from httpUtilsService if functionName exists
   * we can have a own formatter as a function which will be given postdata as param1
   */
  postDataFormatter?: {
    functionName?: string;
    formatter?: functionReference
  };
  /**
   * data formatter is executed once all the fields added to data
   * will call a function with function name from httpUtilsService if functionName exists
   * we can have a own formatter as a function which will be given data as param1
   */
   dataFormatter?: {
    functionName?: string;
    formatter?: functionReference
  };
  /**
   * httpOptions
   */
  options?: {
    /**
     * headers for the request
     */
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    /**
     * observer type will be body or response etc..
     */
    observe?: string;
    /**
     * params for the response
     */
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    /**
     * boolean value for reportProgress
     */
    reportProgress?: boolean;
    /**
     * responseType
     */
    responseType?: string;
    /**
     * boolean for with credentials
     */
    withCredentials?: boolean;
  };
  /**
   * urlPrefix mainly used for the GIS
   */
  urlPrefix?: string;
}

type functionReference = (...args: any) => any;
