import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RuntimeService } from 'ngx-dynamic-dashboard';
import {catchError} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class BarChartService {


  constructor(private _http: HttpClient) {
  }

  get() {
      return this._http.get('/assets/api/bar-chart.model.json')
          .pipe(
              catchError(RuntimeService.handleError)
          );
  }
}
