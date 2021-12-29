import { Component, OnInit, OnDestroy, OnChanges, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { delay } from "rxjs/operators";
import { VlDataService } from "../../vl-core-services/vl-data/vl-data.service";
import { HttpUtilsService } from "../../vl-core-services/vl-http/http-utils.service";
import { VlHttpService } from "../../vl-core-services/vl-http/vl-http.service";
import { isEmptyField } from '../../vl-core-services/vl_util_functions/common-utils';
import { SelectConfig, SelectDropdownOption } from './vl-select-models/vl-select-dropdown';

@Component({
  selector: 'app-vl-select',
  templateUrl: './vl-select.component.html',
  styleUrls: ['./vl-select.component.scss']
})
export class VlSelectComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectConfig: SelectConfig;
  @Input() control: FormControl;
  @Output() valueChange = new EventEmitter<any>();
  @Input() width?: number;
  optionsArray: Observable<SelectDropdownOption[]>;
  actualConfig: any;
  actualOptions: SelectDropdownOption[] = [];
  selectedItems: any;
  loading = true;
  virtualScroll = true;

  defaultConfig = {
    bindLabel: 'title',
    bindValue: 'key',
    loadingText: 'Loading ...',
    readonly: false,
    multiple: false,
    closeOnSelect: true,
    clearable: false,
  };

  constructor(
    private dataService: VlDataService,
    private httpService: VlHttpService,
    private httpUtilsService: HttpUtilsService
  ) { }

  ngOnInit() {
    if (isEmptyField(this.selectConfig)) {
      return;
    }
    this.selectConfig = this.dataService.deepClone(this.selectConfig);
    this.actualConfig = this.dataService.deepMerge(this.defaultConfig, this.selectConfig.ngSelectConfig);
    if (this.selectConfig.type === 'manual') {
      this.optionsArray = this.getManualCall().pipe(delay(500));
      this.loading = false;
    } else if (this.selectConfig.type === 'api') {
      this.optionsArray = this.getAPICall().pipe(delay(100));
    } else {
      this.optionsArray = this.getServiceCall().pipe(delay(100));
      this.loading = false;
    }

    if (!isEmptyField(this.control) && !isEmptyField(this.control.value)) {
      this.selectedItems = this.control.value;
    }

    if (!isEmptyField(this.control)) {
      this.control.valueChanges.subscribe( data => {
        this.selectedItems = data;
      });
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes, 'changes here');
  }

  getManualCall(): Observable<any> {
    return new Observable( observer => {
      if (this.selectConfig.byDefaultSelect && isEmptyField(this.control.value)) {
        this.selectedItems = this.selectConfig.byDefaultSelect;
        this.setFormValue(this.selectConfig.byDefaultSelect);
      }
      if (!isEmptyField(this.selectConfig.allFieldName)) {
        this.selectConfig.options.unshift(this.getAllField(this.selectConfig.allFieldName));
      }
      observer.next(this.selectConfig.options);
      observer.complete();
    });
  }

  getServiceCall(): Observable<any> {
    const paramObject = this.selectConfig.serviceConfig.paramObject;
    return new Observable( observer => {
      observer.next([]);
      observer.complete();
      // this.filterService[this.selectConfig.serviceConfig.functionName](paramObject).subscribe ( data => {
      //   // if (!isEmptyObject(this.selectConfig.serviceConfig) &&  this.selectConfig.serviceConfig.titleField === 'arrayItem') {
      //   //   this.optionsServiceData = this.convertArrayToArrayOfObject(data);
      //   // }
      //   this.processServiceData(data, 'serviceConfig');
      //   observer.next(this.actualOptions);
      //   observer.complete();
      // }, error => {
      //   observer.next([]);
      //   observer.complete();
      // }, () => {
      //   this.loading = false;
      // });
    });
  }

  getAPICall(): Observable<any> {
    return new Observable( observer => {
      if (this.selectConfig.apiConfig && !isEmptyField(this.selectConfig.apiConfig.postDataFormatter)) {
        if (this.selectConfig.apiConfig.postDataFormatter.formatter) {
          this.selectConfig.apiConfig.postData = this.selectConfig.apiConfig.postDataFormatter.formatter(this.selectConfig.apiConfig.postData);
        }
        if (!isEmptyField(this.selectConfig.apiConfig.postDataFormatter.functionName)) {
          this.selectConfig.apiConfig.postData = this.httpUtilsService[this.selectConfig.apiConfig.postDataFormatter.functionName](this.selectConfig.apiConfig.postData);
        }
      }
      this.httpService.placeAPICall(this.selectConfig.apiConfig).subscribe ( data => {
        // if (this.selectConfig.apiConfig && !isEmptyField(this.selectConfig.apiConfig.dataFormatter)) {
        //   data = this.selectConfig.apiConfig.dataFormatter(data);
        // }
        this.processServiceData(data, 'apiConfig');
        observer.next(this.actualOptions);
        observer.complete();
      }, error => {
        observer.next([]);
        observer.complete();
      }, () => {
        this.loading = false;
      });
    });
  }

  processServiceData(data, configType) {
    let optionsAPIData = this.convertDataToArrayOfObject(data, configType);
    // console.log('[options API data]::', optionsAPIData);
    optionsAPIData = this.dataService.flattenObject(optionsAPIData);
    optionsAPIData.forEach(element => {
      this.actualOptions.push(this.getOptionObject(element, configType));
    });
    if (!isEmptyField(this.selectConfig.allFieldName)) {
      this.actualOptions.unshift(this.getAllField(this.selectConfig.allFieldName));
    }
    if (this.actualOptions.length > 0 && this.selectConfig.byDefaultSelect && isEmptyField(this.control.value)) {
      if (this.selectConfig.byDefaultSelect  === 'firstElement') {
        this.selectedItems = this.actualOptions[0][this.actualConfig.bindValue];
        this.setFormValue(this.actualOptions[0][this.actualConfig.bindValue]);
      } else {
        this.selectedItems = this.selectConfig.byDefaultSelect;
        this.setFormValue(this.selectConfig.byDefaultSelect);
      }
    }
  }

  convertDataToArrayOfObject(data, configType) {
    const config = this.selectConfig[configType];
    if (config.titleField === 'arrayItem') {
      return this.convertArrayToArrayOfObject(data, configType);
    } else if (config.titleField === 'objectKey' || config.titleField === 'objectValue') {
      return this.convertObjectToArrayOfObject(data, configType);
    } else {
      return data;
    }
  }

  convertObjectToArrayOfObject(data, configType) {
    const config = this.selectConfig[configType];

    const returnArray = [];
    Object.keys(data).forEach( element => {
      const tmpObj: any = {};
      tmpObj[this.actualConfig.bindLabel] = this.getDataBasedOnOption(config.titleField, element, data);
      tmpObj[this.actualConfig.bindValue] = this.getDataBasedOnOption(config.keyField, element, data);
      returnArray.push(tmpObj);
    });
    this.selectConfig[configType].titleField = this.actualConfig.bindLabel;
    this.selectConfig[configType].keyField = this.actualConfig.bindValue;
    return returnArray;
  }

  getDataBasedOnOption(option, key, data) {
    if (option === 'objectKey') {
      return key;
    } else if ( option === 'objectValue') {
      return data[key];
    } else {
      return data[option];
    }
  }
  convertArrayToArrayOfObject(data: any[], configType) {
    const returnArray = [];
    data.forEach( element => {
      const tmpObj: any = {};
      tmpObj[this.actualConfig.bindLabel] = element;
      tmpObj[this.actualConfig.bindValue] = element;
      returnArray.push(tmpObj);
    });
    this.selectConfig[configType].titleField = this.actualConfig.bindLabel;
    this.selectConfig[configType].keyField = this.actualConfig.bindValue;
    return returnArray;
  }

  getOptionObject(option, field) {
    const optionObject: SelectDropdownOption = {};
    // if (this.selectConfig[field].titleField === 'arrayItem') {
    //   optionObject[this.actualConfig.bindLabel] = option;
    //   optionObject[this.actualConfig.bindValue] = option;
    // } else {
    optionObject[this.actualConfig.bindLabel] = option[this.selectConfig[field].titleField] ? option[this.selectConfig[field].titleField] : '';
    optionObject[this.actualConfig.bindValue] = option[this.selectConfig[field].keyField] ? option[this.selectConfig[field].keyField] : '';
    // }
    optionObject.icon = option.icon ? option.icon : null;
    return optionObject;
   }


   getAllField(name) {
     const tmpObj = {};
     const prefix = this.selectConfig.title[this.selectConfig.title.length - 1] === 's' ? 'es' : 's' ;
     tmpObj[this.actualConfig.bindLabel] = 'All ' + this.selectConfig.title + prefix;
     tmpObj[this.actualConfig.bindValue] = name;
     return tmpObj;
   }

   optionChanged(e) {
     if (!isEmptyField(this.control)) {
       this.setFormValue(this.selectedItems);
     }
     this.valueChange.emit(this.selectedItems);
   }

  setFormValue(value) {
    this.control.setValue(value);
   }

   ngOnDestroy() {

   }

}


