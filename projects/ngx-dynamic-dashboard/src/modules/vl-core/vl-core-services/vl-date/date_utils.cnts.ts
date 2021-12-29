export interface DateConfig {
    countConfig?: string;
    countVariable?: 'year' | 'month' | 'day' ;
    patternDelimiter?: string;
    dateKeys?: string[];
    dateTypeObj?: DateType;
    currentDatePattern?: DatePattern;
    convertDatePattern?: DatePattern;
    upToYear?: boolean;
    startYear?: number;
    reverse?: boolean;
}


export interface DatePattern {
    pattern: string;
    delimiter: string;
}

export interface DateType {
    weekday?: string[];
    year?: string[];
    month?: string[];
    day?: string[];
    hour?: string[];
    minute?: string[];
    second?: string[];
    timeZoneName?: string[];
    dateStyle?: string[];
}
