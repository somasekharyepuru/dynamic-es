import { Injectable } from '@angular/core';
import { VlDataService } from '../vl-data/vl-data.service';
import { convertToInt } from '../vl_util_functions/common-utils';
import { DateConfig } from './date_utils.cnts';

@Injectable({
  providedIn: 'root'
})
export class VlDateUtilsService {
  dateConfig: DateConfig = {
    countConfig : '0##7',
    countVariable: 'day',
    patternDelimiter: '-',
    convertDatePattern: {
      pattern: 'yyyy/mm/dd',
      delimiter: '/'
    },
    currentDatePattern: {
      pattern: 'dd/mm/yyyy',
      delimiter: '/'
    },
    dateKeys : ['year', 'dateStyle'],
    dateTypeObj: {
      weekday: ['short'],
      year : ['numeric', 'pattern'],
      month : ['2-digit', 'long', 'narrow'],
      day : ['2-digit'],
      hour : ['2-digit'],
      minute: ['2-digit'],
      second: ['2-digit'],
      timeZoneName: ['short'],
      dateStyle: ['medium']
    },
    reverse: false
  };

  monthShortLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(
    private dataService: VlDataService
    ) { }

  isLeapYear(year) {
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
  }

  getDaysInMonth(year, month) {
      return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }

  getDateObjectFromConfig(obj: Date, configObject) {
    // tslint:disable-next-line: prefer-const
    let dateObj: any = {};
    const dateKeys = configObject.dateKeys;
    const dateTypeObj = configObject.dateTypeObj;
    dateObj.year = convertToInt(obj.getFullYear());
    dateObj.month = convertToInt(obj.getMonth());
    dateObj.day = convertToInt(obj.getDate());
    const strictDateObj = JSON.parse(JSON.stringify(dateObj));
    dateKeys.forEach((value, index) => {
      // tslint:disable-next-line: prefer-const
      let dateOptionConfig = dateTypeObj[value];
      dateOptionConfig.forEach( (type, typeIndex) => {
        // tslint:disable-next-line: prefer-const
        let dateOptions = {};
        dateOptions[value] = dateTypeObj[value][typeIndex];
        let dateValue: string | number = '';
        if (type == 'pattern') {
          dateValue = this.getYearStringFromPattern(dateObj.year, 'yyyy-yy');
        } else {
          dateValue = this.getDateValueBasedOnLocaleString(strictDateObj, dateOptions);
        }
        // tslint:disable-next-line: max-line-length

        // tslint:disable-next-line: radix
        // if (typeof(dateValue) === 'string' && !isNaN(parseInt(dateValue))) {
        //   // tslint:disable-next-line: radix
        //   dateValue = parseInt(dateValue);
        // }
        const nameToSet = typeIndex > 0 ? value + '_' + type : value;

        dateObj[nameToSet] = dateValue ;
      });
    });
    return dateObj;
  }
  /**
   *
   * @param year year to be modified
   * @param pattern pattern, which date should convert to yyyy-yyyy,yyyy-yy,yyyy
   * Future we can deal with yy,yy-yy
   */
  getYearStringFromPattern(year, pattern) {
    const patternDelimiter = this.getValueFromObject('patternDelimiter');
    const patternArray = pattern.split(patternDelimiter);
    if (patternArray.length === 1) {
      return year;
    }
    const nextYear = +year + 1;
    // tslint:disable-next-line: prefer-const
    let yearArray = [year, nextYear];
    patternArray.forEach((element, index) => {
      if (element.length === 2 ) {
        yearArray[index] = yearArray[index].toString().substr(2, 4);
      }
    });
    return yearArray.join(patternDelimiter);
  }

  getValueFromObject(key) {
    return JSON.parse(JSON.stringify(this.dateConfig[key]));
  }

  getDateValueBasedOnLocaleString(dateObj, dateConfig): string | number {
    const dateValue = new Date(dateObj.year, parseFloat(dateObj.month), dateObj.day).toLocaleString('en-IN', dateConfig);
    return dateValue;
  }

