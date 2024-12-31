import { NgFor, NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// const MAP_WIDTH = 101;
// const MAP_HEIGHT = 103;
const MAP_WIDTH = 11;
const MAP_HEIGHT = 7;

/**
 * Bots need to cluster together to form a tree.
 * Use the safety factor from part 1 --
 * since more falling outside any quadrant like on the center
 * column will produce abnormally low safety factors.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;

  result = signal('');
  count = signal(0);
  array = signal<any[][]>([]);
  safetyFactor = 0;
  curr: any[] | null = null;

  onSubmit() {
    setTimeout(() => {
      this.count.set(0);
      this.array.set([]);
      const robots = this.parseInput(this.parseRow(this.input));
      const total = this.start(robots);
    }, 0);
  }

  start(data: any[]) {
    let curr = [...data];
    let currSafetyFactor = this.safetyFactor;
    let count = this.count();

    if (!this.safetyFactor) {
      this.safetyFactor = this.getTotalSafetyFactor(curr);
      currSafetyFactor = this.safetyFactor;
    }
    while (currSafetyFactor >= this.safetyFactor) {
      curr.forEach((item, i) => {
        const { x, y } = this.move(item);
        curr[i].px = x;
        curr[i].py = y;
      });
      currSafetyFactor = this.getTotalSafetyFactor(curr);
      count++;
    }
    this.curr = curr;
    this.safetyFactor = currSafetyFactor;
    this.count.set(count);
    this.array.set(this.constructRobotPosition());
  }

  continue() {
    if (this.curr) {
      this.start(this.curr);
    }
  }

  constructRobotPosition(): any[][] {
    const arr = Array.from({ length: MAP_HEIGHT }, () =>
      Array.from({ length: MAP_WIDTH }, () => ' ')
    );

    this.curr?.forEach((item) => (arr[item.py][item.px] = '*'));

    return arr;
  }

  getTotalSafetyFactor(arr: any[]): number {
    const map = new Map();
    const midX = Math.round((MAP_WIDTH - 1) / 2);
    const midY = Math.round((MAP_HEIGHT - 1) / 2);

    arr.forEach((item) => {
      if (item.px < midX && item.py < midY) {
        this.addToMap(map, 'Q1');
      } else if (item.px > midX && item.py < midY) {
        this.addToMap(map, 'Q2');
      } else if (item.px < midX && item.py > midY) {
        this.addToMap(map, 'Q3');
      } else if (item.px > midX && item.py > midY) {
        this.addToMap(map, 'Q4');
      }
    });
    return Array.from(map.values()).reduce((total, curr) => (total *= curr), 1);
  }

  addToMap(map: Map<string, number>, key: string) {
    map.has(key) ? map.set(key, 1 + map.get(key)!) : map.set(key, 1);
  }

  move(params: { px: number; py: number; vx: number; vy: number }): {
    x: number;
    y: number;
  } {
    let x = Number(params.px) + Number(params.vx);
    let y = Number(params.py) + Number(params.vy);

    if (x < 0) {
      x = MAP_WIDTH - Math.abs(x);
    }

    if (x >= MAP_WIDTH) {
      x = x - MAP_WIDTH;
    }

    if (y < 0) {
      y = MAP_HEIGHT - Math.abs(y);
    }

    if (y >= MAP_HEIGHT) {
      y = y - MAP_HEIGHT;
    }

    return { x, y };
  }

  parseInput(input: string[]): any[] {
    const arr: any[] = [];

    input.forEach((line) => {
      const position = this.parseValue(line, 'p=');
      const velocity = this.parseValue(line, 'v=');
      const [px, py] = position.split(',');
      const [vx, vy] = velocity.split(',');
      arr.push({ px, py, vx, vy });
    });
    return arr;
  }

  parseValue(str: string, label: string): string {
    const idx = str.lastIndexOf(label);
    return idx != -1
      ? str.substring(
          idx + label.length,
          this.findFirstEmptyIdx(str, idx + label.length)
        )
      : '';
  }

  findFirstEmptyIdx(str: string, start: number): number {
    let count = start;

    while (str.charAt(count).trim() && count < str.length) {
      const s = str.charAt(count);
      count++;
    }

    return count;
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
