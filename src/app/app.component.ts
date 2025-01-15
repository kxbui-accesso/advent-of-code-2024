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
10
100
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

  start(lines: bigint[]): bigint {
    let total = BigInt(0);
    lines.forEach((line) => {
      const s = this.generateSecretNumber(line);
      total += s;
    });
    return total;
  }

  generateSecretNumber(secretNum: bigint) {
    let count = 0;
    let result = secretNum;
    while (count < SECRET_NUM_COUNT) {
      result = this.findNextSecretNumber(result);
      count++;
    }
    return result;
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
