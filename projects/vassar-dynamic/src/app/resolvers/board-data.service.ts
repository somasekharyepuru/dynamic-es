import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { VlDataService } from '../../vl-core/vl-core-services/vl-data/vl-data.service';
import { APIConfigMapping } from '../../vl-core/vl-core-services/vl-http/api-mapping-config.cnst';
import { HTTPAPIConfig } from '../../vl-core/vl-core-services/vl-http/http-api.config';
import { VlHttpService } from '../../vl-core/vl-core-services/vl-http/vl-http.service';
import { BoardService } from '../services/board.service';

@Injectable({
  providedIn: 'root'
})
export class BoardDataService implements Resolve<any> {
  constructor(private boardService: BoardService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

      return this.boardService.getBoard(route.data.boardId)
  }

}
