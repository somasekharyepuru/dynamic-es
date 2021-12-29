import { Output } from '@angular/core';
import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Gadget } from '../../models/Board';
import { BoardService } from '../../services/board.service';
import { FormtabService } from './formtab.service';
import { ILibrary } from '../../../../models/library.model';
import { VlFilter } from '../../../vl-core/vl-core-modules/vl-filter/vl-filter-models/vl-filter.model';
import { LibDataService } from '../../../shared/shared-services/lib-data.service';

@Component({
  selector: 'vl-form-tabs',
  templateUrl: './form-tabs.component.html',
  styleUrls: ['./form-tabs.component.scss']
})
export class FormTabsComponent implements OnInit {
  @Input() gadgetType: string;
  @Input() gadgetConfig: Gadget;
  @Output() updateFormValue = new EventEmitter<any>()
  showGadgetConfig = false;
  gadgetData: ILibrary;
  form: FormGroup = new FormGroup({});
  filterConfigs: { [key: string]: VlFilter } = {};
  constructor(
    private libDataService: LibDataService,
    private formTabService: FormtabService,
  ) { }

  ngOnInit(): void {
    console.log(this.gadgetConfig.value)
    this.libDataService.getConfigForGadget(this.gadgetType).subscribe(data => {
      this.gadgetData = data;
      this.initComponent();
      this.form = this.formTabService.generateFormGroup(this.filterConfigs, this.gadgetConfig.value);
      this.showGadgetConfig = true;
    }, error => {
      this.gadgetData = null;
    })
  }


  private initComponent(): void {
    this.generateFilterConfigs();
  }

  private generateFilterConfigs() {
    this.gadgetData.config.propertyPages.forEach(property => {
      this.filterConfigs[property.groupId] = {
        title: property.displayName,
        filterConfig: property.properties
      }
    })
  }

  public changeFormValue(event, groupId: string) {
    console.log('coming here', this.form.value)
    const formValue = this.formTabService.convertToJSON(this.filterConfigs, this.form.value);
    this.updateFormValue.emit(formValue);
    // this.boardService.updateBoard()
  }
}