  getDateList(date?, config?: DateConfig) {
    // tslint:disable-next-line: prefer-const
    let datesArray = [];
    let properConfig = this.dataService.deepMerge(JSON.parse(JSON.stringify(this.dateConfig)), config);
    properConfig = this.modifyConfig(properConfig);

    const startDate = this.getStartDateFromConfig(date, properConfig);

    // const formattedDateObj = this.getDateObjectFromConfig(dateObj, properConfig);
    // console.log(formattedDateObj, 'formObj');
    const countArray = properConfig.countConfig.split('##');
    const prevCount = -countArray[0];
    const futureCount = countArray[1];

    for (let date = prevCount; date <= futureCount; date++) {
      const actualDate: Date = new Date(startDate);
      if (properConfig.countVariable === 'year') {
        actualDate.setFullYear(actualDate.getFullYear() + date);
      // tslint:disable-next-line: triple-equals
      } else if (properConfig.countVariable === 'month') {
        actualDate.setMonth(actualDate.getMonth() + date);
      } else {
        actualDate.setDate(actualDate.getDate() + date);
      }
      datesArray.push(this.getDateObjectFromConfig(actualDate, properConfig));
    }
    if (properConfig.reverse) {
     return datesArray.reverse();
    }
    return datesArray;
  }

  modifyConfig(config: DateConfig) {
    if (config.upToYear) {
      const currentYear: number = new Date().getFullYear();
      const startYear: number = config.startYear ? config.startYear : currentYear;
      const countConfig: string = (currentYear - startYear) + '##' + 0;
      config.countConfig = countConfig;
    }
    return config;
  }

  getStartDateFromConfig(date, config: DateConfig) {
    const paramDate = new Date().toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    if (!!date) {
    } else {
      date = paramDate;
    }
    const actualStartDate = this.changeYearPattern(date, config);
    const [year, month, day] = this.getYearMonthDayFromDatePattern(actualStartDate, config);
    return new Date(year, month, day);
    // return new Date(this.changeYearPattern(date, config));
    // let paramDate = date || new Date().toDateString();
  }

  getYearMonthDayFromDatePattern(date: string, config: DateConfig): number[] {
    const normalDate = date.split(config.convertDatePattern.delimiter);
    const returnableDate = normalDate.map( value => parseInt(value));
    return returnableDate;
  }


  changeYearPattern(date, config: DateConfig) {
    const currentDatePatternArray = config.currentDatePattern.pattern.split(config.currentDatePattern.delimiter);
    const currentDateArray = date.split(config.currentDatePattern.delimiter);
    const convertDatePattern = config.convertDatePattern.pattern.split(config.convertDatePattern.delimiter);

    // convertDatePattern.forEach( value => {
      // })
    // tslint:disable-next-line: radix
    const convertedDateArray =  convertDatePattern.map( value => parseInt(currentDateArray[currentDatePatternArray.indexOf(value)]));
    return convertedDateArray.join(config.convertDatePattern.delimiter);
  }

  formatTimeStampToNgbDatePicker(ts, format, delimter?: any){
    let value = new Date(ts);
    console.log(value, 'value');

    return this.formatToNgbDatePicker(value,format,delimter);
  }

  formatToNgbDatePicker(value, format, delimter?: any) {
    const mapping = {
      yyyy : 'year',
      mm : 'month',
      dd : 'day'
    };
    const ngbDatePickerObj: any = {};
    if (format === 'dateObj') {
      ngbDatePickerObj.year = value.getFullYear();
      ngbDatePickerObj.month = value.getMonth() + 1;
      ngbDatePickerObj.day = value.getDate();
    } else {
      const dateFomat = format.split(delimter);
      const dateList = value.split(delimter);
      for (let index = 0; index < dateFomat.length; index++) {

        // tslint:disable-next-line: radix
        ngbDatePickerObj[mapping[dateFomat[index]]] = parseInt(dateList[index]);
      }
    }
    return ngbDatePickerObj;
  }


  getTimeStampFromTS(refTs){
    if(refTs == null || refTs == undefined){
        refTs = new Date();
    }
    let day;

    let date = (refTs.getDate() > 9) ? refTs.getDate() : "0"+refTs.getDate();
    let month = ((refTs.getMonth()+1) > 9) ? (refTs.getMonth() + 1) : "0"+(refTs.getMonth()+1);
    let year = refTs.getFullYear();

    day = year.toString()+month.toString()+date.toString();

    return day;
  }

