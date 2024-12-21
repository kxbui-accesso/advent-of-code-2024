import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const BLINKING_TIMES = 75;
const MULTIPLIER = 2024;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // input = `0 1 10 99 999`;
  input = `125 17`;
  result = signal('');

  onSubmit() {
    const data = this.input
      .trim()
      .split(/\s*[\s,]\s*/)
      .map(Number);
    let total = 0;

    this.result.set(`...waiting`);

    setTimeout(() => {
      total = this.start(data);
      this.result.set(`${total}`);
    }, 0);
  }

  start(data: any[]): number {
    let arr = data;
    let map = new Map<number, number>();

    for (let j = 0; j < BLINKING_TIMES; j++) {
      const tempMap =  new Map<number, number>();
      for (let i = 0; i < arr.length; i++) {
        const result = this.transformNumber(arr[i]);
        const count = map.get(arr[i]) || 1;
        if (Array.isArray(result)) {
          result.forEach((element) => {
            this.addToMap(tempMap, element, count);
          })
        } else {
          this.addToMap(tempMap, result, count);
        }
      }
      arr = Array.from(tempMap.keys());
      map = new Map(tempMap);
    }

    return this.getMapTotal(map);
  }

  addToMap(map: Map<any, any>, key: any, value: any) {
    if (map.has(key)) {
      map.set(key, map.get(key) + value);
    } else {
      map.set(key, value);
    }
  }

  getMapTotal(map: Map<any, any>): number {
    return Array.from(map.values()).reduce((acc, val) => acc + val, 0);
  }

  transformNumber(number: number): number | number[] {
    if (number === 0) {
      return 1;
    }
    if (this.isEvenDigit(number)) {
      return this.splitNumber(number);
    }
    return number * MULTIPLIER;
  }

  splitNumber(number: number): number | number[] {
    const arr = `${number}`.split('');
    const half = Math.floor(arr.length / 2);
    const firstHalf = arr.slice(0, half).join('');
    const secondHalf = arr.slice(half).join('');
    return [+firstHalf, +secondHalf];
  }

  isEvenDigit(number: number): boolean {
    return `${number}`.length % 2 === 0;
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
