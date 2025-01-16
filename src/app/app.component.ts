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
  input = `x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02`;

  result = signal('');

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      const input = this.parseRow(this.input);
      const total = this.start(input);
      this.result.set(`${total}`);
    }, 0);
  }

  start(lines: string[]): number {
    const { wireMap, gateWireList } = this.parseInput(lines);
    let pendingList: any[] = [];

    gateWireList.forEach((item) => {
      const input1 = wireMap.get(item.input1);
      const input2 = wireMap.get(item.input2);
      if ([input1, input2].every((val) => val !== undefined)) {
        wireMap.set(item.output, this.connectWires(input1!, input2!, item.opr));
      } else {
        pendingList.push(item);
      }
    });

    while (pendingList.length) {
      const item = pendingList[0];
      const input1 = wireMap.get(item.input1);
      const input2 = wireMap.get(item.input2);
      if ([input1, input2].every((val) => val !== undefined)) {
        wireMap.set(item.output, this.connectWires(input1!, input2!, item.opr));
        pendingList.shift();
      } else {
        const item = pendingList.shift();
        pendingList.push(item);
      }
    }
    return this.getOutput(wireMap);
  }

  getOutput(wireMap: Map<string, number>): number {
    const arr = Array.from(wireMap.entries()).filter(([key]) =>
      key.startsWith('z')
    );
    arr.sort().reverse();
    return parseInt(
      arr.reduce((str, [_, val]) => `${str}${val}`, ''),
      2
    );
  }

  connectWires(input1: number, input2: number, oper: string): number {
    switch (oper) {
      case 'AND':
        return Number(input1 & input2);
      case 'XOR':
        return Number(input1 ^ input2);
      case 'OR':
        return Number(input1 || input2);
    }
    return -1;
  }

  parseInput(lines: string[]): {
    wireMap: Map<string, number>;
    gateWireList: any[];
  } {
    let count = 0;
    const wireMap = new Map<string, number>();
    while (lines[count].trim()) {
      const [wire, val] = lines[count].split(':');
      wireMap.set(wire.trim(), Number(val));
      count++;
    }

    const gateWireList: any[] = [];
    lines.slice(++count).forEach((line) => {
      const [input, output] = line.split('->');
      const [input1, opr, input2] = input.split(/\s*[\s,]\s*/);
      gateWireList.push({
        input1: input1.trim(),
        opr: opr.trim(),
        input2: input2.trim(),
        output: output.trim(),
      });
    });

    return { wireMap, gateWireList };
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
