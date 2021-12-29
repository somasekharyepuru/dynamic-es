import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicComponentLoad]'
})
export class DynamicComponentLoadDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

}
