import { Directive,  HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { isNullOrUndefined, isNumber } from 'util';
import { isEmptyField } from '../../vl-core/vl-core-services/vl_util_functions/common-utils';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[validation]'
})
export class ValidationDirective {
  @Input() allowedDecimal: number;
  @Input() allowedNumbers: number;
  @Input() onlyNumbers: boolean;
  @Input() validator: 'number' | 'decimal' | 'alphabetic' | 'alphaNumeric' | 'alphabeticWithSpace';
  @Input() minValue: number;
  @Input() maxValue: number;



  constructor(private ngControl: NgControl) {
    if (isNullOrUndefined(this.allowedDecimal)) {
      this.allowedDecimal = 16;
    }
    if (isNullOrUndefined(this.allowedNumbers)) {
      this.allowedNumbers = 16;
    }
    if (isNullOrUndefined(this.validator)) {
      this.validator = 'decimal';
    }
    if (isEmptyField(this.minValue)) {
      this.minValue = -9999999999999999999999;
    }
    if (isEmptyField(this.maxValue)) {
      this.maxValue = 9999999999999999999999;
    }
  }

  // Listen for the input event to also handle copy and paste.
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    if (isEmptyField(this.minValue)) {
      this.minValue = -9999999999999999999999;
    }
    if (isEmptyField(this.maxValue)) {
      this.maxValue = 9999999999999999999999;
    }
    let clean = '';
    if (this.validator === 'number') {
      clean = value.replace(/[^0-9]/g, '');
    } else if (this.validator === 'decimal') {
      clean = value.replace(/[^0-9\.]/g, '');
    } else if (this.validator === 'alphabetic') {
      clean = value.replace(/[^a-zA-Z]/g, '');
    } else if (this.validator === 'alphaNumeric') {
      clean = value.replace(/[^a-zA-Z0-9_]/g, '');
    } else if (this.validator === 'alphabeticWithSpace') {
      clean = value.replace(/[^a-zA-Z ]/g, '');
    }
    if (!isNaN(parseFloat(value)) && parseInt(value).toString().length >= parseInt(this.minValue.toString()).toString().length && parseFloat(value) < parseFloat(this.minValue.toString())) {
      console.log('coming to min value logic');
      clean = this.minValue.toString();
    }
    if (!isNaN(parseFloat(value)) && parseFloat(value) > parseFloat(this.maxValue.toString())) {
      clean = this.maxValue.toString();
    }
    if (this.validator === 'decimal') {
      const decimalCheck = clean.split('.');
      if (!isNullOrUndefined(decimalCheck[1])) {
        if (decimalCheck[1].length > this.allowedDecimal) {
          // toastr.clear()
          // toastr.error("More than 2 Decimals are Not Allowed")
        }
        decimalCheck[1] = decimalCheck[1].slice(0, this.allowedDecimal);
        decimalCheck[0] = decimalCheck[0].slice(0, this.allowedNumbers);
        if (isNullOrUndefined(decimalCheck[0])  || decimalCheck[0] === '') {
          decimalCheck[0] = '0';
        }
        clean = decimalCheck[0] + '.' + decimalCheck[1];
      } else {
        if (clean.length > this.allowedNumbers) {
          // toastr.clear();
          // toastr.error('Length is Restricted to 8 Digits');
        }
        clean = clean.substr(0, this.allowedNumbers);
      }
    }
    this.ngControl.control.patchValue(clean, {
      emitEvent: true
    });
  }
}
