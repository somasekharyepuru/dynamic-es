export function isNullOrUndefined(value) {
  return value === null || value === undefined
}
export function isEmptyField(value: any) {
    if (isNullOrUndefined(value) || value === '' || value === 'null') {
        return true;
    }
    return false;
}

export function isEmptyArray(value: any[]) {
    if (isEmptyField(value)) {
        return true;
    }
    return value.length === 0;
}

export function isEmptyObject(value: any) {
    if (isEmptyField(value)) {
        return true;
    }
    return Object.keys(value).length === 0;
}

export function getFormattedDate(value?) {
    if (isEmptyField(value)) {
        return new Date().toISOString().slice(0, 10).replace(/-/g, '');
    } else {
        return new Date(value).toISOString().slice(0, 10).replace(/-/g, '');
    }
}


// export function addYear(date, number) {
//     return moment(date).add(number, 'y');
// }

// export function subtractYear(date, number) {
//     return moment(date).subtract(number, 'y');
// }

export function convertToFloat(value, fixedTo?) {
    if (isEmptyField(value)) {
        return '-';
    }
    if (isNaN(value)) {
        return value;
    }
    value = parseFloat(value);
    if (!isEmptyField(fixedTo)) {
        value = parseFloat(value).toFixed(fixedTo);
        value = parseFloat(value);
    }
    return value;
}

export function convertToInt(value) {
    if (isEmptyField(value)) {
        return '-';
    }
    if (isNaN(value)) {
        return value;
    }
    return parseInt(value, 10);
}

export function isSameArray(arr1: any[], arr2: any[]) {
    // const array = arr2.length > arr1.length ? arr2 : arr1;
    let isSame = true;
    for (let index = 0; index < arr2.length; index ++) {
        if (isEmptyField(arr1[index])) {
            isSame = false;
            break;
        }
        if (arr2.indexOf(arr1[index]) == -1) {
            isSame = false;
            break;
        }
    }
    return isSame;
}

export function isObject(a) {
    return (!!a) && (a.constructor === Object);
}
export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function toString(value: any): string {
  return (value !== undefined && value !== null) ? `${value}` : '';
}

export function getValueInRange(value: number, max: number, min = 0): number {
  return Math.max(Math.min(value, max), min);
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function isInteger(value: any): value is number {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

export function isDefined(value: any): boolean {
  return value !== undefined && value !== null;
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

export function regExpEscape(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function hasClassName(element: any, className: string): boolean {
  return element && element.className && element.className.split &&
      element.className.split(/\s+/).indexOf(className) >= 0;
}

if (typeof Element !== 'undefined' && !Element.prototype.closest) {
  // Polyfill for ie10+

  if (!Element.prototype.matches) {
    // IE uses the non-standard name: msMatchesSelector
    Element.prototype.matches = (Element.prototype as any).msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  Element.prototype.closest = function(s: string) {
    let el = this;
    if (!document.documentElement.contains(el)) {
      return null;
    }
    do {
      if (el.matches(s)) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

export function closest(element: HTMLElement, selector): HTMLElement {
  if (!selector) {
    return null;
  }
  return element.closest(selector);
}

// url related functions
export function getUrlFromLocationHref(url: string): string |  null {
  if (isEmptyField(url)) {
    return null;
  }
  return url.split('?')[0];
}

export function transform(value:string): string {
  let first = value. substr(0,1). toUpperCase();
  return first + value. substr(1);
}

