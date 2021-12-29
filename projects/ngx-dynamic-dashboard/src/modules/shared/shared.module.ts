import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateReferenceDirective } from './shared-directives/template-reference.directive';
import { DynamicComponentLoadDirective } from "./shared-directives/dynamic-component-load.directive";
import { ValidationDirective } from './shared-directives/validation.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    DynamicComponentLoadDirective, 
    ValidationDirective, 
    TemplateReferenceDirective
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicComponentLoadDirective,
    ValidationDirective,
    TemplateReferenceDirective
  ]
})
export class SharedModule { }
