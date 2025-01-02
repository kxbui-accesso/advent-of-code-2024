import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const EAST = '>';
const WEST = '<';
const NORTH = '^';
const SOUTH = 'v';
const START = 'S';
const END = 'E';
const PATH = '.';

/**
 * Use A* algoirthm with Manhattan distance heuristic
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;

  result = signal('');
  visited = new Set();

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      this.visited.clear();
      const map = this.parseRow(this.input).map((row) => row.split(''));
      const total = this.start(map);
      this.result.set(`${total}`);
    }, 0);
  }

  start(map: any[][]): number {
    const start = this.findType(map, START);
    const goal = this.findType(map, END);
    let goalFound = false;

    if (start && goal) {
      const open: any[] = [
        { location: { ...start, direction: EAST }, f: 0, g: 0 },
      ];
      const close: any[] = [];

      while (open.length && !goalFound) {
        const indexToRemove = this.findSmallestIdx(open);
        const [q] = open.splice(indexToRemove, 1);
        this.visited.add(this.formatLoc(q.location));

        let paths = this.findPath(map, q.location);
        if (paths.length) {
          paths.forEach((path) => {
            if (map[path.row][path.col] === END) {
              // goal found, end search
              goalFound = true;
            } else {
              // successor.g = q.g + distance between successor and q
              const g =
                q.g + (q.location.direction != path.direction ? 1001 : 1);
              // successor.h = distance from goal to successor
              const h = this.calcDistance(path, goal);
              // successor.f = successor.g + successor.h
              const f = g + h;

              const successor = { location: path, f, parent: q, g };

              // if a node with the same position as
              // successor is in the OPEN list which has a
              // lower f than successor, skip this successor

              // if a node with the same position as
              // successor is in the CLOSED list which has
              // a lower f than successor, skip this successor

              // otherwise, add the node to the open list
              const itemInOpen = open.find((item) =>
                this.isSameLocation(item.location, path)
              );
              const itemInClose = close.find((item) =>
                this.isSameLocation(item.location, path)
              );
              if (
                !itemInOpen ||
                itemInOpen.f < f ||
                !itemInClose ||
                itemInClose.f < f
              ) {
                open.push(successor);
              }
            }
          });
        }
        close.push(q);
        if (goalFound) {
          return q.g + 1;
        }
      }
    }
    return 0;
  }

  isSameLocation(
    a: { row: number; col: number },
    b: { row: number; col: number }
  ): boolean {
    return a.row === b.row && a.col === b.col;
  }

  findSmallestIdx(arr: any[]) {
    if (arr.length === 1) {
      return 0;
    }
    let smallest = arr[0].f;
    let idx = 0;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].f < smallest) {
        smallest = arr[i].f;
        idx = i;
      }
    }
    return idx;
  }

  calcDistance(
    curr: { row: number; col: number },
    goal: { row: number; col: number }
  ) {
    return Math.abs(curr.row - goal.row) + Math.abs(curr.col - goal.col);
  }

  findPath(
    map: any[][],
    curr: { row: number; col: number; direction: string }
  ): any[] {
    const arr = [];
    let neighbor = null;

    neighbor = { row: curr.row, col: curr.col + 1, direction: EAST };
    if (
      curr.direction !== WEST &&
      this.isPath(map[neighbor.row][neighbor.col]) &&
      !this.hasVisited(neighbor)
    ) {
      arr.push(neighbor);
    }

    neighbor = { row: curr.row, col: curr.col - 1, direction: WEST };
    if (
      curr.direction !== EAST &&
      this.isPath(map[neighbor.row][neighbor.col]) &&
      !this.hasVisited(neighbor)
    ) {
      arr.push(neighbor);
    }

    neighbor = { row: curr.row - 1, col: curr.col, direction: NORTH };
    if (
      curr.direction !== SOUTH &&
      this.isPath(map[neighbor.row][neighbor.col]) &&
      !this.hasVisited(neighbor)
    ) {
      arr.push(neighbor);
    }

    neighbor = { row: curr.row + 1, col: curr.col, direction: SOUTH };
    if (
      curr.direction !== NORTH &&
      this.isPath(map[neighbor.row][neighbor.col]) &&
      !this.hasVisited(neighbor)
    ) {
      arr.push(neighbor);
    }
    return arr;
  }

  hasVisited(curr: { row: number; col: number; direction: string }) {
    return this.visited.has(this.formatLoc(curr));
  }

  findType(map: any[][], type: string): { row: number; col: number } | null {
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        if (map[row][col] === type) {
          return { row, col };
        }
      }
    }
    return null;
  }

  isPath(str: string): boolean {
    return str === PATH || str === END;
  }

  formatLoc(curr: { row: number; col: number; direction: string }) {
    return `${curr.row}-${curr.col}-${curr.direction}`;
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
