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
  input = `2333133121414131402`;
  result = signal('');

  onSubmit() {
    const data = this.input;
    let total = 0;

    const block = this.moveBlocks(this.buildBlock(data));
    total = this.calcCheckSum(block);

    this.result.set(`${total}`);
  }

  calcCheckSum(data: string[]): number {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== EMPTY) total += +data[i] * i;
    }
    return total;
  }

  moveBlocks(data: string[]): string[] {
    const blocks = [];
    let currIdx = 0,
      lastIdx = data.length - 1;
    while (currIdx < lastIdx) {
      if (data[currIdx] !== EMPTY) {
        blocks.push(data[currIdx]);
      } else {
        const block = this.findLastBlock(data, currIdx + 1, lastIdx);
        if (block) {
          blocks.push(block.value);
          data[block.idx] = EMPTY;
          lastIdx = block.idx;
        }
      }
      currIdx++;
    }
    // console.log(blocks.join(''));
    return blocks;
  }

  findLastBlock(
    data: string[],
    startIdx: number,
    stopIdx: number
  ): { idx: number; value: string } | null {
    for (let i = stopIdx; i > startIdx; i--) {
      if (data[i] !== EMPTY) {
        return { idx: i, value: data[i] };
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
