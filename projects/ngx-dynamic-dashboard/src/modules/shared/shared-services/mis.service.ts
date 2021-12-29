
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationMapping } from 'src/app/constants/routing-map.cnst';
import { RouterMapConfig } from 'src/app/models/routing-mapping.model';
import { isEmptyField } from '../../vl-core/vl-core-services/vl_util_functions/common-utils';

@Injectable({
  providedIn: 'root'
})
export class MisService {
  currentTheme = new Subject<any>();

  constructor() { }

  public getRouteFromURL(currentRoute: string, childType: string, parentType: string): string[] {
    const otherRoute = this.getOtherRoute(currentRoute);
    let routeArray: string[] = [''];
    if (!isEmptyField(childType) && NavigationMapping[parentType] && NavigationMapping[parentType].children && NavigationMapping[parentType].children[childType] && NavigationMapping[parentType].children[childType][otherRoute]) {
      const childMapping: RouterMapConfig = NavigationMapping[parentType].children[childType][otherRoute];
      routeArray.push(childMapping.prefix);
      routeArray = routeArray.concat(childMapping.routeArray);
    } else {
      if (NavigationMapping[parentType] && NavigationMapping[parentType] && NavigationMapping[parentType][otherRoute]) {
        const childMapping: RouterMapConfig = NavigationMapping[parentType][otherRoute];
        if(childMapping.prefix){
          routeArray.push(childMapping.prefix);
        }
        routeArray = routeArray.concat(childMapping.routeArray);
      }
    }
    return routeArray;
  }

  public getOtherRoute(currentRoute: string): string {
    return currentRoute === 'mis' ? 'gis' : 'mis';
  }

  setTheme(theme){
    this.currentTheme.next(theme);
  }

  getTheme(){
    return this.currentTheme.asObservable();
  }
}
