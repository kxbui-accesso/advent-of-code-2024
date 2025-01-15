import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const ROBOT_NUM = 25;

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
  direction?: string;
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
  pathMap = new Map<string, string[]>();
  iterationMap = new Map<string, number>();
  directionalMap: string[][] = [];
  numericMap: string[][] = [];

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      this.directionalMap = this.parseMap(DIRECTIONAL_KEYPAD);
      this.numericMap = this.parseMap(NUMERIC_KEYPAD);
      const input = this.parseRow(this.input);
      const total = this.start(input);
      this.result.set(`${total}`);
    }, 0);
  }

  start(lines: string[]): number {
    let total = 0;
    this.iterationMap.clear();

    lines.forEach((line) => {
      const sequence = this.findNextSeqLength(line, ROBOT_NUM);
      total += this.getCodeComplexity(line, sequence);
    });
    return total;
  }

  findShortestStringLength(arr: any[]): number {
    if (arr.length === 0) {
      return 0;
    }

    let minLength = arr[0].length;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].length < minLength) {
        minLength = arr[i].length;
      }
    }

    return minLength;
  }

  getCodeComplexity(code: string, seqLength: number) {
    return this.getDigit(code) * seqLength;
  }

  findNextSeqLength(prevSeq: string, iteration: number): number {
    const map = iteration < ROBOT_NUM ? this.directionalMap : this.numericMap;

    let count = 0;
    let start = this.getLoc(map, ACTIVATE);
    const arr = [];
    let total = 0;

    while (start && count < prevSeq.length) {
      const seqs = this.getPath(map, start, prevSeq[count]);
      arr.push(seqs);
      start = this.getLoc(map, prevSeq[count]);
      count++;
    }

    if (iteration === 0) {
      total = this.findBaseSeqLength(arr);
    } else {
      for (let x = 0; x < arr.length; x++) {
        const subTotal: any[] = [];
        for (let y = 0; y < arr[x].length; y++) {
          if (this.iterationMap.has(`${arr[x][y]}-${iteration - 1}`))
            subTotal.push(
              this.iterationMap.get(`${arr[x][y]}-${iteration - 1}`)
            );
          else subTotal.push(this.findNextSeqLength(arr[x][y], iteration - 1));
        }
        total += Math.min(...subTotal);
      }
    }
    this.iterationMap.set(`${prevSeq}-${iteration}`, total);
    return total;
  }

  findBaseSeqLength(arr: string[][]) {
    let total = 0;
    for (let x = 0; x < arr.length; x++) {
      total += this.findShortestStringLength(arr[x]);
    }
    return total;
  }

  getLoc(map: any[][], goal: string): Node | null {
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        if (map[row][col] === goal) return { row, col };
      }
    }
    return null;
  }

  getPath(map: any[][], start: Node, goal: string): string[] {
    if (map[start.row][start.col] === goal) {
      return [ACTIVATE];
    }

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
  ): string[] {
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
          const path = this.reconstructPath(s);
          if (minLength >= path.length) {
            arr.push(path);
            minLength = path.length;
          }
        } else {
          if (s.count <= minLength) {
            const nodes = this.findPaths(map, s);
            nodes
              .filter((node) => !visited.has(this.formatLoc(node)))
              .forEach((node) => {
                const q = { ...node, parent: s, count: s.count + 1 };
                queue.push(q);
              });
          }
        }
      }
      visited.add(this.formatLoc(s));
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

    node = { row: curr.row, col: curr.col - 1, direction: LEFT };
    if (this.validNode(map, node)) arr.push(node);

    node = { row: curr.row + 1, col: curr.col, direction: DOWN };
    if (this.validNode(map, node)) arr.push(node);

    node = { row: curr.row - 1, col: curr.col, direction: UP };
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

  isGoal(map: any[][], curr: Node, goal: string): boolean {
    return map[curr.row][curr.col] === goal;
  }

  formatLoc(currPos: Node) {
    return [currPos.row, currPos.col].join('-');
  }

  parseMap(map: string) {
    return this.parseRow(map).map((line) => line.trim().split(/\s*[\s,]\s*/));
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
