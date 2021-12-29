import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VlStorageService } from '../../vl-core/vl-core-services/vl-storage.service';
import { VlHttpService } from '../../vl-core/vl-core-services/vl-http/vl-http.service';

import { APIConfigMapping } from '../../vl-core/vl-core-services/vl-http/api-mapping-config.cnst';
import { ILibraryConfig, ILibrary } from '../../../models/library.model';

@Injectable({
  providedIn: 'root'
})
export class LibDataService {

  constructor(
    private httpService: VlHttpService,
    private storageService: VlStorageService
  ) { }
  // todo get libData form the storage or get from the json file or backend

  public getLibData(): Observable<ILibraryConfig> {
    return new Observable( observer => {
      this.httpService.placeAPICall(APIConfigMapping.LIBRARY_CONFIG).subscribe( (data: ILibraryConfig) => {
        this.storageService.add('libConfig', data);
        observer.next(data);
        observer.complete();
      }, error => {
        observer.next(null);
        observer.complete();
      })
    })
  }

  public getConfigForGadget(gadgetName): Observable<ILibrary> {
    return new Observable( observer => {
      this.getLibData().subscribe( data => {
        const [gadgetLib] = data.library.filter( libConfig => libConfig.componentType === gadgetName);
        observer.next(gadgetLib);
        observer.complete();
      }, error => {
        observer.next(null);
        observer.complete();
      })
    })
  }
}
