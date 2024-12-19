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
  input = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;
  result = signal('');

  onSubmit() {
    const rows = this.parseRow(this.input);
    let total = 0;
    for (let row = 0; row < rows.length; row++) {
      const [result, nums] = rows[row].split(': ');
      const numbers = nums
        .trim()
        .split(/\s*[\s,]\s*/)
        .map((item: string) => +item);
      if (this.calculate(numbers, +result)) {
        total += +result;
      }
    }

    this.result.set(`${total}`);
  }

  calculate(arr: number[], result: number): boolean {
    if (arr.length === 2) {
      if (result === this.add(arr[0], arr[1])) return true;
      if (result === this.mul(arr[0], arr[1])) return true;
      return false;
    }
    if (this.calculate(arr.slice(0, -1), result - arr.slice(-1)[0]))
      return true;
    if (this.calculate(arr.slice(0, -1), result / arr.slice(-1)[0]))
      return true;
    return false;
  }

  add(num1: number, num2: number): number {
    return num1 + num2;
  }

  mul(num1: number, num2: number): number {
    return num1 * num2;
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
