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
    let set = new Set();
    const result = this.search(map);
    if (result) {
      return this.backtrack(result, result[result.length - 1]).size;
    }

    return set.size;
  }

  search(map: any[][]): any[] | null {
    const start = this.findType(map, START);
    const goal = this.findType(map, END);

    if (start && goal) {
      const open: any[] = [
        { location: { ...start, direction: EAST }, f: 0, g: 0 },
      ];
      const close: any[] = [];

      while (open.length) {
        const indexToRemove = this.findSmallestIdx(open);
        const [q] = open.splice(indexToRemove, 1);
        this.visited.add(this.formatLoc(q.location));

        if (map[q.location.row][q.location.col] === END) {
          // goal found, end search
          close.push(q);
          return close;
        }

        let paths = this.findPath(map, q.location);
        if (paths.length) {
          paths
            .filter((path) => path.visited)
            .forEach((path) => {
              const g = q.g + path.cost;
              close.push({
                location: path,
                f: q.g + q.h,
                parent: q,
                g,
              });
            });
          paths
            .filter((path) => !path.visited)
            .forEach((path) => {
              // successor.g = q.g + distance between successor and q
              const g = q.g + path.cost;
              // successor.h = distance from goal to successor
              const h = this.calcDistance(path, goal);
              // successor.f = successor.g + successor.h
              const f = g + h;

              const successor = { location: path, f, parent: q, g, h };

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
            });
        }
        close.push(q);
      }
    }
    return null;
  }

  backtrack(nodes: any[], lastNode: any) {
    let curr = lastNode;
    const nodesOnBestPath = this.reconstructPath(curr);
    let minCost = curr.g;
    let allPaths = new Set([...nodesOnBestPath]);

    while (curr) {
      const visitedNodes = nodes.filter(
        (node) =>
          this.isSameLocation(node.location, curr.location, true) &&
          node.parent &&
          !allPaths.has(
            this.formatLoc({ ...node.parent.location, direction: undefined })
          )
      );
      if (visitedNodes.length) {
        visitedNodes.forEach((node) => {
          const delta = node.g - node.parent.g;
          if (node.parent.g + delta <= curr.g) {
            allPaths = new Set([...allPaths, ...this.backtrack(nodes, node)]);
          }
        });
      }
      minCost -= minCost - curr.g;
      curr = curr.parent;
    }
    return allPaths;
  }

  reconstructPath(node: { parent: any; location: any }): Set<string> {
    const path = new Set<string>();
    let curr = node;

    while (curr) {
      const { direction, ...remaining } = curr.location;
      path.add(this.formatLoc(remaining));
      curr = curr.parent;
    }
    return path;
  }

  isSameLocation(
    a: { row: number; col: number; direction: string },
    b: { row: number; col: number; direction: string },
    ignoreDirection = false
  ): boolean {
    const isLocSame = a.row === b.row && a.col === b.col;
    return !ignoreDirection
      ? isLocSame && a.direction === b.direction
      : isLocSame;
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

    const moveForward: Record<string, any> = {
      [EAST]: { row: curr.row, col: curr.col + 1, direction: EAST },
      [WEST]: { row: curr.row, col: curr.col - 1, direction: WEST },
      [NORTH]: { row: curr.row - 1, col: curr.col, direction: NORTH },
      [SOUTH]: { row: curr.row + 1, col: curr.col, direction: SOUTH },
    };

    const turnDirections: Record<string, string> = {
      [EAST]: `${NORTH},${SOUTH}`,
      [WEST]: `${NORTH},${SOUTH}`,
      [NORTH]: `${EAST},${WEST}`,
      [SOUTH]: `${EAST},${WEST}`,
    };

    // move forward
    const neighbor = moveForward[curr.direction];
    this.isPath(map[neighbor.row][neighbor.col]) &&
      arr.push({ ...neighbor, cost: 1, visited: this.hasVisited(neighbor) });

    // turns
    const turns = turnDirections[curr.direction];
    turns.split(',').forEach((direction) => {
      const location = moveForward[direction];
      this.isPath(map[location.row][location.col]) &&
        !this.hasVisited(location) &&
        arr.push({
          ...curr,
          direction,
          cost: 1000,
          visited: this.hasVisited(neighbor),
        });
    });
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
    return [curr.row, curr.col, curr.direction].filter(Boolean).join('-');
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
