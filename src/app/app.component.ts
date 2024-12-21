import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const EMPTY = '.';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // input = `1010101010101010101010`;
  // input = `111111111111111111111`;
  // input = `10101010101010101010101`;
  // input = `2833133121414131402`;
  input = `2333133121414131402`;
  result = signal('');

  onSubmit() {
    const data = this.input;
    let total = 0;

    this.result.set(`...waiting`);

    setTimeout(() => {
      const block = this.moveBlocks(this.buildBlock(data));
      total = this.calcCheckSum(block);
  
      this.result.set(`${total}`);
    }, 0)
  }

  calcCheckSum(data: string[]): number {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== EMPTY) total += +data[i] * i;
    }
    return total;
  }

  moveBlocks(data: string[]): string[] {
    let currIdx = data.length - 1;
    while (currIdx >= 0) {
      if (data[currIdx] !== EMPTY) {
        const file = this.findLastFile(data, currIdx);
        if (file) {
          const freeSpaceIdx = this.findFreeSpaces(data, file.idx, file.count);
          if (freeSpaceIdx) {
            for (let i = freeSpaceIdx; i < freeSpaceIdx + file.count; i++) {
              data[i] = file.value;
            }

            for (let i = file.idx; i < file.idx + file.count; i++) {
              data[i] = EMPTY;
            }
          }
          currIdx = file.idx;
        }
      }
      currIdx--;
    }
    console.log(data.join(''));
    return data;
  }

  findFreeSpaces(data: string[], endIdx: number, length: number): number | null {
    let count = -1, i = 0;
    for (i; i < endIdx; i++) {
      if (count >= length) return i - count;
      if (data[i] !== EMPTY) count = 0;
      else count++;
    }
    return count >= length ? i - count: null;
  }

  findLastFile(
    data: string[],
    startIdx: number
  ): { idx: number; value: string; count: number } | null {
    let foundId = '';
    let count = 0;
    for (let i = startIdx; i >= 0; i--) {
      if (foundId && data[i] !== foundId) {
        return { idx: i + 1, value: foundId, count };
      }
      if (data[i] !== EMPTY) {
        foundId = data[i];
        count++;
      }
    }
    return null;
  }

  buildBlock(data: string): string[] {
    let result = [];
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      if (i % 2 === 0) {
        const ids = new String(`${count},`).repeat(+data[i]);
        ids && result.push(...ids.split(',').filter(Boolean));
        count++;
      } else {
        const empties = EMPTY.repeat(+data[i]);
        result.push(...empties.split(''));
      }
    }
    return result;
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
