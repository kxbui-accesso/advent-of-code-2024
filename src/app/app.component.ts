import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const ROBOT_NUM = 2;

const NUMERIC_KEYPAD = `7 8 9
4 5 6
1 2 3
# 0 A`;

const DIRECTIONAL_KEYPAD = `# ^ A
< v >`;

const UP = '^';
const DOWN = 'v';
const LEFT = '<';
const RIGHT = '>';
const WALL = '#';
const ACTIVATE = 'A';

interface Node {
  row: number;
  col: number;
  parent?: Node;
  direction: string;
  count?: number;
}

type SearchResult = Node;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `029A
980A
179A
456A
379A`;

  result = signal('');
  pathMap = new Map<string, SearchResult[]>();

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      const input = this.parseRow(this.input);
      const total = this.start(input);
      this.result.set(`${total}`);
    }, 0);
  }

  start(lines: string[]): number {
    let total = 0;
    this.pathMap.clear();

    lines.forEach((line) => {
      const sequence = this.getSequence(line);
      total += this.getCodeComplexity(line, sequence);
    });
    return total;
  }

  getSequence(line: string): string {
    let arr = this.searchKeypad(line, false);
    let robots = ROBOT_NUM;

    while (robots > 0) {
      let tempArr: any[] = [];
      arr.forEach((seq) => {
        const result = this.searchKeypad(seq);
        tempArr = [...tempArr, ...result];
      });
      arr = this.findShortestStrings(tempArr);
      robots--;
    }

    return arr[0];
  }

  findShortestStrings(arr: any[]) {
    if (arr.length === 0) {
      return [];
    }

    let minLength = arr[0].length;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].length < minLength) {
        minLength = arr[i].length;
      }
    }

    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length === minLength) {
        result.push(arr[i]);
      }
    }

    return result;
  }

  getCodeComplexity(code: string, sequence: string) {
    return this.getDigit(code) * sequence.length;
  }

  searchKeypad(line: string, directional = true): string[] {
    let start = directional ? { row: 0, col: 2 } : { row: 3, col: 2 };
    const map = this.parseRow(
      directional ? DIRECTIONAL_KEYPAD : NUMERIC_KEYPAD
    ).map((line) => line.trim().split(/\s*[\s,]\s*/));
    let arr: any[] = [];

    for (let i = 0; i < line.length; i++) {
      const goal = line[i];
      const sequences = this.getPathFromKeypad(map, start, goal);
      if (sequences) {
        arr = this.generatePermutations(
          arr,
          sequences.map(this.reconstructPath)
        );
        start = { row: sequences[0].row, col: sequences[0].col };
      }
    }

    return arr;
  }

  generatePermutations(arr1: any[], arr2: any[]): any[] {
    const arr: any[] = [];

    if (!arr1.length && !arr2.length) return arr;
    if (!arr1.length) return arr2;
    if (!arr2.length) return arr1;

    for (let x = 0; x < arr1.length; x++) {
      for (let y = 0; y < arr2.length; y++) {
        arr.push(`${arr1[x]}${arr2[y]}`);
      }
    }
    return arr;
  }

  getPathFromKeypad(
    map: any[][],
    start: { row: number; col: number },
    goal: string
  ): SearchResult[] {
    if (map[start.row][start.col] === goal)
      return [{ ...start, direction: '' }];

    const key = `${map[start.row][start.col]}-${goal}`;
    if (this.pathMap.has(key)) {
      return this.pathMap.get(key)!;
    }
    const result = this.search(map, start, goal);
    this.pathMap.set(key, result);
    return result;
  }

  search(
    map: any[][],
    start: { row: number; col: number },
    goal: string
  ): SearchResult[] {
    const visited = new Set();
    const queue: any[] = [];
    const arr: any[] = [];
    let minLength = Infinity;

    queue.push({ ...start, count: 0 });

    while (queue.length) {
      const indexToRemove = this.findSmallestIdx(queue);
      const [s] = queue.splice(indexToRemove, 1);

      if (s) {
        if (this.isGoal(map, s, goal)) {
          const length = this.reconstructPath(s).length;
          if (minLength >= length) {
            arr.push(s);
            minLength = length;
          }
        } else {
          if (s.count <= minLength) {
            const paths = this.findPaths(map, s);
            paths.forEach((path) => {
              const node = { ...path, parent: s, count: s.count + 1 };
              visited.add(this.formatLoc(path));
              queue.push(node);
            });
          }
        }
      }
      visited.add(this.formatLoc(start));
    }
    return arr;
  }

  findSmallestIdx(arr: any[]) {
    if (arr.length === 1) {
      return 0;
    }
    let smallest = arr[0].f;
    let idx = 0;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].f < smallest) {
        smallest = arr[i].count;
        idx = i;
      }
    }
    return idx;
  }

  reconstructPath(node: SearchResult): string {
    if (!node) return '';

    let path = ACTIVATE;
    let curr: Node | undefined = node;

    while (curr) {
      path = curr.direction ? `${curr.direction}${path}` : path;
      curr = curr.parent;
    }

    return path;
  }

  findPaths(map: any[][], curr: { row: number; col: number }): any[] {
    let node = null;
    const arr: any[] = [];

    node = { row: curr.row - 1, col: curr.col, direction: UP };
    if (this.validNode(map, node)) arr.push(node);

    node = { row: curr.row + 1, col: curr.col, direction: DOWN };
    if (this.validNode(map, node)) arr.push(node);

    node = { row: curr.row, col: curr.col - 1, direction: LEFT };
    if (this.validNode(map, node)) arr.push(node);

    node = { row: curr.row, col: curr.col + 1, direction: RIGHT };
    if (this.validNode(map, node)) arr.push(node);

    return arr;
  }

  getDigit(str: string): number {
    return Number(str.match(/\d+/)?.[0]);
  }

  validNode(map: any[][], node: Node) {
    const width = map[0].length;
    const height = map.length;

    return (
      node.row >= 0 &&
      node.row < height &&
      node.col >= 0 &&
      node.col < width &&
      map[node.row][node.col] !== WALL
    );
  }

  isGoal(
    map: any[][],
    curr: { row: number; col: number },
    goal: string
  ): boolean {
    return map[curr.row][curr.col] === goal;
  }

  formatLoc(currPos: { row: number; col: number }) {
    return [currPos.row, currPos.col].join('-');
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
