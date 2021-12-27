import { Injectable } from '@angular/core';


export const GRID_WIDTH = 18;
export const GRID_ASPECT_RATIO =1;

const MOBILE_BREAKPOINT = 752;

export const GRID_BREAKPOINTS = {
  desktop: MOBILE_BREAKPOINT + 1,
  mobile: MOBILE_BREAKPOINT,
};

export const GRID_COLUMNS = {
  desktop: GRID_WIDTH,
  mobile: 1,
};

export const DEFAULT_CARD_SIZE = { width: 4, height: 3 };

export const MIN_ROW_HEIGHT = 54;

type DashCardPosition = {
  x: number,
  y: number,
  cols: number,
  rows: number,
};



@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor() { }

  public  getPositionForNewDashCard(cards:any[],cols: number = DEFAULT_CARD_SIZE.width,rows: number = DEFAULT_CARD_SIZE.height,width: number = GRID_WIDTH): DashCardPosition {
    let y = 0;
    let x = 0;
    while (y < 1000) {
      while (x <= width - cols) {
        let good = true;
        const position = { x, y, cols, rows };
        for (const card of cards) {
          if (this.intersects(card, position)) {
            good = false;
            break;
          }
        }
        if (good) {
          return position;
        }
        x++;
      }
      x = 0;
      y++;
    }
    // this should never happen but flow complains if we return undefined
    return { x, y, cols, rows };
  }


  private intersects(a: DashCardPosition, b: DashCardPosition): boolean {
    return !(
      b.x >= a.x + a.cols ||
      b.x + b.cols <= a.x ||
      b.y >= a.y + a.rows ||
      b.y + b.rows <= a.y
    );
  }

  private printGrid(cards, width) {
    let grid = [];
    for (let card of cards) {
      for (let col = card.col; col < card.col + card.sizeX; col++) {
        for (let row = card.row; row < card.row + card.sizeY; row++) {
          grid[row] =
            grid[row] ||
            Array(width)
              .join(".")
              .split(".")
              .map(() => 0);
          grid[row][col]++;
        }
      }
    }
    console.log("\n" + grid.map(row => row.join(".")).join("\n") + "\n");
  }


}
