import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VlSelectComponent } from './vl-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [VlSelectComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  exports: [VlSelectComponent]
})
export class VlSelectModule { }
