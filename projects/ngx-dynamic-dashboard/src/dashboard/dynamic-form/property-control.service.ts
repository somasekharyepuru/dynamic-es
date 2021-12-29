/**
 * Created by jayhamilton on 2/3/17.
 */
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ILibPropertyPage } from '../../models/library.model';

@Injectable()
export class PropertyControlService {

    constructor() {
    }


    toFormGroupFromPP(propertyPages: ILibPropertyPage[]) {

        const group: any = {};

        propertyPages.forEach(propertyPage => {
            group[propertyPage.groupId] = new FormGroup({});
            propertyPage.properties.forEach(property => {
                // todo currently providing one level of child access here can change later for multi-level things
                if (property.child && property.child.length > 0) {
                    group[propertyPage.groupId].addControl(property.key, property.controlType === 'formArray' ? new FormArray([]) : new FormGroup({}));
                    property.child.forEach(innerProperty => {
                        group[propertyPage.groupId].get(property.key).addControl([innerProperty.key], innerProperty.required ? new FormControl(innerProperty.value
                            || '', Validators.required) : new FormControl(innerProperty.value
                                || ''))
                    })
                } else {
                    group[propertyPage.groupId].addControl([property.key], property.required ? new FormControl(property.value
                        || '', Validators.required) : new FormControl(property.value
                            || ''))
                }
            });

        });

        return new FormGroup(group);
    }
}
