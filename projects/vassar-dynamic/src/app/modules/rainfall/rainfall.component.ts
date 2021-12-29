import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Board } from 'ngx-dynamic-dashboard';

@Component({
  selector: 'vl-rainfall',
  templateUrl: './rainfall.component.html',
  styleUrls: ['./rainfall.component.scss']
})
export class RainfallComponent implements OnInit {
  boardData: {
    board: Board
  };
  constructor(private route: ActivatedRoute) {
    this.boardData = this.route.snapshot.data.boardData;
  }

  ngOnInit(): void {
  }

}
