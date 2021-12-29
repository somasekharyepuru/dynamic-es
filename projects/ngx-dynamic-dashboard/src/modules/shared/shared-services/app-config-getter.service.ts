import { Injectable } from '@angular/core';
import { AppConfig } from '../../../constants/app-config.cnst';
import { IModuleAppConfig } from '../../../models/app-config.model';
import { VlDataService } from '../../vl-core/vl-core-services/vl-data/vl-data.service';
import { isEmptyField } from '../../vl-core/vl-core-services/vl_util_functions/common-utils';

@Injectable({
  providedIn: 'root'
})
export class AppConfigGetterService {
  private appConfig: {[key: string]: IModuleAppConfig} = {};
  constructor(
    private dataService: VlDataService
  ) {
    this.appConfig = this.dataService.deepClone(AppConfig);
  }

  public getConfigs(urlArray: string[]) {
    console.log(urlArray)
    let config: {[key: string]: IModuleAppConfig} = this.appConfig;
    for (let [index, url] of urlArray.entries()) {
      if (index === 0) continue;
      if (isEmptyField(config[url])) {
        return {};
      }
      if (config[url].isLeafNode) {
        return config;
      }
      config = config[url].children;
      if (index === urlArray.length - 1) return config;
    }
  }
}
