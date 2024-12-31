import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const BTN_A_COST = 3;
const BTN_B_COST = 1;

/**
 * System of two equations with two variables:
 * a1x + b1y = c1
 * a2x + b2y = c2
 *
 * Use Cramer's rule
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

  result = signal('');

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      const input = this.parseInput(this.input);
      const total = this.start(input);
      this.result.set(`${total}`);
    }, 0);
  }

  start(data: any[]): number {
    let total = 0;

    data.forEach((item) => {
      const result = this.calculateCramersRule(item);
      total += result ? this.getCost(result) : 0;
    });

    return total;
  }

  getCost(params: { x: number; y: number }): number {
    return params.x * BTN_A_COST + params.y * BTN_B_COST;
  }

  calculateCramersRule(params: {
    a1: number;
    b1: number;
    a2: number;
    b2: number;
    c1: number;
    c2: number;
  }): { x: number; y: number } | null {
    const { a1, b1, a2, b2, c1, c2 } = params;
    const determinant = a1 * b2 - a2 * b1;
    if (determinant != 0) {
      const x = (c1 * b2 - a2 * c2) / determinant;
      const y = (a1 * c2 - b1 * c1) / determinant;
      return Number.isInteger(x) && Number.isInteger(y) ? { x, y } : null;
    } else {
      // Cramer equations system: determinant is zero
      // there are either no solutions or many solutions exist
      return null;
    }
  }

  parseInput(str: string): any[] {
    const arr: any[] = [];
    const lines = this.parseRow(str);

    let count = 0;
    while (count < lines.length) {
      let item = {};

      // parse btn A
      const [_A, nums_A] = lines[count].split(':');
      const [a1, b1] = nums_A.split(',');
      item = { ...item, a1: this.extractNum(a1), b1: this.extractNum(b1) };
      count++;

      // parse btn B
      const [_B, nums_B] = lines[count].split(':');
      const [a2, b2] = nums_B.split(',');
      item = { ...item, a2: this.extractNum(a2), b2: this.extractNum(b2) };
      count++;

      // parse prize
      const [_P, nums_P] = lines[count].split(':');
      const [c1, c2] = nums_P.split(',');
      item = { ...item, c1: this.extractNum(c1), c2: this.extractNum(c2) };

      arr.push(item);
      count += 2;
    }
    return arr;
  }

  extractNum(str: string): number {
    return +str.replace(/^\D+/g, '');
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
