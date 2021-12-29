import { Component, Input, OnInit } from '@angular/core';
import { Options } from 'highcharts';

import { BarChatWidgetService } from './bar-chat-widget.service';
import {Board, Gadget, BoardService} from 'ngx-dynamic-dashboard';

@Component({
  selector: 'vl-bar-chart-widget',
  templateUrl: './bar-chart-widget.component.html',
  styleUrls: ['./bar-chart-widget.component.scss']
})
export class BarChartWidgetComponent implements OnInit {
  @Input() gadgetConfig: Gadget;
  @Input() boardId: string;
  @Input() boardJSON: Board;
  showChart = false;
  /**
   * todo we need to get the data on the ngOnInit or whenever there is reload of the bar component
   * todo every time chart request we need to fetch the latest data and then need to show the things
   */

  constructor(
    private barChartWidgetService: BarChatWidgetService,
    private boardService: BoardService,
  ) { }
  settingsMode = false;
  gadgetType: string = "barChartComponent";
  chartOptions: Options = {};

  ngOnInit(): void {
   this.getConfiguration();
  }

  configureGadget(gadgetConfig: Gadget) {
    this.gadgetConfig = gadgetConfig;
  }

  private getConfiguration(): void {
    this.barChartWidgetService.getConfig(this.gadgetConfig).subscribe( data => {
      this.chartOptions = data;
      this.showChart = true;
    }, error => {
      this.chartOptions = {};
      this.showChart = true;
    })
  }

  toggleSettings() {
    this.settingsMode = !this.settingsMode;
  }

  updateFormValue(value) {
    console.log('coming here')
    this.gadgetConfig.value = value;
    this.boardService.updateWidget(this.boardId, this.gadgetConfig.instanceId, this.gadgetConfig).subscribe( data => {
      // console.log('update here')
      this.getConfiguration();
    })
  }



}
