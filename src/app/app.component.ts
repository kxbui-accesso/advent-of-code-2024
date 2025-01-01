import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const UP = '^';
const DOWN = 'v';
const LEFT = '<';
const RIGHT = '>';
const BOT = '@';
const BOX = 'O';
const WALL = '#';
const PATH = '.';

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
      this.map = data.map((row) => row.split(''));
      const total = this.start(directions);
      this.result.set(`${total}`);
    }, 0);
  }

  start(directions: any[]): number {
    let curr = this.findBot();
    if (curr) {
      directions.forEach((line) => {
        line.split('').forEach((direction: string) => {
          curr = this.move(curr!, direction);
          const s = this.map;
        });
      });
    }
    return this.calcGPSCoordinate();
  }

  calcGPSCoordinate(): number {
    let total = 0;
    if (this.map) {
      for (let row = 0; row < this.map.length; row++) {
        for (let col = 0; col < this.map[row].length; col++) {
          if (this.map[row][col] === BOX) {
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

  move(
    curr: { row: number; col: number },
    direction: string
  ): { row: number; col: number } {
    const availLoc = this.findAvailPath(curr, direction);
    if (availLoc) {
      // neighbor is available
      if (this.checkNeighbor(curr, direction, PATH)) {
        this.swap(curr, availLoc);
        return availLoc;
      }
      // neighbor is a box
      else if (this.checkNeighbor(curr, direction, BOX)) {
        const neighbor = this.getNeighbor(curr, direction);
        this.swap(neighbor, availLoc);
        this.swap(curr, neighbor);
        return neighbor;
      }
    }
    return curr;
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

  findAvailPath(
    curr: { row: number; col: number },
    direction: string
  ): { row: number; col: number } | null {
    switch (direction) {
      case LEFT:
        return this.findAvailPathHorizontal(curr.row, curr.col - 1, false);
      case RIGHT:
        return this.findAvailPathHorizontal(curr.row, curr.col + 1, true);
      case UP:
        return this.findAvailPathVertical(curr.col, curr.row - 1, false);
      case DOWN:
        return this.findAvailPathVertical(curr.col, curr.row + 1, true);
    }

    return null;
  }

  findAvailPathHorizontal(
    row: number,
    starCol: number,
    rightWard = false
  ): { row: number; col: number } | null {
    if (this.map) {
      for (
        let i = starCol;
        rightWard ? i < this.map[0].length : i >= 0;
        rightWard ? i++ : i--
      ) {
        if (this.isWall(this.map[row][i])) {
          return null;
        }
        if (this.isAvail(this.map[row][i])) {
          return { row, col: i };
        }
      }
    }

    return null;
  }

  findAvailPathVertical(
    col: number,
    starRow: number,
    downWard = false
  ): { row: number; col: number } | null {
    if (this.map) {
      for (
        let i = starRow;
        downWard ? i < this.map.length : i >= 0;
        downWard ? i++ : i--
      ) {
        if (this.isWall(this.map[i][col])) {
          return null;
        }
        if (this.isAvail(this.map[i][col])) {
          return { row: i, col };
        }
      }
    }
    return null;
  }

  swap(loc1: { row: number; col: number }, loc2: { row: number; col: number }) {
    if (this.map) {
      const temp = this.map[loc1.row][loc1.col];
      this.map[loc1.row][loc1.col] = this.map[loc2.row][loc2.col];
      this.map[loc2.row][loc2.col] = temp;
    }
  }

  isWall(str: string) {
    return str === WALL;
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
