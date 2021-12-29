import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { isEmptyField } from '../vl_util_functions/common-utils';

@Injectable({
  providedIn: 'root'
})
export class VlDateFormatService {

  isLeapYear(year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
  }

  getDaysInMonth(year, month) {
    return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }


  getMinMaxDate(year, month) {
    // tslint:disable-next-line: radix
    year = parseInt(year);
    // tslint:disable-next-line: radix
    month = parseInt(month) + 1;
    const minYearObj: any = {};
    const maxYearObj: any = {};
    minYearObj.year = year;
    maxYearObj.year = year;
    if (!isNullOrUndefined(month)) {
      minYearObj.month = month;
      maxYearObj.month = month;
    } else {
      minYearObj.month = 1;
      maxYearObj.month = 12;
    }
    minYearObj.day = 1;
    maxYearObj.day = this.getDaysInMonth(year, maxYearObj.month - 1);
    return [minYearObj, maxYearObj];
  }

  addMonths = (value, dateObj) => {
    dateObj = new Date(dateObj);
    const n = dateObj.getDate();
    dateObj.setDate(1);
    dateObj.setMonth(dateObj.getMonth() + value);
    dateObj.setDate(Math.min(n, this.getDaysInMonth(dateObj.getFullYear(), dateObj.getMonth())));
    return dateObj;
  }

  formatToNgbDatePicker(value, format, delimiter?: any) {
    const mapping = {
      yyyy: 'year',
      mm: 'month',
      dd: 'day'
    };
    const ngbDatePickerObj: any = {};
    if (format === 'dateObj') {
      ngbDatePickerObj.year = value.getFullYear();
      ngbDatePickerObj.month = value.getMonth() + 1;
      ngbDatePickerObj.day = value.getDate();
    } else {
      const dateFormat = format.split(delimiter);
      const dateList = value.split(delimiter);
      for (let index = 0; index < dateFormat.length; index++) {

        // tslint:disable-next-line: radix
        ngbDatePickerObj[mapping[dateFormat[index]]] = parseInt(dateList[index]);
      }
    }
    return ngbDatePickerObj;
  }

  formatNgbDateToNormalDate(value, format?: any) {
    let returnString = format;
    returnString = returnString.replace('year', value.year);
    returnString = returnString.replace('month', this.prefixZero(value.month));
    returnString = returnString.replace('day', this.prefixZero(value.day));
    return returnString;
    // delimiter = !isNullOrUndefined(delimiter) ? delimiter :
  }

  formatNgbDateToNormalTime(value, format?: any) {
    let returnString = format;
    returnString = returnString.replace('hour', this.prefixZero(value.hour));
    returnString = returnString.replace('minute', this.prefixZero(value.minute));
    // returnString = returnString.replace('second',this.prefixZero(value.day))
    return returnString;
    // delimiter = !isNullOrUndefined(delimiter) ? delimiter :
  }

  formatToNgbTimePicker(value, format, delimiter?: any) {
    const mapping = {
      hh: 'hour',
      mm: 'minute'
    };
    const ngbTimePickerObj: any = {};
    const dateFormat = format.split(delimiter);
    const dateList = value.split(delimiter);
    for (let index = 0; index < dateFormat.length; index++) {
      // tslint:disable-next-line: radix
      ngbTimePickerObj[mapping[dateFormat[index]]] = parseInt(dateList[index]);
    }
    return ngbTimePickerObj;
  }

  generateDateTimeString(date, time) {
    return this.prefixZero(date.day) + '-' + this.prefixZero(date.month) + '-' + date.year + ' ' + time.hour + ':' + time.minute;
  }

  prefixZero(value) {
    return value < 10 ? '0' + value.toString() : value;
  }

  formatToNewDate(dateString, format?) {
    if (isEmptyField(dateString)) {
      return;
    }
    const defaultFormat = 'yyyymmdd';
    if (!format) {
      format = defaultFormat;
    }
    const dateObject = this.formatStringToDateObject(dateString, format);
    dateObject.month = parseInt(dateObject.month) - 1;
    return new Date(dateObject.year, dateObject.month, dateObject.day);
  }

