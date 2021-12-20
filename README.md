This library converts the https://github.com/catalogicsoftware/Angular-2-Dashboard-Framework to a library.

The main difference between here and there are
* library instead of app.
* removed all the gadgets.
* change the directive prefix app- to dashboard-
* upgrade to angular 10.

This library still working in process.
items I would like to improve on
* provides an option to use localstorage or backend to store the dashboard configuration.
* emit dashboard events. so the app can listen to the events.
* permissions. This is going to be a big part of the dashboard feature. with permissions, it can display
  the gadget based on permissions.
* code base cleanup.
    * Currently the code base has a lot of type `any`. it would be nice to add some types.
    * tighten up what modules should be exported and what should not exported. This is important
      in the future when libraries continue to evolve.
    * the build system need some love.
* remove the semantic-ui external dependency. I think this is a high priority.

# NGX Dynamic Dashboard Framework

## Usage
you can refer to https://github.com/MHL3060/dashboard-entry the sample project for the latest usage.

to use. 
1) add "ngx-dynamic-dashboard": "^0.0.32" as a dependency in package.json
2) add the following modules to your module.ts (eg. app.module.ts)
    ```ts
      imports: [
        BrowserModule,
        AppRoutingModule,
        NgxAdfModule,
        MenuModule,
        GridModule,
        DynamicFormModule,
        ErrorHandlerModule,
        ConfigurationModule,
        AddGadgetModule,
        GadgetModule
      ],
      providers: [
        RuntimeService,
        NewsService,
        OptionsService,
        {
          provide: APP_INITIALIZER,
          useFactory: GadgetRegistry,
          deps: [],
          multi: true
        }
      ]
    ```
3) Create a GadgetRegistery.ts to register your GadgetComponent. The following code just register NewGadgetComponent.
    ```ts
    export function GadgetRegistry(): () => void {
      return () => {
        GadgetFactory.setComponentType('NewsGadgetComponent', NewsGadgetComponent);
      };
    }
    ```
4) in your component template. add the dashboard directive.
    ```html
    <div class="content" role="main">
      <dashboard-menu></dashboard-menu>
      <dashboard-grid></dashboard-grid>
    </div>
    ```



