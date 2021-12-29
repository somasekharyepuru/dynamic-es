import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, QueryList, Input, Output, ChangeDetectorRef, EventEmitter, TemplateRef, forwardRef } from "@angular/core";
import { FormGroup, ValidatorFn, Validators, FormControl, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { isNullOrUndefined } from "util";
import { VlDataService } from "../../vl-core-services/vl-data/vl-data.service";
import { VlDateFormatService } from "../../vl-core-services/vl-date/vl-date-format.service";
import { APIConfigMapping } from "../../vl-core-services/vl-http/api-mapping-config.cnst";
import { VlHttpService } from "../../vl-core-services/vl-http/vl-http.service";
import { VlFilter, VlFilterConfig } from "./vl-filter-models/vl-filter.model";
import { BsDatepickerDirective, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { isEmptyField } from '../../vl-core-services/vl_util_functions/common-utils';
import { HTTPAPIConfig } from '../../vl-core-services/vl-http/http-api.config';
import { MonacoEditorLoaderService } from '@materia-ui/ngx-monaco-editor';
import { filter, take } from 'rxjs/operators';
import { TemplateReferenceDirective } from '../../../shared/shared-directives/template-reference.directive';

@Component({
  selector: 'app-vl-filter',
  templateUrl: './vl-filter.component.html',
  styleUrls: ['./vl-filter.component.scss']
})
export class VlFilterComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * todo need to add the other types here in the form html like formArray etc...
   */
  @ViewChildren('dp') datePickers: QueryList<BsDatepickerDirective>;
  @ViewChildren(forwardRef(() => TemplateReferenceDirective)) templates: QueryList<TemplateReferenceDirective>;
  editorOptions = {theme: 'vs-dark', language: 'JSON'};
  modelUri: monaco.Uri;

  @Input() filterConfig: VlFilter;
  @Output() formChange = new EventEmitter<any>();
  @Input() initFilterData: any;
  @Output() reset = new EventEmitter<any>();
  @Input() formGroupInput: FormGroup;
  filterForm: FormGroup = new FormGroup({});
  templateTypes = {};
  startDatePicker: BsDatepickerDirective;
  endDatePicker: BsDatepickerDirective;
  startDateConfig: Partial<BsDatepickerConfig>;
  endDateConfig: Partial<BsDatepickerConfig>;
  startDateKey: string;
  endDateKey: string;
  filterData: any;
  isLocationHierarchyChanged = false;
  isLocationLevelChanged = false;
  maxDate: Date;
  showFilterSpinner = false;
  currentLocationsData = {};
  isReset = false;
  showForm = false;
  getHeaders = Object.keys;

  constructor(
    private dataService: VlDataService,
    private dateFormatService: VlDateFormatService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private httpService: VlHttpService,
    private monacoLoader: MonacoEditorLoaderService
  ) { }

  ngAfterViewInit() {
    if (isEmptyField(this.filterConfig)) {
      return;
    }
    this.templates.forEach(x => this.templateTypes[x.type] = x.template);
    this.cdRef.detectChanges();
    // todo for date picker things
    // if (this.filterConfig.startAndEndDateConfig) {
    //   this.initDatePickerThings();
    // }
    // this.datePickerInit().subscribe(data => {
    //   this.processDatePickerThings();
    //   this.setFormValuesFromInitFilterData();
    //   this.route.queryParams.subscribe(params => {
    //     this.filterData = this.formatValuesFromUrlKey(this.formatDateHandlers(params, 'dateObject'));
    //     if (this.filterConfig.startAndEndDateConfig) {
    //       this.refreshDateConfigs().subscribe(data => {
    //         this.setValuesFromUrlParams();
    //       });
    //     } else {
    //       this.setValuesFromUrlParams();
    //     }
    //   });
    // });
    if (this.formGroupInput) {
      this.filterForm = this.formGroupInput;
    } else {
      this.addFieldsToForm();
    }
    // this.setFormValuesFromInitFilterData();
    this.showForm = true;
    // this.registerJSONValidationSchema();
  }

  private setFormValuesFromInitFilterData() {
    if (isEmptyField(this.initFilterData)) {
      return;
    }
    for (const field in this.initFilterData) {
      if (this.initFilterData.hasOwnProperty(field)) {
        if (!isEmptyField(this.initFilterData[field])) {
          this.filterForm.get(field).setValue(this.initFilterData[field]);
        }
      }
    }
  }

  private refreshDateConfigs(): Observable<boolean> {
    return new Observable(observer => {
      const timeStepValue = this.filterData.timeStep;
      const timeStepFormat = this.filterData.timeStepFormat;
      this.updateDatePickerSettings(timeStepValue);
      this.updateDatePickerFormatSettings(timeStepFormat);
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 500);
    });
  }

  private updateDatePickerSettings(timeStepValue: string) {
    const datePickerConfig: Partial<BsDatepickerConfig> = {};
    switch (timeStepValue) {
      case 'DAILY' || 'TEN_DAILY':
        datePickerConfig.minMode = 'day';
        datePickerConfig.dateInputFormat = 'DD-MM-YYYY';
        break;
      case 'MONTHLY':
        datePickerConfig.minMode = 'month';
        datePickerConfig.dateInputFormat = 'MMM, YYYY';
        break;
      case 'YEARLY':
        datePickerConfig.minMode = 'year';
        datePickerConfig.dateInputFormat = 'YYYY';
        break;
      default:
        datePickerConfig.minMode = 'day';
        datePickerConfig.dateInputFormat = 'DD-MM-YYYY';
        break;
    }
    this.startDateConfig = this.dataService.deepMerge(this.startDateConfig, datePickerConfig);
    this.endDateConfig = this.dataService.deepMerge(this.endDateConfig, datePickerConfig);
    this.startDatePicker.setConfig();
    this.endDatePicker.setConfig();
  }

  private datePickerInit() {
    return new Observable(observer => {
      if (!isEmptyField(this.filterConfig.startAndEndDateConfig)) {
        this.datePickers.changes.subscribe(datePickerArray => {
          observer.next(true);
          observer.complete();
        });
      } else {
        observer.next(true);
        observer.complete();
      }
    });
  }
  /**
   * todo uncomment when the date picker needs
   */
  // private initDatePickerThings() {
  //   if (this.filterConfig.startAndEndDateConfig && this.filterConfig.startAndEndDateConfig.isStartDatePresent) {
  //     this.startDateKey = this.filterConfig.startAndEndDateConfig.startDateKey ? this.filterConfig.startAndEndDateConfig.startDateKey : 'startDate';
  //     const startDateConfig = this.getConfigByKey('key', this.startDateKey);
  //     this.startDateConfig = this.dataService.deepMerge(startDateConfig, datePickerDefaults);
  //   }
  //   if (this.filterConfig.startAndEndDateConfig && this.filterConfig.startAndEndDateConfig.isEndDatePresent) {
  //     this.endDateKey = this.filterConfig.startAndEndDateConfig.endDateKey ? this.filterConfig.startAndEndDateConfig.endDateKey : 'endDate';
  //     const endDateConfig = this.getConfigByKey('key', this.endDateKey);
  //     this.endDateConfig = this.dataService.deepMerge(endDateConfig, datePickerDefaults);
  //   }
  // }

  private processDatePickerThings() {
    // for now hardcoding the start date and end date things
    if (this.filterConfig.startAndEndDateConfig && this.filterConfig.startAndEndDateConfig.isStartDatePresent) {
      this.startDatePicker = this.datePickers.first ? this.datePickers.first : null;
    }
    if (this.filterConfig.startAndEndDateConfig && this.filterConfig.startAndEndDateConfig.isEndDatePresent) {
      this.endDatePicker = this.datePickers.last ? this.datePickers.last : null;
    }
  }

  getConfigByKey(property, value) {
    const filteredArray = this.filterConfig.filterConfig.filter(config => config[property] === value);
    if (filteredArray.length > 0) {
      return filteredArray[0];
    } else {
      return null;
    }
  }


  ngOnInit() {
    this.maxDate = new Date();
    if (isEmptyField(this.filterConfig)) {
      return;
    }
    // this.addFieldsToForm();
  }



  private addFieldsToForm() {
    this.filterConfig.filterConfig.forEach((config: VlFilterConfig) => {
      const defaultValue = !isEmptyField(config.defaultValue) ? config.defaultValue : null;
      if (config.childs && config.childs.length > 0) {
        if (config.inputType === 'formArray') {
          const formArray = new FormArray([]);
          formArray.push(this.generateChildForm(config));

          this.filterForm.addControl(config.key, formArray);
        }
      } else {
        const validatorsArray: ValidatorFn[] = [];
        // const controlValue = !isEmptyField(this.filterData[config.key]) ? this.filterData[config.key] : defaultValue;
        if (!isEmptyField(config.isMandatory) && config.isMandatory) {
          validatorsArray.push(Validators.required);
        }
        const control = new FormControl(defaultValue, validatorsArray);
        this.filterForm.addControl(config.key, control);
        if (config.fireEventOnChange) {
          control.valueChanges.subscribe(value => {
            this.onValueChanges(config.key, value);
          });
        }
      }

    });
  }

  private setValuesFromUrlParams() {
    this.filterConfig.filterConfig.forEach(config => {
      const control = this.filterForm.get(config.key);
      let filterUrlValue = this.filterData[config.key];
      if (config.key === 'location') {
        const tempUrlValue: string[] = filterUrlValue.split('##')[filterUrlValue.split('##').length - 2].split('&');
        if (tempUrlValue.length > 1) {
          filterUrlValue = tempUrlValue[1];
        } else {
          filterUrlValue = tempUrlValue[0];
        }
        // filterUrlValue = filterUrlValue.split('##')[filterUrlValue.split('##').length - 2];
      }
      const filterValue = !isEmptyField(filterUrlValue) ? filterUrlValue : control.value;
      if (filterUrlValue != control.value) {
        control.setValue(filterValue);
      }
    });
  }

  private onValueChanges(key, value) {
    switch (key) {
      default:
        break;
    }
  }

  private timePeriodChange(value): void {
    const startDateControl: FormControl = this.filterForm.get('startDate') as FormControl;
    startDateControl.setValue(null);
    const endDateControl: FormControl = this.filterForm.get('endDate') as FormControl;
    endDateControl.setValue(null);
    const timeStepFormat: FormControl = this.filterForm.get('timeStepFormat') as FormControl;
    if (!isNullOrUndefined(timeStepFormat)) {
      this.updateDatePickerFormatSettings(timeStepFormat.value);
    }

    if (value === 'custom') {
      startDateControl.enable();
      endDateControl.enable();
      return;
    } else {
      startDateControl.disable();
      endDateControl.disable();
    }
  }

  private locationHierarchyChange(value) {
    this.isLocationHierarchyChanged = true;
    if (!isNullOrUndefined(this.filterForm.get('locationLevel'))) {
      this.filterForm.get('locationLevel').setValue(null);
      this.filterConfig.filterConfig.forEach((config, index) => {
        const previousConfig = this.dataService.deepClone(config);
        if (previousConfig.key === 'locationLevel') {
          previousConfig.selectConfig.options = previousConfig.selectConfig.otherOptions[value];
          this.filterConfig.filterConfig[index] = null;
          this.filterConfig.filterConfig[index] = previousConfig;
        }
      });
      this.cdRef.detectChanges();
      this.filterConfig.filterConfig.filter(config => config.key === value);
    }
  }

  getLocationsData(locationLevel: string): Observable<any> {
    const apiConfig: HTTPAPIConfig = this.dataService.deepClone(APIConfigMapping.MIS_LOCATIONS);
    apiConfig.postData = {
      locTypeName: (locationLevel.toUpperCase() == 'SUB_BASIN') ? 'SUBBASIN' : locationLevel.toUpperCase()
    };
    return this.httpService.placeAPICall(apiConfig);
  }

  formatLocationsList(data: any) {
    if (!isNullOrUndefined(data)) {
      const options = [];
      Object.keys(data).forEach((location) => {
        const option = {
          title: data[location]['displayName'].toUpperCase(),
          key: data[location]['displayName'].toUpperCase() === 'ANDHRA PRADESH' ? 'AP' : data[location]['displayName']
        };
        options.push(option);
      });
      return options;
    }
  }


  private timeStepChange(value) {
    this.filterForm.get('startDate').setValue(null);
    this.filterForm.get('endDate').setValue(null);
    this.updateDatePickerSettings(value);
  }

  private startDateChange(value) {
    this.filterForm.get('endDate').setValue(null);
    this.endDateConfig.minDate = value;
    this.endDatePicker.setConfig();
  }

  private endDateChange(value) {

  }

  submitForm() {
    console.log(this.filterForm.value, 'filterFormvalue')
    this.formChange.emit(this.filterForm.value);
    return;
  }


  private formatDateHandlers(object: any, to) {
    const clonedObj = this.dataService.deepClone(object);
    for (const key of Object.keys(object)) {
      if (key === this.startDateKey || key === this.endDateKey) {
        if (to === 'dateObject') {
          clonedObj[key] = this.dateFormatService.formatToNewDate(object[key], 'yyyymmdd');
        } else {
          clonedObj[key] = this.dateFormatService.formatFromNewDate(object[key], 'yyyymmdd');
        }
      }
    }
    return clonedObj;
  }

  private formatValuesToUrlKey(values) {
    const urlMappingObject: any = {};
    for (const key of Object.keys(values)) {
      const config = this.getConfigByKey('key', key);
      const urlKey = config.urlKey ? config.urlKey : key;
      urlMappingObject[urlKey] = values[key];
    }
    return urlMappingObject;
  }

  private formatValuesFromUrlKey(values) {
    const urlMappingObject: any = {};
    for (const key of Object.keys(values)) {
      let config = this.getConfigByKey('urlKey', key);
      if (isEmptyField(config)) {
        config = this.getConfigByKey('key', key);
      }
      if (isEmptyField(config)) {
        continue;
      }
      const normalKey = config.key ? config.key : key;
      urlMappingObject[normalKey] = values[key];
    }
    return urlMappingObject;
  }

  ngOnDestroy() {

  }

  private updateDatePickerFormatSettings(timeStepValue: string) {
    const datePickerConfig: Partial<BsDatepickerConfig> = {};
    switch (timeStepValue) {
      case 'yyyyMMdd':
        datePickerConfig.minMode = 'day';
        datePickerConfig.dateInputFormat = 'DD-MM-YYYY';
        break;
      case 'yyyyMM':
        datePickerConfig.minMode = 'month';
        datePickerConfig.dateInputFormat = 'MMM, YYYY';
        break;
      case 'yyyy':
        datePickerConfig.minMode = 'year';
        datePickerConfig.dateInputFormat = 'YYYY';
        break;
      default:
        datePickerConfig.minMode = 'day';
        datePickerConfig.dateInputFormat = 'DD-MM-YYYY';
        break;
    }
    this.startDateConfig = this.dataService.deepMerge(this.startDateConfig, datePickerConfig);
    this.endDateConfig = this.dataService.deepMerge(this.endDateConfig, datePickerConfig);
    setTimeout(() => {
      this.startDatePicker.setConfig();
      this.endDatePicker.setConfig();
    }, 0);
  }

  transformToTitleCase(value: string): string {
    const first = value.substr(0, 1).toUpperCase();
    return first + value.substr(1).toLowerCase();
  }

  resetForm() {
    this.isReset = true;
    this.reset.emit(this.isReset);
  }
  private generateChildForm(config: VlFilterConfig): FormGroup {
    const innerFormGroup = new FormGroup({});
    config.childs.forEach(childConfig => {
      const control = new FormControl(childConfig.defaultValue || null, childConfig.isMandatory ? [Validators.required] : [])
      innerFormGroup.addControl(childConfig.key, control);
      if (childConfig.fireEventOnChange) {
        control.valueChanges.subscribe(value => {
          this.onValueChanges(childConfig.key, value);
        });
      };
    });
    return innerFormGroup;
  }

  public addToFormArray(inputConfig: VlFilterConfig): void {
    const formArray = this.filterForm.get(inputConfig.key) as FormArray;
    formArray.push(this.generateChildForm(inputConfig));
  }

  public deleteFromFormArray(inputConfig: VlFilterConfig, index: number): void {
    const formArray = this.filterForm.get(inputConfig.key) as FormArray;
    formArray.removeAt(index);
  }

  public onEditorInit(editor, type) {
    // monaco.editor.onDidCreateModel()
    // const model = monaco.editor.createModel(
    //   "{}",
    //   "json",
    //   monaco.Uri.parse("a://b/foo.json")
    // );
    // editor.setModel(model);
  }

  async registerJSONValidationSchema() {
    await this.monacoLoader.isMonacoLoaded$.pipe(filter(isLoaded => isLoaded), take(1)).toPromise();
    this.modelUri = monaco.Uri.parse("a://b/city.json"); // a made up unique URI for our model
    // configure the JSON language support with schemas and schema associations
    // monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    //     validate: true,
    //     schemas: [
    //      {
    //         uri: "http://myserver/city-schema.json", // id of the first schema
    //         fileMatch: ["city*.json"],
    //         schema: {
    //             type: "object",
    //             additionalProperties: false,
    //             properties: {
    //                 city: {
    //                     enum: ["Paris", "Berlin", "Boardman"]
    //                 },
    //                 country: {
    //                   enum: ["France", "Germany", "United States"]
    //                 },
    //                 population: {
    //                   type: "integer"
    //                 }
    //             }
    //         }
    //     }]
    // });
  }

}
