import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

const UP = '^';
const DOWN = 'v';
const LEFT = '<';
const RIGHT = '>';
const OBSTACLE = '#';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;
  result = '';
  steps = new Set();

  onSubmit() {
    const map = this.parseRow(this.input).map((item) => item.split(''));
    let currPos = this.findStartingPos(map);
    if (currPos) {
      this.steps.clear();
      this.addToSteps(currPos);
      while (!this.isOutOfMap(map, currPos)) {
        if (this.hasObstacle(map, currPos)) {
          currPos = { ...currPos, dir: this.changeDir(currPos.dir) };
        } else {
          currPos = { ...this.move(currPos) };
          this.addToSteps(currPos)
        }
      }
    }
    this.result = `${this.steps.size}`;
  }

  move(currPos: { dir: string; row: number; col: number }): {
    dir: string;
    row: number;
    col: number;
  } {
    switch (currPos.dir) {
      case UP:
        return { ...currPos, row: currPos.row - 1 };
      case RIGHT:
        return { ...currPos, col: currPos.col + 1 };
      case DOWN:
        return { ...currPos, row: currPos.row + 1 };
      case LEFT:
        return { ...currPos, col: currPos.col - 1 };
      default:
        return currPos;
    }
  }

  changeDir(currDir: string): string {
    switch (currDir) {
      case UP:
        return RIGHT;
      case RIGHT:
        return DOWN;
      case DOWN:
        return LEFT;
      case LEFT:
        return UP;
      default:
        return currDir;
    }
  }

  hasObstacle(
    map: any[][],
    currPos: { dir: string; row: number; col: number }
  ): boolean {
    switch (currPos.dir) {
      case UP:
        return map[currPos.row - 1][currPos.col] === OBSTACLE;
      case DOWN:
        return map[currPos.row + 1][currPos.col] === OBSTACLE;
      case LEFT:
        return map[currPos.row][currPos.col - 1] === OBSTACLE;
      case RIGHT:
        return map[currPos.row][currPos.col + 1] === OBSTACLE;
      default:
        return false;
    }
  }

  isOutOfMap(
    map: any[][],
    currPos: { dir: string; row: number; col: number }
  ): boolean {
    const { width, height } = this.mapSize(map);

    switch (currPos.dir) {
      case UP:
        return currPos.row - 1 < 0;
      case DOWN:
        return currPos.row + 1 === height;
      case LEFT:
        return currPos.col - 1 < 0;
      case RIGHT:
        return currPos.col + 1 === width;
      default:
        return false;
    }
  }

  mapSize(map: any[][]) {
    return {
      width: map[0].length,
      height: map.length,
    };
  }

  addToSteps(currPos: { row: number; col: number }) {
    this.steps.add(`${currPos.row}-${currPos.col}`);
  }

  findStartingPos(
    map: any[][]
  ): { dir: string; row: number; col: number } | null {
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        if ([UP, DOWN, LEFT, RIGHT].includes(map[row][col])) {
          return { dir: map[row][col], row, col };
        }
      }
    }
    return null;
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
