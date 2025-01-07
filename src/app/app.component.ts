import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// const LENGTH = 71;
// const FIRST_NUM_BYTES = 1024;

const LENGTH = 7;
const FIRST_NUM_BYTES = 12;

const SAFE = '.';
const CORRUPTED = '#';

/**
 * Implement Breadth First Search to
 * find the shortest path
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;

  result = signal('');
  foundNumbers: any[] = [];

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      const input = this.parseRow(this.input);
      const total = this.start(input);
      this.result.set(`${total}`);
    }, 0);
  }

  start(input: any[]): number {
    const map = this.generateMap(input);
    const nodes = this.search(map);
    if (nodes) {
      return this.countSteps(nodes);
    }
    return 0;
  }

  countSteps(node: { parent: any; row: number; col: number }): number {
    const path = new Set<string>();
    let count = 0;
    let curr = node;

    while (curr) {
      count++;
      path.add(this.formatLoc(curr));
      curr = curr.parent;
    }
    return count - 1; // remove first node
  }

  search(map: any[][]): { row: number; col: number; parent: any } | null {
    const visited = new Set();
    const queue: any[] = [];
    const start = { row: 0, col: 0 };

    visited.add(this.formatLoc(start));
    queue.push(start);

    while (queue.length) {
      const s = queue.shift();
      if (s) {
        if (this.isGoal(s)) {
          return s;
        }
        const paths = this.findPaths(map, s);
        paths
          .filter((path) => !visited.has(this.formatLoc(path)))
          .forEach((path) => {
            const node = { ...path, parent: s };
            visited.add(this.formatLoc(path));
            queue.push(node);
          });
      }
    }

    return null;
  }

  findPaths(map: any[][], curr: { row: number; col: number }): any[] {
    let node = null;
    const arr: any[] = [];

    node = { row: curr.row - 1, col: curr.col };
    if (node.row >= 0 && !this.isCorrupted(map, node)) arr.push(node);

    node = { row: curr.row + 1, col: curr.col };
    if (node.row < LENGTH && !this.isCorrupted(map, node)) arr.push(node);

    node = { row: curr.row, col: curr.col - 1 };
    if (node.col >= 0 && !this.isCorrupted(map, node)) arr.push(node);

    node = { row: curr.row, col: curr.col + 1 };
    if (node.col < LENGTH && !this.isCorrupted(map, node)) arr.push(node);

    return arr;
  }

  isCorrupted(map: any[][], curr: { row: number; col: number }): boolean {
    return map[curr.row][curr.col] === CORRUPTED;
  }

  isGoal(curr: { row: number; col: number }): boolean {
    return curr.row === LENGTH - 1 && curr.col === LENGTH - 1;
  }

  formatLoc(currPos: { row: number; col: number }) {
    return [currPos.row, currPos.col].join('-');
  }

  generateMap(input: any[]): any[][] {
    const arr = Array.from({ length: LENGTH }, () => Array(LENGTH).fill(SAFE));
    input.slice(0, FIRST_NUM_BYTES).forEach((line) => {
      const [col, row] = line.split(',');
      arr[row][col] = CORRUPTED;
    });
    return arr;
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