  formatFromNewDate(date: Date, format?) {
    const defaultFormat = 'yyyymmdd';
    if (!format) {
      format = defaultFormat;
    }
    let dateObject: any = {};
    dateObject.year = date.getFullYear();
    dateObject.month = this.prefixZero(date.getMonth() + 1);
    dateObject.day = this.prefixZero(date.getDate());
    return this.formatDateObjectToString(dateObject, format);
  }

  // formatToMoment(dateString, format?) {
  //   if (isEmptyField(dateString)) {
  //     return;
  //   }
  //   const defaultFormat = 'yyyymmdd';
  //   if (!format) {
  //     format = defaultFormat;
  //   }
  //   const dateObject = this.formatStringToDateObject(dateString, format);
  //   return moment(dateObject.year + '/' + dateObject.month + '/' + dateObject.day);
  // }

  formatStringToDateObject(dateString, format) {
    let dateObject: any = {
      day: 1,
      month: 1,
      year: new Date().getFullYear()
    };
    const dateStringArray = dateString.split('');
    const formatArray = format.split('');
    let graceIndex = -1;
    for (let index = 0; index < formatArray.length ; index ++) {
      const dateString = formatArray[index];
      if (index < graceIndex) { continue; }
      if (dateString === 'd' || dateString === 'm') {
        graceIndex = index + 2;
        dateObject[dateString === 'd' ? 'day' : 'month'] = dateStringArray[index] + dateStringArray[index + 1];
      } else if (dateString === 'y') {
        graceIndex = index + 4;
        dateObject.year = dateStringArray[index] + dateStringArray[index + 1] + dateStringArray[index + 2] + dateStringArray[index + 3];
      }
    }
    return dateObject;
  }

  formatDateObjectToString(dateObject: any, format) {
    let date = '';
    const formatArray = format.split('');
    let graceIndex = -1;
    for (let index = 0; index < formatArray.length ; index ++) {
      const dateString = formatArray[index];
      if (index < graceIndex) { continue; }
      if (dateString === 'd' || dateString === 'm') {
        graceIndex = index + 2;
        date = date + (dateString === 'd' ? dateObject.day : dateObject.month);
      } else if (dateString === 'y') {
        graceIndex = index + 4;
        date = date + dateObject.year;
      }
    }
    return date;
  }

  // formatFromMoment(moment: Moment, format?) {
  //   const defaultFormat = 'yyyymmdd';
  //   if (!format) {
  //     format = defaultFormat;
  //   }
  //   let dateObject: any = {};
  //   dateObject.year = moment.year();
  //   dateObject.month = this.prefixZero(moment.month() + 1);
  //   dateObject.day = this.prefixZero(moment.date());
  //   return this.formatDateObjectToString(dateObject, format);
  // }

  // addYears(date, yearCount) {
  //   if (!moment.isMoment(date)) {
  //     date = this.formatToMoment(date);
  //   }
  //   date = addYear(date, yearCount);
  //   return this.formatFromMoment(date);
  // }

  // subTractYears(date, yearCount) {
  //   if (!moment.isMoment(date)) {
  //     date = this.formatToMoment(date);
  //   }
  //   date = subtractYear(date, yearCount);
  //   return this.formatFromMoment(date);
  // }

  getLastYearDate(date: Date) {
    date.setFullYear(date.getFullYear() - 1);
    return date;
  }

  getMonsoonStartForDate(date: Date) {
    let month = new Date().getMonth();
    date.setMonth(5);
    date.setDate(1);
    if (month <= 5) {
      date.setFullYear(date.getFullYear() - 1);
    }
    return date;
  }