## Sample Board 1
![Image of Main Screen](https://github.com/catalogicsoftware/Angular-2-Dashboard-Framework/blob/master/src/assets/documentation/images/sb1.png)

## Add Board and Gadget 
![Image of Add Gadget To Screen](https://github.com/catalogicsoftware/Angular-2-Dashboard-Framework/blob/master/src/assets/documentation/gifs/add.gif)

## Layout
![Image Layout](https://github.com/catalogicsoftware/Angular-2-Dashboard-Framework/blob/master/src/assets/documentation/gifs/layout.gif)


How to use this library. 

I have created a simple app called dashboard-entry https://github.com/MHL3060/dashboard-entry This app
describes the usage of this library.

* add `fomatic-ui` and `jquery` dependency. (Will try to remove both of them in the future).

* create a GadgetRegistry.ts to registered Gadget lookup.
```ts
export function GadgetRegistry(): () => void {
  return () => {
    GadgetFactory.setComponentType('NewsGadgetComponent', NewsGadgetComponent);
  };
}
```

* import the ngx-dynamic-dashboard module into your app's module.ts. registered GadgetRegistry.
 
eg
```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  AddGadgetModule,
  ConfigurationModule,
  DynamicFormModule,
  ErrorHandlerModule,
  GridModule,
  MenuModule,
  NgxAdfModule, OptionsService,
  RuntimeService
} from 'ngx-dynamic-dashboard';
import {NewsService} from './gadgets/news/service';
import {GadgetModule} from './gadgets/gadget.module';
import {GadgetRegistry} from './GadgetRegistery';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxAdfModule,
    MenuModule,
    GridModule,
    DynamicFormModule,
    ErrorHandlerModule,
    ConfigurationModule,
    AddGadgetModule,
    GadgetModule

  ],
  providers: [
    RuntimeService,
    NewsService,
    OptionsService,
    {
      provide: APP_INITIALIZER,
      useFactory: GadgetRegistry,
      deps: [],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

```
* add Gadget to your library.

The following JSON document describes gadget library. currently this need to live in your app's assets/api folder
and the file name need to be `gadget-library-model.json`

```json
{
  "library": [
    {
      "componentType": "NewsGadgetComponent",
      "name": "News",
      "description": "What's new",
      "icon": "assets/images/news.png",
      "instanceId": -1,
      "tags": [
        {
          "facet": "Informational",
          "name": "news"
        },
        {
          "facet": "List",
          "name": "news"
        }
      ],
      "config": {
        "propertyPages": [
          {
            "displayName": "Run",
            "groupId": "run",
            "position": 10,
            "properties": [
              {
                "controlType": "dynamicdropdown",
                "key": "endpoint",
                "label": "News URL",
                "value": "news",
                "required": true,
                "order": 3
              },
              {
                "controlType": "textbox",
                "key": "title",
                "label": "Title",
                "value": "News",
                "required": true,
                "order": 1
              },
              {
                "controlType": "hidden",
                "key": "instanceId",
                "label": "",
                "value": 2,
                "required": true,
                "order": -1
              }
            ]
          }
        ]
      },
      "actions": [
        {
          "name": "Add"
        }
      ]
    }
  ]
}
```
## Example JSON document
The following JSON document describes a single board along with its layout, gadgets and their properites.

```json
{
  "board": [
    {
      "title": "Board Sample 1",
      "structure": "3-6-3",
      "id": 9,
      "boardInstanceId": 1,
      "rows": [
        {
          "columns": [
            {
              "styleClass": "three wide",
              "gadgets": [
                {
                  "componentType": "NewsGadgetComponent",
                  "name": "News",
                  "description": "What's new",
                  "icon": "images/news.png",
                  "instanceId": 1500253814523,
                  "tags": [
                    {
                      "facet": "Informational",
                      "name": "news"
                    },
                    {
                      "facet": "List",
                      "name": "news"
                    }
                  ],
                  "config": {
                    "propertyPages": [
                      {
                        "displayName": "Run",
                        "groupId": "run",
                        "position": 10,
                        "properties": [
                          {
                            "value": "news",
                            "key": "endpoint",
                            "label": "News URL",
                            "required": false,
                            "order": 3,
                            "controlType": "dynamicdropdown"
                          },
                          {
                            "value": "News",
                            "key": "title",
                            "label": "Title",
                            "required": false,
                            "order": 1,
                            "controlType": "textbox"
                          },
                          {
                            "value": 2,
                            "key": "instanceId",
                            "required": false,
                            "order": -1,
                            "controlType": "hidden"
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            {
              "styleClass": "six wide",
              "gadgets": [
                {
                  "componentType": "CPUGadgetComponent",
                  "name": "CPU Chart",
                  "description": "Monitors CPU utilization for application.",
                  "icon": "images/cpu.png",
                  "instanceId": 1499912922910,
                  "tags": [
                    {
                      "facet": "Performance",
                      "name": "real-time"
                    },
                    {
                      "facet": "Chart",
                      "name": "bar"
                    }
                  ],
                  "config": {
                    "propertyPages": [
                      {
                        "displayName": "Run",
                        "groupId": "run",
                        "position": 10,
                        "properties": [
                          {
                            "value": "CPU Utilization",
                            "key": "title",
                            "label": "Title",
                            "required": false,
                            "order": 1,
                            "controlType": "textbox"
                          },
                          {
                            "value": "Carlosappliance - Process Monitor",
                            "key": "endpoint",
                            "label": "API Endpoints",
                            "required": false,
                            "order": 3,
                            "controlType": "dynamicdropdown"
                          },
                          {
                            "value": 999,
                            "key": "instanceId",
                            "required": false,
                            "order": -1,
                            "controlType": "hidden"
                          }
                        ]
                      },
                      {
                        "displayName": "Chart",
                        "groupId": "chart",
                        "position": 11,
                        "properties": [
                          {
                            "value": true,
                            "key": "chart_properties",
                            "label": "Show chart details",
                            "required": false,
                            "order": 3,
                            "controlType": "checkbox"
                          }
                        ]
                      }
                    ]
                  }
                },
                {
                  "componentType": "TrendGadgetComponent",
                  "name": "Trend",
                  "description": "General trends.",
                  "icon": "images/trend.png",
                  "instanceId": 1499912901569,
                  "tags": [
                    {
                      "facet": "Performance",
                      "name": "trend"
                    },
                    {
                      "facet": "Chart",
                      "name": "area"
                    }
                  ],
                  "config": {
                    "propertyPages": [
                      {
                        "displayName": "Run",
                        "groupId": "run",
                        "position": 10,
                        "properties": [
                          {
                            "value": "Devappliance",
                            "key": "endpoint",
                            "label": "API Endpoints",
                            "required": false,
                            "order": 2,
                            "controlType": "dynamicdropdown"
                          },
                          {
                            "value": "Trend",
                            "key": "title",
                            "label": "Title",
                            "required": false,
                            "order": 1,
                            "controlType": "textbox"
                          },
                          {
                            "value": 2,
                            "key": "instanceId",
                            "required": false,
                            "order": -1,
                            "controlType": "hidden"
                          }
                        ]
                      },
                      {
                        "displayName": "Chart",
                        "groupId": "chart",
                        "position": 11,
                        "properties": [
                          {
                            "value": true,
                            "key": "chart_properties",
                            "label": "Show chart details",
                            "required": false,
                            "order": 3,
                            "controlType": "checkbox"
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            {
              "styleClass": "three wide",
              "gadgets": []
            }
          ]
        }
      ]
    }
  ]
}
```

## Alert/Notification
![Image Notification](https://github.com/catalogicsoftware/Angular-2-Dashboard-Framework/blob/master/src/assets/documentation/gifs/notification.gif)

## Sample Realtime Web Socket Based Gadget
![Image of Add Gadget To Screen](https://github.com/catalogicsoftware/Angular-2-Dashboard-Framework/blob/master/src/assets/documentation/gifs/websocket-realtime.gif)

## Sample Board 2
![Image of Main Screen](https://github.com/catalogicsoftware/Angular-2-Dashboard-Framework/blob/master/src/assets/documentation/images/sb2.png)

## Drag and Drop
![Image of Add Board To Screen](https://github.com/catalogicsoftware/Angular-2-Dashboard-Framework/blob/master/src/assets/documentation/gifs/drag-drop.gif)

## Facet Filter
![Image of Filter Board To Screen](https://github.com/catalogicsoftware/Angular-2-Dashboard-Framework/blob/master/src/assets/documentation/gifs/filter.gif)



> Note: This project is under heavy construction and is not intended for general production use yet. As such, we are not accepting bugs at the moment and documentation is quite lacking.

This is an angular (ngx) based dashboard framework that is inspired by JIRA's dashboard implementation and https://github.com/angular-dashboard-framework/angular-dashboard-framework

The primary projects leveraged:
* Angular  - https://angularjs.org/
* ngx-charts (angular based d3 charts) - https://github.com/swimlane/ngx-charts
* Semantic-UI - https://semantic-ui.com/
* ng2-dnd drag and drop - https://github.com/akserg/ng2-dnd
* AI Natural Language Processing - The board includes two options for AI, Wit.Ai and IBM Watson.
* Wit.ai - Natural Language Processing site has been integrated via JSONP
* IBM Watson - IBM Watson does not support JSONP so the code relies on a backend implementation of the IBM Watson SDK.
I offer sample backend code based on Spring Boot within the comments of the Runtime Service

Features:
* Leverages Angular's dynamic data driven forms approach for gadget property pages and properties - https://angular.io/guide/dynamic-form
* Dynamic component strategy for creating gadget instances during runtime - https://angular.io/guide/dynamic-component-loader
* Faceted gadget search approach leveraging tags
* Support multiple board creation
* Drag and Drop support
* Multiple Data Source/Endpoint management
* Web Socket support
* Completely customizable and configurable

# Getting Started Developing a Gadget

The code includes a very simple Todo gadget that can be used as an example for getting started developing your own gadget. The following steps uses that Todo Gadget as a reference. You focus on defining the gadget and the rest of the framework will deal with making it available to the Add Gadget Modal, drag and drop, instance creation, tracking, persistence and cleanup, etc.

## Define the Gadget Component, Service and View

* Todo Component  [todo-gadget.component.ts](https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework/blob/master/src/app/gadgets/todo/todo-gadget.component.ts)
* Todo View [view.html](https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework/blob/master/src/app/gadgets/todo/view.html)
* Todo Service [service.ts](https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework/blob/master/src/app/gadgets/todo/service.ts)
* Sample mock service data [todo-model.json](https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework/blob/master/src/assets/api/todo-model.json)

## Define the gadget's model

The model is used to dynamically create and render the gadget and its property page forms. This model is an entry into a model array used for all gadgets. You will simply add an entry to the model's array. See the Todo entry.
Add an entry for the gadget in the library model array [gadget-library-model.json](https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework/blob/master/src/assets/api/gadget-library-model.json)

## Add the gadget entry to the gadget factory class

Add an entry for your gadget in the factory gadget class [gadget-factory.ts](https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework/blob/master/src/app/add-gadget/gadget-factory.ts)

## Gadget Icon

Define an image/icon for your gadget [todo.png](https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework/blob/master/src/assets/images/todo.png)

## Gadget Module References

* Import the gadget's component into the board module [board.module.ts](https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework/blob/master/src/app/board/board.module.ts)
* Import the gadget's service into the grid module [grid.module.ts](https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework/blob/master/src/app/grid/grid.module.ts)
* Import the gadget's component and service into the gadget module [gadget.module.ts](https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework/blob/master/src/app/gadgets/gadget.module.ts)

![Todo Gadget](https://github.com/catalogicsoftware/Angular-2-Dashboard-Framework/blob/master/src/assets/documentation/gifs/TodoGadget.gif)

# NgADF

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.x.

## Setup

Clone this repository then run `npm install`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--aot --prod` flag for ahead of time compilation and production mode. 

The title of that issue suggests an issue with AOT but in my testing `--prod` seems to be the problem. 

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Source Code Documentation

This project uses the compodoc project : https://github.com/compodoc/compodoc

Run `npm install -g @compodoc/compodoc` to install compodoc globally
Run `compodoc -p tsconfig.json -n 'NGX Dynamic Dashboard Framework'` to generate the documentation. It will be placed in the documentation folder
Run `compodoc -s` to serve up the documentation site at http://localhost:8080

## Spring Boot Backend Project

There is an accompanying java based backend project that serves up some of the endpoints used by the board.

[https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework-microservice](https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework-microservice)

It is a maven based project so you will need to do the following: 
* Install and configure Maven. 
* Copy the dist directory produced from this project's build into the 
`static` folder of the microservice project. 
* Build the microservice project using `<directory path to maven bin folder>/mvn install`  from within the project's root directory. 
* Launch the microservice over the default port: `http://localhost:8080` using `java -jar <path to the microservice root folder>/target/ngxdd-x.y.z.jar`


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

