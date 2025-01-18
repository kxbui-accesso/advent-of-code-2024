import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`;

  result = signal('');

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      const input = this.parseInput(this.parseRow(this.input));
      const total = this.start(input);
      this.result.set(`${total}`);
    }, 0);
  }

  start(input: string[][][]): number {
    return this.testKeysLocks(input);
  }

  testKeysLocks(input: string[][][]): number {
    const keys: any[][][] = [],
      locks: any[][][] = [];

    input.forEach((arr: string[][]) => {
      if (arr[0][0] === '#') {
        locks.push(this.parseLock(arr));
      } else {
        keys.push(this.parseKey(arr));
      }
    });

    let count = 0;
    const height = input[0].length - 2;
    locks.forEach((lock: any[]) => {
      keys.forEach((key: any[]) => {
        this.testKeyLock(lock, key, height) && count++;
      });
    });

    return count;
  }

  testKeyLock(lock: number[], key: number[], height: number): boolean {
    for (let i = 0; i < lock.length; i++) {
      if (lock[i] + key[i] > height) return false;
    }
    return true;
  }

  parseKey(arr: string[][]): any[] {
    const result = [];
    for (let c = 0; c < arr[0].length; c++) {
      let count = 0;
      for (let r = 1; r < arr.length - 1; r++) {
        if (arr[r][c] === '#') {
          count++;
        }
      }
      result.push(count);
    }

    return result;
  }

  parseLock(arr: string[][]): any[] {
    const result = [];
    for (let c = 0; c < arr[0].length; c++) {
      let count = 0;
      for (let r = 1; r < arr.length - 1; r++) {
        if (arr[r][c] === '#') {
          count++;
        }
      }
      result.push(count);
    }

    return result;
  }

  parseInput(lines: string[]): any[][][] {
    let count = 0;

    const arr: any[][] = [];
    const temp: any[] = [];
    while (count < lines.length) {
      if (!lines[count].trim()) {
        arr.push([...temp]);
        temp.length = 0;
      } else if (count === lines.length - 1) {
        arr.push([...temp, lines[count].split('')]);
      } else {
        temp.push(lines[count].split(''));
      }
      count++;
    }
    return arr;
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
