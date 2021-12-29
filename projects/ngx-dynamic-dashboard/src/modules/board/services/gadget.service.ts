import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VlDataService } from '../../vl-core/vl-core-services/vl-data/vl-data.service';
import { HTTPAPIConfig } from '../../vl-core/vl-core-services/vl-http/http-api.config';
import { VlHttpService } from '../../vl-core/vl-core-services/vl-http/vl-http.service';
import { Gadget } from '../models/Board';

@Injectable({
  providedIn: 'root'
})
export class GadgetService {

  constructor(
    private httpService: VlHttpService,
    private dataService: VlDataService
  ) { }

  public getDataFromBasicConfig(config: Gadget): Observable<any> {
    const {basic: basicInfo}= config.value;
    return new Observable( observer => {
      const apiConfig: HTTPAPIConfig = this.dataService.deepClone({
        method: basicInfo.method,
        apiKeyName: basicInfo.url,
        postData:basicInfo.postData,
        isEntireUrl: true
      })
      this.httpService.placeAPICall(apiConfig).subscribe( data => {
        observer.next(data);
        observer.complete();
      }, error => {
        observer.error(new Error(error));
        observer.complete();
      });
    })
  }
}
