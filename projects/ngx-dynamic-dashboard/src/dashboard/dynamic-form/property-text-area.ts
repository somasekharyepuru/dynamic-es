import {PropertyBase} from './property-base';

export class TextAreaProperty extends PropertyBase<string> {

    controlType = 'textarea';
    options: { key: string, value: string }[] = [];

    constructor(options: {} = {}) {
        super(options);
        this.options = options['options'] || [];

    }

}