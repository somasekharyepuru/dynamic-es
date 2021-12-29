import { HTTPAPIConfig } from '../../../vl-core-services/vl-http/http-api.config';


export interface SelectConfig {
    title: string;
    key?: string;
    type: 'manual' | 'api' | 'service';
    icon?: string;
    allFieldName?: 'all' | string;
    serviceConfig?: SelectServiceConfig;
    options?: SelectDropdownOption[];
    otherOptions?: {[key: string]: SelectDropdownOption[]};
    apiConfig?: SelectAPIConfig;
    ngSelectConfig?: SelectNgConfig;
    byDefaultSelect?: string;
    disabled?: boolean;
}

export interface SelectNgConfig {
    bindLabel?: string;
    bindValue?: string;
    loadingText?: string;
    readonly?: boolean;
    multiple?: boolean;
    closeOnSelect?: boolean;
}

export interface SelectDropdownOption {
    title?: string;
    key?: string;
    icon?: string;
    disabled ?: boolean;
}

export interface SelectAPIConfig extends HTTPAPIConfig {
    titleField?: 'arrayItem' | 'objectKey' | string;
    keyField?: 'arrayItem' | 'objectKey' | string;
}



export interface SelectServiceConfig {
    functionName: string;
    paramObject?: any;
    titleField: string;
    keyField?: string;
}
