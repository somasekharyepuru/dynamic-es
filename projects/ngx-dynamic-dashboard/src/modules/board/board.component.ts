import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TemplateReferenceDirective } from '../shared/shared-directives/template-reference.directive';
import { Board } from './models/Board';

@Component({
  selector: 'vl-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class VlBoardComponent implements OnInit, AfterViewInit {
  @Input() boardData: Board;
  templateTypes = {};
  // @ViewChildren(TemplateReferenceDirective) templates: QueryList<TemplateReferenceDirective>;
  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // this.templates.forEach(x => this.templateTypes[x.type] = x.template);
    this.cd.detectChanges();
  }
}