  getNDayListInFormat(referenceTS, noOfDays, offset){
    if(referenceTS == null || referenceTS == undefined){
          referenceTS = new Date().getTime();
      }
      let dayList = [];
      for(let i=offset; i<(noOfDays + offset); i++){
        let day;
        let currDay = new Date(referenceTS + (i * 24* 60 * 60 * 1000));
        let date = (currDay.getDate() > 9) ? currDay.getDate() : "0"+currDay.getDate();
        let month = ((currDay.getMonth()+1) > 9) ? (currDay.getMonth() + 1) : "0"+(currDay.getMonth()+1);
        let year = currDay.getFullYear();

        day = year.toString()+month.toString()+date.toString();
        dayList.push(day);
      }

      return dayList;
  }

  getDateInFormat(format, refTs){
    if(refTs == undefined || refTs == null)
      return null;

    let d = new Date(refTs),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year : any = d.getFullYear();

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
        month = this.monthShortLabel[d.getMonth()];
        return [day, month, year].join('-');

      case "dd/MM/yyyy":
        return [day, month, year].join('/');
      case "yyyyMMdd":
        return [year, month, day].join('');
      case "MMM dd":
        month = this.monthShortLabel[d.getMonth()];
        return [month, day].join(' ');
      case "dd MMM":
        month = this.monthShortLabel[d.getMonth()];
        return [day, month].join(' ');
      case 'yyyy-MM-dd':
        return [year, month, day].join('-');
      case "dd/MMM":
        month = this.monthShortLabel[d.getMonth()];
        return [day, month].join('/');
      case "MMM-yy":
        month = this.monthShortLabel[d.getMonth()];
        year = y.substr(2,4);
        return [month, year].join('-');
    }
}

getRfMillisForDate(date, format){
  if(date == undefined)
    return 0;
  let year, month, day;
  switch(format){
    case "YYYY-MM-DD":
      year = date.split('-')[0];
      month = date.split('-')[1];
      day = date.split('-')[2];
      break;
    case "dd-MMM-yyyy":
      year = date.split('-')[2];
      month = date.split('-')[1];
      day = date.split('-')[0];
      break;
    case "yyyy-MM-dd":
    year = date.split('-')[0];
    month = date.split('-')[1];
    day = date.split('-')[2];
    break;
    case "dd-MMM-yy":
    year = '20'+date.split('-')[2];
    month = this.monthShortLabel.indexOf(date.split('-')[1])+1;
    day = date.split('-')[0];
    break;
  }

  let date1 = new Date(year, month-1, day, 8,30,0,0);
  return date1.getTime();
}

 getIntervalOfDay(refTs, hours, minutes, seconds){
  let date = new Date(refTs);
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);

  return date.getTime();
}

 getReadableMonthDate(dateString){
  let year        = dateString.substring(0,4);
  let month       = dateString.substring(4,6);
  let day         = dateString.substring(6,8);
  let date        = new Date(year, month-1, day);

  return this.monthShortLabel[date.getMonth()] + "-" + day
}

getLastYearCumulativeDate() {
  let lastYear = new Date().getFullYear() - 1;
  const month = new Date().getMonth();
  if (month < 5) {
    lastYear--;
  }

  return lastYear.toString() + '06' + '01';
}

getLastYearEndDate() {
  const year = (new Date().getFullYear() - 1).toString();
  const month = ((new Date().getMonth() + 1).toString().length > 1
    ? (new Date().getMonth() + 1).toString()
    : '0' + (new Date().getMonth() + 1).toString());
  const day = ((new Date().getDate()).toString().length > 1
    ? new Date().getDate().toString()
    : '0' + new Date().getDate().toString());
  return year + month + day;
}

getEndDate() {
  const year = new Date().getFullYear().toString();
  const month = ((new Date().getMonth() + 1).toString().length > 1
    ? (new Date().getMonth() + 1).toString()
    : '0' + (new Date().getMonth() + 1).toString());
  const day = ((new Date().getDate()).toString().length > 1
    ? new Date().getDate().toString()
    : '0' + new Date().getDate().toString());
  return year + month + day;
}

