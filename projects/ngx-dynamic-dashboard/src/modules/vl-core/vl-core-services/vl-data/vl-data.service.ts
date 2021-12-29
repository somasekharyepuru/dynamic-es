import { Injectable } from '@angular/core';
import { isNull } from 'util';
import { isEmptyField, isNullOrUndefined } from '../vl_util_functions/common-utils';

@Injectable({
  providedIn: 'root'
})
export class VlDataService {

  constructor(
  ) { }

  // showToastMessage(message: string, type: 'error' | 'success' | 'warning', options?: any, clearPrevious: boolean = true): void {
  //   let toastOptions: any = ToastrConstant;
  //   if (!isNullOrUndefined(options)) {
  //     toastOptions = { ...ToastrConstant, ...options.options };
  //   }
  //   if (clearPrevious) {
  //     this.toastr.clear();
  //   }
  //   this.toastr[type](message, toastOptions.title, toastOptions);
  // }

  deepMerge(src: any, dest: any, options?: any): any {
    const result = {};
    // tslint:disable-next-line: forin
    for (const i in src) {
      const type = typeof src[i];
      if (!isNullOrUndefined(options) && !isNullOrUndefined(options.customMerge) && !isNullOrUndefined(options.customMerge[i])) {

        // tslint:disable-next-line: triple-equals
        if (options.customMerge[i] == 'dest') {
          result[i] = !isNullOrUndefined(dest[i]) ? dest[i] : null;
          // tslint:disable-next-line: triple-equals
        } else if (options.customMerge[i] == 'src') {
          result[i] = !isNullOrUndefined(src[i]) ? src[i] : null;
        } else {
          result[i] = options.customMerge[i](src[i], dest[i]);
        }
      } else if (!isNullOrUndefined(src) && !isNull(src[i]) && type == 'object' && !(src[i] instanceof Array)) {
        result[i] = (!isNullOrUndefined(dest) && !isNullOrUndefined(dest[i])) ? this.deepMerge(src[i], dest[i], options) : src[i];
      } else if (!isNullOrUndefined(src) && !isNullOrUndefined(src[i]) && src[i] instanceof Array) {
        if (!isNullOrUndefined(options) && !isNullOrUndefined(options.array) && options.array == 'merge') {
          result[i] = (!isNullOrUndefined(dest) && !isNullOrUndefined(dest[i]) && dest[i].length > 0) ? src[i].concat(dest[i]) : src[i];
        } else if (!isNullOrUndefined(options) && !isNullOrUndefined(options.array) && options.array == 'override') {
          result[i] = (!isNullOrUndefined(dest) && !isNullOrUndefined(dest[i])) ? dest[i] : src[i];
        } else {
          result[i] = (!isNullOrUndefined(dest) && !isNullOrUndefined(dest[i]) && dest[i].length > 0) ? src[i].concat(dest[i]) : src[i];
        }
      } else {
        result[i] = (!isNullOrUndefined(dest) && !isNullOrUndefined(dest[i])) ? dest[i] : src[i];
      }
    }
    for (const i in dest) {
      if (isNullOrUndefined(result[i])) {
        result[i] = dest[i];
      }
    }
    return result;
  }

  deepClone(object): any {
    if (isEmptyField(object)) {
      return;
    }
    if (Array.isArray(object)) {
      return object.slice();
    }
    const cloneObj = {};
    const attributes = Object.keys(object);
    for (const attribute of attributes) {
      const property = object[attribute];

      if (typeof property === 'object') {
        cloneObj[attribute] = this.deepClone(property);
      } else {
        cloneObj[attribute] = property;
      }
    }
    return cloneObj;
  }

