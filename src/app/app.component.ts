import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const TIME_SAVED_THRESHOLD = 100;

const WALL = '#';
const SAFE = '.';
const START = 'S';
const END = 'E';

/**
 * Implement Breadth First Search
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

  result = signal('');

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      const input = this.parseInput(this.parseRow(this.input));
      const total = this.start(input);
      this.result.set(`${total}`);
    }, 0);
  }

  start(map: any[][]): number {
    const orgPath = this.reconstructPath(this.search(map));
    let count = 0;
    let visited = new Set();

    orgPath.forEach((node, i) => {
      this.disableCollision(map, node).forEach((newNode) => {
        if (!visited.has(this.formatLoc(newNode))) {
          const idx = orgPath.findIndex((n) => this.isSameNode(n, newNode));
          const timeSaved = idx - i - 2;
          if (timeSaved >= TIME_SAVED_THRESHOLD) {
            count++;
          }
        }
        visited.add(this.formatLoc(node));
      });
    });
    return count;
  }

  search(map: any[][]): { row: number; col: number; parent: any } | null {
    const visited = new Set();
    const queue: any[] = [];
    const start = this.findPosition(map, START);

    if (start) {
      visited.add(this.formatLoc(start));
      queue.push(start);

      while (queue.length) {
        const s = queue.shift();
        if (s) {
          if (this.isGoal(map, s)) {
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
    }
    return null;
  }

  disableCollision(map: any[][], curr: { row: number; col: number }): any[] {
    let node1 = null,
      node2 = null;
    const arr = [];

    node1 = { ...curr, row: curr.row - 1 };
    node2 = { ...curr, row: curr.row - 2 };
    if (this.canPassThrWall(map, node1, node2)) arr.push(node2);

    node1 = { ...curr, row: curr.row + 1 };
    node2 = { ...curr, row: curr.row + 2 };
    if (this.canPassThrWall(map, node1, node2)) arr.push(node2);

    node1 = { ...curr, col: curr.col - 1 };
    node2 = { ...curr, col: curr.col - 2 };
    if (this.canPassThrWall(map, node1, node2)) arr.push(node2);

    node1 = { ...curr, col: curr.col + 1 };
    node2 = { ...curr, col: curr.col + 2 };
    if (this.canPassThrWall(map, node1, node2)) arr.push(node2);

    return arr;
  }

  canPassThrWall(
    map: any[][],
    node1: { row: number; col: number },
    node2: { row: number; col: number }
  ): { row: number; col: number } | null {
    if (
      this.validNode(map, node1) &&
      this.isWall(map, node1) &&
      this.validNode(map, node2) &&
      this.canMove(map, node2)
    )
      return node2;

    return null;
  }

  isSameNode(
    node1: { row: number; col: number },
    node2: { row: number; col: number }
  ): boolean {
    return node1.row === node2.row && node1.col === node2.col;
  }

  validNode(map: any[][], node: { row: number; col: number }) {
    const width = map[0].length;
    const height = map.length;

    return (
      node.row >= 0 && node.row < height && node.col >= 0 && node.col < width
    );
  }

  reconstructPath(
    node: { parent: any; row: number; col: number } | null
  ): any[] {
    if (!node) return [];

    const path = [];
    let curr = node;

    while (curr) {
      path.push({ row: curr.row, col: curr.col });
      curr = curr.parent;
    }

    path.reverse();
    return path;
  }

  findPaths(map: any[][], curr: { row: number; col: number }): any[] {
    let node = null;
    const arr: any[] = [];

    node = { row: curr.row - 1, col: curr.col };
    if (this.validNode(map, curr) && this.canMove(map, node)) arr.push(node);

    node = { row: curr.row + 1, col: curr.col };
    if (this.validNode(map, curr) && this.canMove(map, node)) arr.push(node);

    node = { row: curr.row, col: curr.col - 1 };
    if (this.validNode(map, curr) && this.canMove(map, node)) arr.push(node);

    node = { row: curr.row, col: curr.col + 1 };
    if (this.validNode(map, curr) && this.canMove(map, node)) arr.push(node);

    return arr;
  }

  canMove(map: any[][], curr: { row: number; col: number }) {
    return [SAFE, END].includes(map[curr.row][curr.col]);
  }

  isGoal(map: any[][], curr: { row: number; col: number }): boolean {
    return map[curr.row][curr.col] === END;
  }

  isWall(map: any[][], curr: { row: number; col: number }): boolean {
    return map[curr.row][curr.col] === WALL;
  }

  formatLoc(currPos: { row: number; col: number }) {
    return [currPos.row, currPos.col].join('-');
  }

  findPosition(
    map: any[][],
    type: string
  ): { row: number; col: number } | null {
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        if (map[row][col] === type) {
          return { row, col };
        }
      }
    }
    return null;
  }

  parseInput(input: string[]): any[][] {
    return input.map((line) => line.split(''));
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
