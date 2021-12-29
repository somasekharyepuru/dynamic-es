import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VlDataService } from '../../vl-core/vl-core-services/vl-data/vl-data.service';
import { APIConfigMapping } from '../../vl-core/vl-core-services/vl-http/api-mapping-config.cnst';
import { HTTPAPIConfig } from '../../vl-core/vl-core-services/vl-http/http-api.config';
import { VlHttpService } from '../../vl-core/vl-core-services/vl-http/vl-http.service';
import { Board, Gadget } from '../models/Board';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(
    private dataService: VlDataService,
    private httpService: VlHttpService
  ) { }

  public getBoard(id?: string): Observable<Board | Board[]> {
    const apiConfig: HTTPAPIConfig = this.dataService.deepClone(!!id ? APIConfigMapping.FETCH_BOARD_DATA: APIConfigMapping.FETCH_BOARDS)
    apiConfig.postData = {
      id
    };
    return this.httpService.placeAPICall(apiConfig);
  }

  public updateBoard(id: string, boardJson: Board): Observable<Board> {
    const apiConfig: HTTPAPIConfig = this.dataService.deepClone(APIConfigMapping.UPDATE_BOARD_DATA)
    apiConfig.postData = {
      id,
      json: boardJson
    };
    return this.httpService.placeAPICall(apiConfig);
  }

  public updateWidget(id: string, widgetId: string,  gadgetJson: Gadget): Observable<Board> {
    const apiConfig: HTTPAPIConfig = this.dataService.deepClone(APIConfigMapping.UPDATE_WIDGET_DATA)
    apiConfig.postData = {
      id,
      widgetId,
      json: gadgetJson
    };
    return this.httpService.placeAPICall(apiConfig);
  }
}