getStartDate() {
  let year = new Date().getFullYear() - 1;
  if ((new Date().getMonth() + 2) >= 13) {
    year = new Date().getFullYear();
  }

  const month = (((new Date().getMonth() + 2) % 12).toString().length > 1
    ? ((new Date().getMonth() + 2) % 12).toString()
    : '0' + ((new Date().getMonth() + 2) % 12).toString());

  const day = '01';

  return year.toString() + month + day;
}

getCumulativeDate() {
  let lastYear = new Date().getFullYear();
  const month = new Date().getMonth();
  if (month < 5) {
    lastYear--;
  }
  return lastYear.toString() + '06' + '01';
}

getLastYearStartDate() {
  let year = new Date().getFullYear() - 2;

  // Change year to last year
  // else take year - 2
  if ((new Date().getMonth() + 2) >= 13) {
    year = new Date().getFullYear() - 1;
  }

  const month = (((new Date().getMonth() + 2) % 12).toString().length > 1
    ? ((new Date().getMonth() + 2) % 12).toString()
    : '0' + ((new Date().getMonth() + 2) % 12).toString());

  const day = '01';

  return year.toString() + month + day;
}

getMonthFromTS(timestamp) {
  const d = new Date(Number(timestamp));
  const month = d.getMonth();
  return this.monthShortLabel[month];
}

getReadableDateFromDateString(dateString){
  let year        = dateString.substring(0,4);
  let month       = dateString.substring(4,6);
  let day         = dateString.substring(6,8);

  let date        = new Date(year, month-1, day);

  return day + "-" + this.monthShortLabel[date.getMonth()] + "-" + year
}

 getHoursMin(input){
  let hours = input.slice(0,2);
  let minutes = input.slice(3,5);
  return hours+minutes;
}

 getDateandTime(timestamp) {
  let d = new Date(timestamp);
  let year = d.getFullYear().toString();
  let month : any = d.getMonth() + 1;
  month = month.toString();
  let date = d.getDate().toString();
  let hours = d.getHours().toString();
  let minutes = d.getMinutes().toString();
  let seconds = d.getSeconds().toString();
  if (month.length < 2) month = '0' + month;
  if (date.length < 2) date = '0' + date;
  if (hours.length < 2) hours = '0' + hours;
  if (minutes.length < 2) minutes = '0' + minutes;
  if (seconds.length < 2) seconds = '0' + seconds;

  let str = date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
  return str;
}

 getDateandTimeDashSeparator(timestamp) {
  let d = new Date(timestamp);
  let year = d.getFullYear().toString();
  let month : any = d.getMonth() + 1;
  month = month.toString();
  let date = d.getDate().toString();
  let hours = d.getHours().toString();
  let minutes = d.getMinutes().toString();
  let seconds = d.getSeconds().toString();
  if (month.length < 2) month = '0' + month;
  if (date.length < 2) date = '0' + date;
  if (hours.length < 2) hours = '0' + hours;
  if (minutes.length < 2) minutes = '0' + minutes;
  if (seconds.length < 2) seconds = '0' + seconds;

  let str = date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
  return str;
}

 getDateandTimeDashSeparatorNew(timestamp) {
  let d = new Date(timestamp);
  let year = d.getFullYear().toString();
  let month : any = d.getMonth() + 1;
  month = month.toString();
  let date = d.getDate().toString();
  let hours = d.getHours().toString();
  let minutes = d.getMinutes().toString();
  let seconds = d.getSeconds().toString();
  if (month.length < 2) month = '0' + month;
  if (date.length < 2) date = '0' + date;
  if (hours.length < 2) hours = '0' + hours;
  if (minutes.length < 2) minutes = '0' + minutes;
  if (seconds.length < 2) seconds = '0' + seconds;

  let str = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  return str;
}

getRefTsFromModelDate(modelDate){
  // if(modelDate != undefined) return moment(modelDate, "YYYYMMDD");
  return 0;
}

getDateString(timestamp){
  //currently return in dd/mm/yyyy
  if(isNaN(timestamp)){
    return '-';
  }
  else {
    let currentDate = new Date(timestamp);
    let hours = currentDate.getHours();
    let minutes : any = currentDate.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    //objDate.toLocaleString(locale, { month: "short" })
    return (this.monthShortLabel[currentDate.getMonth()])+" "+currentDate.getDate()+','+currentDate.getFullYear()
          + " "+hours + ':' + minutes + ' ' + ampm;
  }

}


}

