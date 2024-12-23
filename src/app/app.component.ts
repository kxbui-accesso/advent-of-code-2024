import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;
const MAX_SIDE = 4;

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
  visited = new Set();

  onSubmit() {
    const map = this.parseRow(this.input).map((element) => element.split(''));
    let total = 0;

    this.result.set(`...waiting`);

    setTimeout(() => {
      this.visited.clear();
      const total = this.start(map);
      this.result.set(`${total}`);
    }, 0);
  }

  start(map: any[][]): number {
    let total = 0;
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        if (!this.hasVisited({ row, col })) {
          const { area, fences } = this.searchArea(
            map,
            { row, col },
            map[row][col]
          );
          total += area * fences;
        }
      }
    }
    return total;
  }

  searchArea(
    map: any[][],
    curr: { row: number; col: number },
    type: string
  ): { area: number; fences: number } {
    let totalArea = 0,
      totalFences = 0;
    const nextMoves = this.getNextMoves(map, curr, type);
    if (nextMoves?.length) {
      this.visited.add(this.formatLoc(curr));
      nextMoves.forEach((move) => {
        const { area, fences } = this.searchArea(map, move, type);
        totalArea += area;
        totalFences += fences;
      });
      return {
        area: 1 + totalArea,
        fences: totalFences + this.countEdges(map, curr, type),
      };
    } else {
      if (!this.hasVisited(curr)) {
        this.visited.add(this.formatLoc(curr));
        return { area: 1, fences: this.countEdges(map, curr, type) };
      }
      return { area: 0, fences: 0 };
    }
  }

  countEdges(
    map: any[][],
    curr: { row: number; col: number },
    type: string
  ): number {
    let count = 0;
    let neighbor = null;
    const width = map[0].length;
    const height = map.length;

    // right
    neighbor = { row: curr.row, col: curr.col + 1 };
    if (neighbor.col >= width || map[neighbor.row][neighbor.col] !== type)
      count++;

    // up
    neighbor = { row: curr.row - 1, col: curr.col };
    if (curr.row - 1 < 0 || map[neighbor.row][neighbor.col] !== type) count++;

    // down
    neighbor = { row: curr.row + 1, col: curr.col };
    if (curr.row + 1 >= height || map[neighbor.row][neighbor.col] !== type)
      count++;

    // left
    neighbor = { row: curr.row, col: curr.col - 1 };
    if (curr.col - 1 < 0 || map[neighbor.row][neighbor.col] !== type) count++;

    return count;
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
      arr.push({ row: curr.row + 1, col: curr.col, dir: DOWN });
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
    return this.visited.has(this.formatLoc(curr));
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
