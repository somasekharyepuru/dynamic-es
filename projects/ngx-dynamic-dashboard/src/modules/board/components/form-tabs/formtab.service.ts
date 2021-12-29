import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { VlFilter } from '../../../vl-core/vl-core-modules/vl-filter/vl-filter-models/vl-filter.model';

@Injectable({
  providedIn: 'root'
})
export class FormtabService {

  constructor() { }

  public generateFormGroup(filterConfigs: {[key: string]: VlFilter}, configValue?: any): FormGroup {
    let formGroup: FormGroup = new FormGroup({});
    for (let [key, filterConfig] of Object.entries(filterConfigs)) {
      formGroup.addControl(key, new FormGroup({}));
      filterConfig.filterConfig.forEach( config => {
        const innerFormGroup = formGroup.get(key) as FormGroup;
        if (config.childs && config.childs.length > 0) {
          if (config.inputType === 'formArray') {
            const formArray = new FormArray([]);
            // if (configValue)
            let arrayLength = 1;
            if (configValue && configValue[key] && configValue[key][config.key]) {
              arrayLength = configValue[key][config.key].length;
            }
            for (let i=0; i< arrayLength; i++) {
              const childFormGroup = new FormGroup({});
              config.childs.forEach( childConfig => {
                const control = new FormControl(childConfig.defaultValue || null, childConfig.isMandatory ? [Validators.required] : [])
                childFormGroup.addControl(childConfig.key, control);
                if (childConfig.inputType === 'json' && typeof configValue[key][config.key][i][childConfig.key] !='string') {
                  configValue[key][config.key][i][childConfig.key] = JSON.stringify(configValue[key][config.key][i][childConfig.key],  null, '\t')
                }
              });

              formArray.push(childFormGroup);
            }
            innerFormGroup.addControl(config.key, formArray)
          }
        } else {
          innerFormGroup.addControl(config.key, new FormControl(config.defaultValue || null, config.isMandatory ? [Validators.required] : []))
          if (config.inputType === 'json' && typeof configValue[key][config.key] !== 'string') {
            configValue[key][config.key] = JSON.stringify(configValue[key][config.key],  null, '\t')
          }
        }
      })
    }
    console.log(configValue, 'config value')
    formGroup.patchValue(configValue);
    return formGroup;
  }

  public convertToJSON(filterConfigs: {[key: string]: VlFilter}, configValue?: any) {
    let formGroup: FormGroup = new FormGroup({});
    for (let [key, filterConfig] of Object.entries(filterConfigs)) {
      filterConfig.filterConfig.forEach( config => {
        if (config.childs && config.childs.length > 0) {
          if (config.inputType === 'formArray') {
            // if (configValue)
            let arrayLength = 1;
            if (configValue && configValue[key] && configValue[key][config.key]) {
              arrayLength = configValue[key][config.key].length;
            }
            for (let i=0; i< arrayLength; i++) {
              config.childs.forEach( childConfig => {
                if (childConfig.inputType === 'json' &&  typeof configValue[key][config.key][i][childConfig.key] === 'string') {
                  configValue[key][config.key][i][childConfig.key] = JSON.parse(configValue[key][config.key][i][childConfig.key])
                }
              });

            }
          }
        } else {
          if (config.inputType === 'json' && typeof configValue[key][config.key] === 'string') {
            configValue[key][config.key] = JSON.parse(configValue[key][config.key])
          }

        }
      })
      return configValue;
  }
}

  // private convertJSONToString(filterConfig: VlFilter, filterValue) {
  //   this.filterConfig.filterConfig.forEach( config => {
  //     if (config.inputType === 'json') {
  //       filterValue[config.key] = JSON.stringify(filterValue[config.key])
  //     }
  //   });
  //   return filterValue;
  // }

}
