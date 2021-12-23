import { Injectable, Type } from '@angular/core';

export const BOARD_LIST_API = {
  BASE_API:'BASE_API',
  BOARD_LIST:'BOARD_LIST',
  BOARD_DATA:'BOARD_DATA',
  BOARD_UPDATE:'BOARD_UPDATE',
  BOARD_DELETE:'BOARD_DELETE',
  BOARD_INSERT:'BOARD_INSERT'
  
}


@Injectable({
  providedIn: 'root'
})
export class ExternalService {

  constructor() { }

  static urlMap = new Map();
  
  static getURLValue(apiKey: string): string {
      return ExternalService.urlMap.get(apiKey);
  }

  static setURLValue(apiKey: string, apiValue:String): void {
    console.log(apiKey,apiValue)
    ExternalService.urlMap.set(apiKey, apiValue);
  }

  public setURLList(apiList:{}):any[]{
    const listAPIS = Object.keys(BOARD_LIST_API);

    for(let apiKey in apiList){
      let apiValue = apiList[apiKey];
      const index = listAPIS.findIndex(ele => ele === apiKey);
      if (index != -1) {
        listAPIS.splice(index, 1);
        ExternalService.setURLValue(apiKey,apiValue)
      }
    }
    return listAPIS;
  }
}

