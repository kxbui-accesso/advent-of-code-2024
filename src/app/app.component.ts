import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const TRAIL_HEAD = 0;
const TRAIL_END = 9;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
  result = signal('');

  onSubmit() {
    const data = this.parseRow(this.input).map((row) => row.split(''));
    let total = 0;

    this.result.set(`...waiting`);

    setTimeout(() => {
      total = this.start(data);
      this.result.set(`${total}`);
    }, 0);
  }

  start(map: any[][]): number {
    const trailHeads = this.findTrailHeads(map);
    let total = 0;
    trailHeads.forEach((trailHead) => {
      total += this.findPath(map, trailHead, 0);
    });
    return total;
  }

  findPath(
    map: any[][],
    curr: { row: number; col: number },
    currHeight: number
  ): number {
    if (currHeight === TRAIL_END) {
      return 1;
    }
    const nextPositions = this.findNextPosition(map, curr, currHeight);
    if (!nextPositions.length && currHeight !== TRAIL_END) {
      return 0;
    }
    let total = 0;
    nextPositions.forEach((nextPosition) => {
      total += this.findPath(map, nextPosition, currHeight + 1);
    });
    return total;
  }

  formatLoc(currPos: { row: number; col: number }) {
    return `${currPos.row}-${currPos.col}`;
  }

  findNextPosition(
    map: any[][],
    curr: { row: number; col: number },
    currHeight: number
  ): { row: number; col: number }[] {
    const arr: any[] = [];
    const width = map[0].length;
    const height = map.length;

    // left
    if (curr.col - 1 >= 0 && +map[curr.row][curr.col - 1] === currHeight + 1) {
      arr.push({ row: curr.row, col: curr.col - 1 });
    }
    // right
    if (
      curr.col + 1 < width &&
      +map[curr.row][curr.col + 1] === currHeight + 1
    ) {
      arr.push({ row: curr.row, col: curr.col + 1 });
    }
    // top
    if (curr.row - 1 >= 0 && +map[curr.row - 1][curr.col] === currHeight + 1) {
      arr.push({ row: curr.row - 1, col: curr.col });
    }
    // bottom
    if (
      curr.row + 1 < height &&
      +map[curr.row + 1][curr.col] === currHeight + 1
    ) {
      arr.push({ row: curr.row + 1, col: curr.col });
    }
    return arr;
  }

  findTrailHeads(map: any[][]): any[] {
    const trailHeads = [];
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        if (+map[row][col] === TRAIL_HEAD) {
          trailHeads.push({ row, col });
        }
      }
    }
    return trailHeads;
  }

  parseRow(data: any): any[] {
    return data.split(/\r?\n|\r|\n/g);
  }

  parseColumn(data: any): { arr1: any[]; arr2: any[] } {
    const arr1: any[] = [],
      arr2: any[] = [];
    const separateLines = data.split(/\r?\n|\r|\n/g);
    separateLines.forEach((element: any) => {
      const stringArray = element.trim().split(/\s*[\s,]\s*/);
      arr1.push(+stringArray[0]);
      arr2.push(+stringArray[1]);
    });
    return { arr1, arr2 };
  }
}
