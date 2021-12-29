import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedFilterService {
  filterForm = new Subject<any>();
  filterData = {};
  currentLocationValue = 'AP';

  constructor(
  ) {
    this.filterForm.pipe(
      finalize(() => this.resetFilterData())
    );
  }

  public updateFilterForm(data, changedFields?: any[]) {
    if (JSON.stringify(data) === JSON.stringify(this.filterData)) {
      return;
    }
    this.filterData = data;
    const nextData: any = {};
    nextData.data = data;
    if (changedFields.length > 0) {
      nextData.changedFields = changedFields;
    }
    this.filterForm.next(nextData);
  }

  public resetFilterData() {
    this.filterData = {};
  }

  private getNumberOfSplits(paramObject: any) {
    let intervalList: number[] = [];
    for (let i = paramObject.minRange; i<= paramObject.maxRange; i++) {
      intervalList.push(i)
    }
    return intervalList;
  }
}
