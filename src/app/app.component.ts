import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

const X = 'X';
const M = 'M';
const A = 'A';
const S = 'S';

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
        if (data[row][col] === A) {
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
    if (this.checkLeftLength(col) && this.checkRightLength(width, col) && this.checkTopLength(row) && this.checkBottomLength(height, row)) {
      count = this.checkForward(data, row, col) ? count + 1 : count;
      count = this.checkBackward(data, row, col) ? count + 1 : count;
      count = this.checkCW(data, row, col) ? count + 1 : count;
      count = this.checkCCW(data, row, col) ? count + 1 : count;
    }
    return count;
  }

  checkForward(data: any[][], row: number, col: number) {
    const matched =
      data[row - 1][col - 1] === M &&
      data[row + 1][col - 1] === S &&
      data[row - 1][col + 1] === M &&
      data[row + 1][col + 1] === S
    return matched;
  }

  checkBackward(data: any[][], row: number, col: number) {
    const matched =
      data[row - 1][col - 1] === S &&
      data[row + 1][col - 1] === M &&
      data[row - 1][col + 1] === S &&
      data[row + 1][col + 1] === M
    return matched;
  }

  checkCW(data: any[][], row: number, col: number) {
    const matched =
      data[row - 1][col - 1] === S &&
      data[row + 1][col - 1] === S &&
      data[row - 1][col + 1] === M &&
      data[row + 1][col + 1] === M
    return matched;
  }

  checkCCW(data: any[][], row: number, col: number) {
    const matched =
      data[row - 1][col - 1] === M &&
      data[row + 1][col - 1] === M &&
      data[row - 1][col + 1] === S &&
      data[row + 1][col + 1] === S
    return matched;
  }

  checkLeftLength(i: number) {
    return i >= 1;
  }

  checkRightLength(width: number, i: number) {
    return i + 1 < width;
  }

  checkTopLength(i: number) {
    return i >= 1;
  }

  checkBottomLength(height: number, i: number) {
    return i + 1 < height;
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
