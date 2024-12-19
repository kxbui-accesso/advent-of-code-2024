import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;
  result = '';
  ruleMap!: Map<any, any[]>;

  onSubmit() {
    const data = this.parseRow(this.input);
    const splitPt = data.findIndex((item) => !item.trim());
    this.ruleMap = this.storeRules(data.slice(0, splitPt));
    const updates = data.slice(splitPt + 1).map((item) => item.split(','));
    let total = 0;
    for (let row = 0; row < updates.length; row++) {
      const passed = this.testRow(updates[row]);
      if (!passed) {
        const sortedArr = this.sort(updates[row]);
        total += +this.getMiddle(sortedArr);
      }
    }

    this.result = `${total}`;
  }

  swapElements(arr: any[], x: number, y: number) {
    const b = arr[y];
    arr[y] = arr[x];
    arr[x] = b;
    return arr;
  }

  isGreater(num1: number, num2: any): boolean {
    const rules = this.ruleMap.get(num2);
    return !!rules?.includes(num1);
  }

  testRow(updates: any[]): boolean {
    for (let col = 0; col < updates.length; col++) {
      for (let i = col + 1; i < updates.length; i++) {
        if (this.isGreater(updates[col], updates[i])) {
          return false;
        }
      }
    }
    return true;
  }

  sort(arr: any[]): any[] {
    let updates = [...arr];
    for (let col = 0; col < updates.length; col++) {
      for (let i = col + 1; i < updates.length; i++) {
        if (this.isGreater(updates[col], updates[i])) {
          updates = this.swapElements(updates, col, i);
        }
      }
    }
    return updates;
  }

  getMiddle(arr: any[]) {
    return arr[(arr.length / 2) | 0];
  }

  storeRules(arr: any[]): Map<any, any[]> {
    const map = new Map();
    arr.forEach((item) => {
      const [num1, num2] = item.split('|');
      const values = map.get(num1);
      values?.length ? map.set(num1, [...values, num2]) : map.set(num1, [num2]);
    });
    return map;
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
