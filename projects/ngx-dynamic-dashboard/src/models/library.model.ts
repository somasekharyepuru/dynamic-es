
export interface ILibOption {
    key: string;
    value: string;
}


export interface ILibProperty {
    controlType: 'textbox' | 'dropdown' | 'checkbox' | 'number' | 'hidden' | 'textarea' | 'formArray' | 'formGroup' | 'colorPicker';
    key: string;
    label: string;
    value: any;
    required: boolean;
    order: number;
    child: ILibProperty[];
    options: ILibOption[]
}

export interface ILibPropertyPage {
    displayName: string;
    groupId: string;
    position: number;
    properties: ILibProperty[];
}

export interface ILibConfig {
    propertyPages: ILibPropertyPage[];
}

export interface ILibAction {
    name: string;
}

export interface ILibrary {
    componentType: string;
    name: string;
    description: string;
    icon: string;
    instanceId: number;
    tags: any[];
    config: ILibConfig;
    actions: ILibAction[];
}

export interface ILibraryConfig {
    library: ILibrary[];
}



