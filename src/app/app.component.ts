import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

const X = 'X';
const M = 'M';
const A = 'A';
const S = 'S';
const WORD_COUNT = 4;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;
  result = '';

  onSubmit() {
    const data = this.parseRow(this.input).map((item) => item.split(''));
    let count = 0;
    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < data[row].length; col++) {
        if (data[row][col] === X) {
          count += this.checkWord(data, row, col);
        }
      }
    }
    this.result = `${count}`;
  }

  checkWord(data: any[][], row: number, col: number): number {
    let count = 0;
    const width = data[0].length;
    const height = data.length;
    if (this.checkLeftLength(col)) {
      count = this.checkLeftSide(data, row, col) ? count + 1 : count;
    }
    if (this.checkRightLength(width, col)) {
      count = this.checkRightSide(data, row, col) ? count + 1 : count;
    }
    if (this.checkTopLength(row)) {
      count = this.checkTop(data, row, col) ? count + 1 : count;
    }
    if (this.checkBottomLength(height, row)) {
      count = this.checkBottom(data, row, col) ? count + 1 : count;
    }
    if (this.checkTopLength(row) && this.checkLeftLength(col)) {
      count = this.checkTopLeft(data, row, col) ? count + 1 : count;
    }
    if (this.checkTopLength(row) && this.checkRightLength(width, col)) {
      count = this.checkTopRight(data, row, col) ? count + 1 : count;
    }
    if (this.checkBottomLength(height, row) && this.checkLeftLength(col)) {
      count = this.checkBottomLeft(data, row, col) ? count + 1 : count;
    }
    if (
      this.checkBottomLength(height, row) &&
      this.checkRightLength(width, col)
    ) {
      count = this.checkBottomRight(data, row, col) ? count + 1 : count;
    }
    return count;
  }

  checkBottomRight(data: any[][], row: number, col: number) {
    const matched =
      data[row + 1][col + 1] === M &&
      data[row + 2][col + 2] === A &&
      data[row + 3][col + 3] === S;
    matched &&
      console.log(
        `${row}-${col} ${row + 1}-${col + 1} ${row + 2}-${col + 2} ${row + 3}-${
          col + 3
        }`
      );
    return matched;
  }

  checkBottomLeft(data: any[][], row: number, col: number) {
    const matched =
      data[row + 1][col - 1] === M &&
      data[row + 2][col - 2] === A &&
      data[row + 3][col - 3] === S;

    matched &&
      console.log(
        `${row}-${col} ${row + 1}-${col - 1} ${row + 2}-${col - 2} ${row + 3}-${
          col - 3
        }`
      );
    return matched;
  }

  checkTopRight(data: any[][], row: number, col: number) {
    const matched =
      data[row - 1][col + 1] === M &&
      data[row - 2][col + 2] === A &&
      data[row - 3][col + 3] === S;

    matched &&
      console.log(
        `${row}-${col} ${row - 1}-${col + 1} ${row - 2}-${col + 2} ${row - 3}-${
          col + 3
        }`
      );
    return matched;
  }

  checkTopLeft(data: any[][], row: number, col: number) {
    const matched =
      data[row - 1][col - 1] === M &&
      data[row - 2][col - 2] === A &&
      data[row - 3][col - 3] === S;

    matched &&
      console.log(
        `${row}-${col} ${row - 1}-${col - 1} ${row - 2}-${col - 2} ${row - 3}-${
          col - 3
        }`
      );
    return matched;
  }

  checkBottom(data: any[][], row: number, col: number) {
    const matched =
      data[row + 1][col] === M &&
      data[row + 2][col] === A &&
      data[row + 3][col] === S;

    matched &&
      console.log(
        `${row}-${col} ${row + 1}-${col} ${row + 2}-${col} ${row + 3}-${col}`
      );
    return matched;
  }

  checkTop(data: any[][], row: number, col: number) {
    const matched =
      data[row - 1][col] === M &&
      data[row - 2][col] === A &&
      data[row - 3][col] === S;

    matched &&
      console.log(
        `${row}-${col} ${row - 1}-${col} ${row - 2}-${col} ${row - 3}-${
          col
        }`
      );
    return matched;
  }

  checkRightSide(data: any[][], row: number, col: number) {
    const matched =
      data[row][col + 1] === M &&
      data[row][col + 2] === A &&
      data[row][col + 3] === S;

    matched &&
      console.log(
        `${row}-${col} ${row}-${col + 1} ${row}-${col + 2} ${row}-${col + 3}`
      );
    return matched;
  }

  checkLeftSide(data: any[][], row: number, col: number) {
    const matched =
      data[row][col - 1] === M &&
      data[row][col - 2] === A &&
      data[row][col - 3] === S;

    matched &&
      console.log(
        `${row}-${col} ${row}-${col - 1} ${row}-${col - 2} ${row}-${col - 3}`
      );
    return matched;
  }

  checkLeftLength(i: number) {
    return i >= WORD_COUNT - 1;
  }

  checkRightLength(width: number, i: number) {
    return width - i >= WORD_COUNT;
  }

  checkTopLength(i: number) {
    return i >= WORD_COUNT - 1;
  }

  checkBottomLength(height: number, i: number) {
    return height - i >= WORD_COUNT;
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