  deepCompare(obj1, obj2) {
    // Loop through properties in object 1
    // tslint:disable-next-line: forin
    for (const p in obj1) {
      // Check property exists on both objects
      if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) { return false; }

      switch (typeof (obj1[p])) {
        // Deep compare objects
        case 'object':
          if (!this.deepCompare(obj1[p], obj2[p])) { return false; }
          break;
        // Compare function code
        case 'function':
          if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) { return false; }
          break;
        // Compare values
        default:
          if (obj1[p] != obj2[p]) { return false; }
      }
    }

    // Check object 2 for any extra properties
    for (const p in obj2) {
      if (typeof (obj1[p]) == 'undefined') { return false; }
    }
    return true;
  }

  flattenObject(data) {
    return data.map((value, key) => this.flattenOneObject(value));
  }

  flattenOneObject(ob) {
    if (typeof ob === 'string') {
      return ob;
    }
    const toReturn = {};
    for (const i in ob) {
      if (!ob.hasOwnProperty(i)) { continue; }
      // tslint:disable-next-line: triple-equals
      if ((typeof ob[i]) == 'object' && !(ob[i] instanceof Array)) {
        const flatObject = this.flattenOneObject(ob[i]);
        for (const x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) { continue; }
          toReturn[i + '.' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  }

  deflattenObject(obj: any) {
    const type = typeof obj;
    const result = {};
    if (type == 'object' && !(obj instanceof Array)) {
      // tslint:disable-next-line: forin
      for (const i in obj) {
        const allKeys = i.split('.');
        // tslint:disable-next-line: prefer-const
        // tslint:disable-next-line: one-variable-per-declaration
        let temp = result, length = allKeys.length;
        const lastKey = allKeys[length - 1];
        allKeys.forEach((key, i) => {
          if (i < (length - 1)) {
            temp[key] = temp[key] || {};
            temp = temp[key];
          }
        });
        temp[lastKey] = obj[i];
      }
      return result;
    } else {
      return obj;
    }
  }

  clearEmptyFields(data, emptyFillWith?) {
    if (isEmptyField(emptyFillWith)) {
      emptyFillWith = null;
    }
    const returnableObject: any = {};
    let flattenData: any;
    let isObjectEmpty = true;
    if (Array.isArray(data)) {
      flattenData = this.flattenObject(data);
      flattenData.forEach(singleObject => {
        [singleObject, isObjectEmpty] = this.clearOneObjectEmptyFields(singleObject, isObjectEmpty, emptyFillWith);
      });
    } else {
      flattenData = this.flattenOneObject(data);
      [flattenData, isObjectEmpty] = this.clearOneObjectEmptyFields(flattenData, isObjectEmpty, emptyFillWith);
    }
    const deflattenObject = this.deflattenObject(flattenData);
    returnableObject.data = deflattenObject;
    returnableObject.isObjectEmpty = isObjectEmpty;
    return deflattenObject;
  }

  clearOneObjectEmptyFields(flattenData, isObjectEmpty, emptyFillWith) {
    for (const val of Object.keys(flattenData)) {
      if (isNullOrUndefined(flattenData[val]) || flattenData[val] === '') {
        flattenData[val] = emptyFillWith;
      }
    }
    return [flattenData, isObjectEmpty];
  }

  checkOneObjectForEmpty(flattenData, isObjectEmpty) {
    for (const val of Object.keys(flattenData)) {
      if (isNullOrUndefined(flattenData[val]) || flattenData[val] === '') {
        flattenData[val] = null;
      } else {
        isObjectEmpty = false;
      }
    }
    return isObjectEmpty;
  }

  isEmptyEveryField(data) {
    let isObjectEmpty = true;
    let flattenData: any = {};
    if (Array.isArray(data)) {
      flattenData = this.flattenObject(data);
      flattenData.forEach(singleObject => {
        if (!isObjectEmpty) {
          isObjectEmpty = this.checkOneObjectForEmpty(singleObject, isObjectEmpty);
        }
      });
    } else {
      flattenData = this.flattenOneObject(data);
      isObjectEmpty = this.checkOneObjectForEmpty(flattenData, isObjectEmpty);
    }
    return isObjectEmpty;
  }

  convertToIntegerFromArrayOfObjects(data: any[], fields: string[]) {
    data.forEach(element => {
      element = this.convertToIntegerFromObject(element, fields);
    });
    return data;
  }

  convertToIntegerFromObject(object, fields: string[]) {
    for (const key of Object.keys(object)) {
      if (fields.indexOf(key) != -1) {
        object[key] = parseFloat(object[key]);
      }
    }
    return object;
  }
}
