import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

/**
 * Use Depth First Search
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
//   input = `AAAA
// BBCD
// BBCC
// EEEC`;
    input = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;
  result = signal('');
  visitedMap = new Set();

  onSubmit() {
    const map = this.parseRow(this.input).map((element) => element.split(''));
    let total = 0;

    this.result.set(`...waiting`);

    setTimeout(() => {
      this.visitedMap.clear();
      const total = this.start(map);
      this.result.set(`${total}`);
    }, 0);
  }

  start(map: any[][]): number {
    let total = 0;
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        if (!this.hasVisited({ row, col })) {
          const region: any[] = [];
          const { area } = this.searchArea(
            map,
            { row, col },
            map[row][col],
            region
          );
          total += area * this.countCorners(region);
        }
      }
    }
    return total;
  }

  countCorners(region: any[]): number {
    let count = 0;

    const arr = region
      .slice()
      .sort((a, b) => (a.row === a.row ? a.col - b.col : a.row - b.row));
    const locSet = new Set(arr.map((item) => this.formatLoc(item)));

    arr.forEach((item) => {
      const { row, col } = item;

      // top-left
      if (
        !locSet.has(this.formatLoc({ row, col: col - 1 })) &&
        !locSet.has(this.formatLoc({ row: row - 1, col }))
      )
        count++;

      // top-left-diagonal
      if (
        locSet.has(this.formatLoc({ row, col: col - 1 })) &&
        locSet.has(this.formatLoc({ row: row - 1, col })) &&
        !locSet.has(this.formatLoc({ row: row - 1, col: col - 1 }))
      )
        count++;

      // top-right
      if (
        !locSet.has(this.formatLoc({ row, col: col + 1 })) &&
        !locSet.has(this.formatLoc({ row: row - 1, col }))
      )
        count++;

      // top-right-diagonal
      if (
        locSet.has(this.formatLoc({ row, col: col + 1 })) &&
        locSet.has(this.formatLoc({ row: row - 1, col })) &&
        !locSet.has(this.formatLoc({ row: row - 1, col: col + 1 }))
      )
        count++;

      // bottom-left
      if (
        !locSet.has(this.formatLoc({ row, col: col - 1 })) &&
        !locSet.has(this.formatLoc({ row: row + 1, col }))
      )
        count++;

      // bottom-left-diagonal
      if (
        locSet.has(this.formatLoc({ row, col: col - 1 })) &&
        locSet.has(this.formatLoc({ row: row + 1, col })) &&
        !locSet.has(this.formatLoc({ row: row + 1, col: col - 1 }))
      )
        count++;

      // bottom-right
      if (
        !locSet.has(this.formatLoc({ row, col: col + 1 })) &&
        !locSet.has(this.formatLoc({ row: row + 1, col }))
      )
        count++;

      // bottom-right-diagonal
      if (
        locSet.has(this.formatLoc({ row, col: col + 1 })) &&
        locSet.has(this.formatLoc({ row: row + 1, col })) &&
        !locSet.has(this.formatLoc({ row: row + 1, col: col + 1 }))
      )
        count++;
    });
    return count;
  }

  searchArea(
    map: any[][],
    curr: { row: number; col: number; dir?: number },
    type: string,
    region: any[]
  ): { area: number } {
    let totalArea = 0;
    const nextMoves = this.getNextMoves(map, curr, type);
    if (nextMoves?.length) {
      this.visitedMap.add(this.formatLoc(curr));
      region.push(curr);
      nextMoves.forEach((move) => {
        if (!this.hasVisited(move)) {
          const { area } = this.searchArea(map, move, type, region);
          totalArea += area;
        }
      });
      return {
        area: 1 + totalArea,
      };
    } else {
      if (!this.hasVisited(curr)) {
        this.visitedMap.add(this.formatLoc(curr));
        region.push(curr);
        return { area: 1 };
      }
      return { area: 0 };
    }
  }

  getNextMoves(
    map: any[][],
    curr: { row: number; col: number },
    type: string
  ): any[] | null {
    const arr = [];
    const width = map[0].length;
    const height = map.length;
    let neighbor = null;

    // right
    neighbor = { row: curr.row, col: curr.col + 1 };
    if (
      !this.hasVisited(neighbor) &&
      neighbor.col < width &&
      map[neighbor.row][neighbor.col] === type
    ) {
      arr.push({ ...neighbor, dir: RIGHT });
    }
    // up
    neighbor = { row: curr.row - 1, col: curr.col };
    if (
      !this.hasVisited(neighbor) &&
      neighbor.row >= 0 &&
      map[neighbor.row][neighbor.col] === type
    ) {
      arr.push({ ...neighbor, dir: UP });
    }
    // down
    neighbor = { row: curr.row + 1, col: curr.col };
    if (
      !this.hasVisited(neighbor) &&
      neighbor.row < height &&
      map[neighbor.row][neighbor.col] === type
    ) {
      arr.push({ ...neighbor, col: curr.col, dir: DOWN });
    }
    // left
    neighbor = { row: curr.row, col: curr.col - 1 };
    if (
      !this.hasVisited(neighbor) &&
      neighbor.col >= 0 &&
      map[neighbor.row][neighbor.col] === type
    ) {
      arr.push({ ...neighbor, dir: LEFT });
    }
    return arr;
  }

  hasVisited(curr: { row: number; col: number }) {
    return this.visitedMap.has(this.formatLoc(curr));
  }

  formatLoc(curr: { row: number; col: number }): string {
    return `${curr.row}-${curr.col}`;
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
