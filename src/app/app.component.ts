import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const TIME_SAVED_THRESHOLD = 50;

const WALL = '#';
const SAFE = '.';
const START = 'S';
const END = 'E';
const MAX_CHEAT = 20;

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
    const pathMap = this.reconstructPath(this.search(map));
    return this.findCheats(pathMap);
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

  /**
   * HINT: During the execution of a cheat,
   * the program can enter and leave walls multiple times,
   * as long as the cheat ends in normal track, within the maximal allowed cheat time
   * of 20 picoseconds.
   * @param map
   * @param startNode
   * @returns
   */
  findCheats(pathMap: Map<string, number>): number {
    let total = 0;
    const arr = Array.from(pathMap.keys());

    for (let x = 0; x < arr.length - 1; x++) {
      for (let y = x + 1; y < arr.length; y++) {
        const [startRow, startCol] = arr[x].split('-');
        const [endRow, endCol] = arr[y].split('-');
        const count = this.calcDistance(
          { row: Number(startRow), col: Number(startCol) },
          { row: Number(endRow), col: Number(endCol) }
        );
        if (count) {
          const timeSaved = y - x - count;
          if (timeSaved === TIME_SAVED_THRESHOLD) {
            total++;
          }
        }
      }
    }
    return total;
  }

  /**
   * Use Manhattan distance
   * @param startNode
   * @param endNode
   */
  calcDistance(
    startNode: { row: number; col: number },
    endNode: { row: number; col: number }
  ): number | null {
    const dist =
      Math.abs(startNode.row - endNode.row) +
      Math.abs(startNode.col - endNode.col);

    return dist <= MAX_CHEAT ? dist : null;
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
  ): Map<string, number> {
    const map = new Map();
    if (!node) return map;

    let curr = node,
      path = [];

    while (curr) {
      path.push({ row: curr.row, col: curr.col });
      curr = curr.parent;
    }

    path.reverse();
    path.forEach((node, i) => map.set(this.formatLoc(node), i));

    return map;
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