  getDateStringWithTime(timestamp){
    let monthShortLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if(isNaN(timestamp)){
      return '\xa0\xa0\xa0\xa0\xa0\xa0'+'\xa0\xa0\xa0\xa0\xa0\xa0'+'00:00:00';
    }
    else {
      let numTimestamp = Number(timestamp);
      let currentDate = new Date(numTimestamp);
      let date = currentDate.getDate();
      let cd = date < 10 ? "0" + date : date;
      let hours = currentDate.getHours();
      let hh = hours < 10 ? "0" + hours : hours;
      let minutes = currentDate.getMinutes();
      let mm = minutes < 10 ? "0" + minutes : minutes;
      let seconds = currentDate.getSeconds();
      let ss = seconds <10 ? "0"+ seconds : seconds;
      let dateValue = cd + '-' + (monthShortLabel[currentDate.getMonth()])+ '-'+currentDate.getFullYear()
      + '\xa0\xa0\xa0\xa0\xa0\xa0' + hh + ':'+ mm +':'+ss;
      return dateValue;
    }
  }

  getDateStringWithoutTime(timestamp){
    let monthShortLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if(isNaN(timestamp)){
      return "--";
    }
    else {
      let numTimestamp = Number(timestamp);
      let currentDate = new Date(numTimestamp);
      let date = currentDate.getDate();
      let cd = date < 10 ? "0" + date : date;
      let dateValue = cd + '-' + (monthShortLabel[currentDate.getMonth()])+ '-'+currentDate.getFullYear();
      return dateValue;
    }
  }

  getDateInFormat(format, refTs){
    let monthShortLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if(refTs == undefined || refTs == null)
      return null;

    let d = new Date(refTs),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      let y = year.toString();

    switch(format){
      case "YYYY-MM-DD":
        return [year, month, day].join('-');

      case "DD-MM-YYYY":
        return [day, month, year].join('-');

      case "MM-dd-yyyy":
        return[month,day,year].join('-');

      case "dd-MMM-yyyy":
        month = monthShortLabel[d.getMonth()];
        return [day, month, year].join('-');

      case "dd/MM/yyyy":
        return [day, month, year].join('/');
      case "yyyyMMdd":
        return [year, month, day].join('');
      case "MMM dd":
        month = monthShortLabel[d.getMonth()];
        return [month, day].join(' ');
      case "dd MMM":
        month = monthShortLabel[d.getMonth()];
        return [day, month].join(' ');
      case 'yyyy-MM-dd':
        return [year, month, day].join('-');
      case "dd/MMM":
        month = monthShortLabel[d.getMonth()];
        return [day, month].join('/');
      case "yyyyMM":
        return [year, month].join('');
      case "MMyyyy":
        return [ month,year].join('-');
      case "yyyy" :
        return [year].join('');
      case "yyyy-MM" :
        return [year,month].join('-');
      case "DD":
        return [day].join('');

      // case "MMM-yy":
      //   month = monthShortLabel[d.getMonth()];
      //   year = y.substr(2,4);
      //   return [month, year].join('-');
    }
  }

  getDateandTimeString(timestamp,format) {
  var d = new Date(timestamp);
  var year = d.getFullYear().toString();
  var month :any = d.getMonth() + 1;
  month = month.toString();
  var date = d.getDate().toString();
  var hours = d.getHours().toString();
  var minutes = d.getMinutes().toString();
  var seconds = d.getSeconds().toString();
  if (month.length < 2) month = '0' + month;
  if (date.length < 2) date = '0' + date;
  if (hours.length < 2) hours = '0' + hours;
  if (minutes.length < 2) minutes = '0' + minutes;
  if (seconds.length < 2) seconds = '0' + seconds;
  var str = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  switch(format){
    case "YYYY-MM-DD hh:mm":
      str = year + "-" + month + "-" + date + " " + hours + ":" + minutes ;
      break;
    case "YYYY-MM-DD":
      str = year+"-"+month+"-"+date
      break;
    case "DD-MM-YYYY":
      str = date+"-"+month+"-"+year
      break;
  }

  return str;
  }


}
