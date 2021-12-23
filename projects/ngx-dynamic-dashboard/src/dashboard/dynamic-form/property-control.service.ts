/**
 * Created by jayhamilton on 2/3/17.
 */
import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Injectable()
export class PropertyControlService {

    constructor() {
    }


    toFormGroupFromPP(propertyPages: any[]) {

        const group: any = {};

        propertyPages.forEach(propertyPage => {
            group[propertyPage.groupId] = new FormGroup({});
            propertyPage.properties.forEach(property => {
                group[propertyPage.groupId].addControl([property.key], property.required ? new FormControl(property.value
                    || '', Validators.required) : new FormControl(property.value
                    || ''))
            });

        });

        return new FormGroup(group);
    }
}
