import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'ng-template[type]'
})
export class TemplateReferenceDirective {
  @Input() type: string;
  constructor(public template: TemplateRef<any>) {}

}
