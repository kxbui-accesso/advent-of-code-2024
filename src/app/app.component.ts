import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const SECRET_NUM_COUNT = 2000;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `1
2
3
2024`;

  result = signal('');

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      const input = this.parseRow(this.input).map((line) => BigInt(line));
      const total = this.start(input);
      this.result.set(`${total}`);
    }, 0);
  }

  start(lines: bigint[]): number {
    const arr: any[] = [];

    const { dataTable, seqChanges } = this.generateDataTable(lines);
    Array.from(seqChanges.keys()).forEach((seq) => {
      let total = 0;
      Array.from(dataTable.values()).forEach((item, i) => {
        if (item.seqChanges.has(seq)) {
          total += item.seqChanges.get(seq);
        }
      });
      arr.push({ seq, total });
    });

    return this.findMax(arr);
  }

  findMax(arr: any[]): number {
    let max = -Infinity;

    arr.forEach((item) => {
      if (max < item.total) max = item.total;
    });

    return max;
  }

  generateDataTable(lines: bigint[]) {
    let count = 0;
    let dataTable = new Map<number, any>();
    let seqChanges = new Set();

    while (count < SECRET_NUM_COUNT + 1) {
      for (let i = 0; i < lines.length; i++) {
        if (count === 0) {
          const data = this.initDataTableValue(lines[i]);
          dataTable.set(i, data);
        } else {
          let data = dataTable.get(i);
          if (data) {
            const prevPrice = data.curr;
            data.curr = this.findNextSecretNumber(data.curr);
            data.priceChanges.push(
              this.getPriceChangeValue(data.curr, prevPrice)
            );
            if (count >= 4) {
              const { key, value } = this.getSeqChangeValue(
                data.seqChanges,
                data.priceChanges.slice(count - 3),
                data.curr
              );
              data.seqChanges.set(key, value);
              seqChanges.add(key);
            }
            dataTable.set(i, data);
          }
        }
      }
      count++;
    }

    return { seqChanges, dataTable };
  }

  getSeqChangeValue(
    map: Map<string, number>,
    arr: any[],
    curr: bigint
  ): { key: string; value: number } {
    const key = arr.map((item) => item.change).join(',');
    const newPrice = this.getLastDigit(curr);
    const currPrice = map.get(key);

    return {
      key,
      value: currPrice === undefined   // only keep first time it appears
        ? newPrice
        : currPrice,
    };
  }

  hasPriceChanges(arr: any[]): boolean {
    return arr.every((item) => item.change !== null);
  }

  getPriceChangeValue(curr: bigint, prev: bigint | null) {
    const price = this.getLastDigit(curr);
    return {
      price,
      change: prev !== null ? price - this.getLastDigit(prev) : null,
    };
  }

  initDataTableValue(num: bigint) {
    return {
      curr: num,
      priceChanges: [this.getPriceChangeValue(num, null)],
      seqChanges: new Map(),
    };
  }

  findNextSecretNumber(orgSecretNum: bigint): bigint {
    let secretNum = BigInt(orgSecretNum);
    let count = 0;

    while (count < 3) {
      let result = secretNum;
      switch (count) {
        case 0:
          result = BigInt(secretNum * BigInt(64));
          break;
        case 1:
          result = secretNum / BigInt(32);
          break;
        case 2:
          result = secretNum * BigInt(2048);
          break;
      }
      secretNum = this.mix(secretNum, result);
      secretNum = this.prune(secretNum);
      count++;
    }
    return secretNum;
  }

  mix(secretNum: bigint, mixValue: bigint): bigint {
    return BigInt(secretNum) ^ BigInt(mixValue);
  }

  prune(secretNum: bigint): bigint {
    return secretNum % BigInt(16777216);
  }

  getLastDigit(num: bigint): number {
    return Number(num % BigInt(10));
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
