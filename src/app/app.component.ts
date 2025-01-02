import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const UP = '^';
const DOWN = 'v';
const LEFT = '<';
const RIGHT = '>';
const BOT = '@';
const SINGLE_BOX = 'O';
const LEFT_BOX = '[';
const RIGHT_BOX = ']';
const WALL = '#';
const PATH = '.';

/**
 * Use recursion
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`;

  result = signal('');
  map: any[] | null = null;

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      const { data, directions } = this.parseInput(this.parseRow(this.input));
      this.map = this.transformMap(data.map((row) => row.split('')));
      const total = this.start(directions);
      this.result.set(`${total}`);
    }, 0);
  }

  start(directions: any[]): number {
    let curr = null;
    directions.forEach((line) => {
      line.split('').forEach((direction: string) => {
        curr = this.findBot();
        this.move([curr!], direction);
      });
    });
    return this.calcGPSCoordinate();
  }

  transformMap(data: any[][]): any[][] {
    const map = [...data];
    for (let row = 0; row < map.length; row++) {
      const arr = [];
      for (let col = 0; col < map[row].length; col++) {
        if (map[row][col] === SINGLE_BOX) {
          arr.push(LEFT_BOX);
          arr.push(RIGHT_BOX);
        } else if (map[row][col] === BOT) {
          arr.push(BOT);
          arr.push(PATH);
        } else {
          arr.push(map[row][col]);
          arr.push(map[row][col]);
        }
      }
      map[row] = arr;
    }
    return map;
  }

  calcGPSCoordinate(): number {
    let total = 0;
    if (this.map) {
      for (let row = 0; row < this.map.length; row++) {
        for (let col = 0; col < this.map[row].length; col++) {
          if (this.map[row][col] === LEFT_BOX) {
            total += row * 100 + col;
          }
        }
      }
    }
    return total;
  }

  findBot(): { row: number; col: number } | null {
    if (this.map) {
      for (let row = 0; row < this.map.length; row++) {
        for (let col = 0; col < this.map[row].length; col++) {
          if (this.map[row][col] === BOT) {
            return { row, col };
          }
        }
      }
    }
    return null;
  }

  move(curr: { row: number; col: number }[], direction: string): boolean {
    if (curr.some((item) => this.faceWall(item, direction))) {
      return false;
    }
    if (curr.some((item) => this.faceBoxes(item, direction))) {
      const boxes = this.findSurroundingBoxes(curr, direction);
      if (boxes.length && !this.move(boxes, direction)) {
        return false;
      }
    }
    curr.forEach((item) => {
      this.swap(item, this.getNeighbor(item, direction));
    });
    return true;
  }

  findSurroundingBoxes(
    curr: { row: number; col: number }[],
    direction: string
  ): any[] {
    let arr: any[] = [];
    curr.forEach((item) => {
      if (this.faceBoxes(item, direction)) {
        const firstHalfBox = this.getNeighbor(item, direction);
        const secondHalfBox = this.findOtherHalfBox(firstHalfBox);
        !this.isIncluded(curr, firstHalfBox) &&
          !this.isIncluded(arr, firstHalfBox) &&
          arr.push(firstHalfBox);
        !this.isIncluded(curr, secondHalfBox) &&
          !this.isIncluded(arr, secondHalfBox) &&
          arr.push(secondHalfBox);
        arr = this.sortByDirection(arr, direction);
      }
    });
    return arr;
  }

  sortByDirection(arr: any[], direction: string): any[] {
    switch (direction) {
      case LEFT:
        return arr.slice().sort((a, b) => a.col - b.col);
      case RIGHT:
        return arr.slice().sort((a, b) => b.col - a.col);
      case UP:
        return arr.slice().sort((a, b) => a.row - b.row);
      case DOWN:
        return arr.slice().sort((a, b) => b.row - a.row);
    }
    return arr;
  }

  isIncluded(arr: any[], target: { row: number; col: number } | null): boolean {
    return target
      ? arr.some((item) => item.row === target.row && item.col === target.col)
      : false;
  }

  findOtherHalfBox(halfBox: {
    row: number;
    col: number;
  }): { row: number; col: number } | null {
    if (this.map) {
      if (this.map[halfBox.row][halfBox.col] === LEFT_BOX) {
        return { row: halfBox.row, col: halfBox.col + 1 };
      }
      return { row: halfBox.row, col: halfBox.col - 1 };
    }
    return null;
  }

  faceWall(curr: { row: number; col: number }, direction: string): boolean {
    return this.checkNeighbor(curr, direction, WALL);
  }

  faceBoxes(curr: { row: number; col: number }, direction: string): boolean {
    return (
      this.checkNeighbor(curr, direction, LEFT_BOX) ||
      this.checkNeighbor(curr, direction, RIGHT_BOX)
    );
  }

  checkNeighbor(
    curr: { row: number; col: number },
    direction: string,
    type: string
  ): boolean {
    if (this.map) {
      const { row, col } = this.getNeighbor(curr, direction);
      return this.map[row][col] === type;
    }
    return false;
  }

  getNeighbor(
    curr: { row: number; col: number },
    direction: string
  ): { row: number; col: number } {
    switch (direction) {
      case LEFT:
        return { row: curr.row, col: curr.col - 1 };
      case RIGHT:
        return { row: curr.row, col: curr.col + 1 };
      case UP:
        return { row: curr.row - 1, col: curr.col };
      case DOWN:
        return { row: curr.row + 1, col: curr.col };
    }
    return curr;
  }

  swap(loc1: { row: number; col: number }, loc2: { row: number; col: number }) {
    if (this.map) {
      const temp = this.map[loc1.row][loc1.col];
      this.map[loc1.row][loc1.col] = this.map[loc2.row][loc2.col];
      this.map[loc2.row][loc2.col] = temp;
    }
  }

  isAvail(str: string) {
    return str === PATH;
  }

  parseInput(input: any[]): { data: any[]; directions: any[] } {
    let count = 0;

    while (input[count].trim()) {
      count++;
    }
    return { data: input.slice(0, count), directions: input.slice(count + 1) };
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
