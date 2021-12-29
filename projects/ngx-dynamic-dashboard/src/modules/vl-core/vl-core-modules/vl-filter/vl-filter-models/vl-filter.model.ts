import { SelectConfig } from '../../vl-select/vl-select-models/vl-select-dropdown';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';

export interface VlFilter {
  title: string;
  updateOnChange?: boolean;
  filterConfig: VlFilterConfig[];
  startAndEndDateConfig?: {
    isStartDatePresent: boolean,
    startDateKey?: string,
    isEndDatePresent: boolean,
    endDateKey?: string;
  };
}

export interface VlFilterConfig {
  title?: string;
  key?: string;
  inputType?: 'select' | 'text' | 'radio' | 'tab' | 'textArea' | 'datePicker' | 'checkBox' | 'formArray' | 'colorPicker' | 'json' | 'javascript';
  selectConfig?: SelectConfig;
  radioConfig?: FormButtonConfig;
  checkBoxConfig?: FormButtonConfig;
  updateOnChange?: boolean;
  fireEventOnChange?: boolean;
  datePickerConfig?: Partial<BsDatepickerConfig>;
  labelDisplay?: boolean;
  defaultValue?: string | number;
  isMandatory?: boolean;
  urlKey?: string;
  childs?: VlFilterConfig[];
}

export interface FormDatePickerConfig {
  minDate?: string;
  maxDate?: string;
  view?: 'day' | 'month' | 'year';
}

export interface FormButtonConfig {
  options?: IFormOption[];
}

export interface IFormOption {
  title?: string;
  key?: string;
}
