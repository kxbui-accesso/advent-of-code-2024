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
  input = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`;

  result = signal('');
  connections = new Set<string>();
  network = new Set<string>();

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      const input = this.parseRow(this.input);
      const total = this.start(input);
      this.result.set(`${total}`);
    }, 0);
  }

  start(lines: string[]): number {
    this.connections.clear();
    this.network.clear();

    lines.forEach((line) => {
      const items = line.split('-');
      items.sort();
      this.connections.add(items.join('-'));
    });

    lines.forEach((line) => {
      const result = this.findConnections(lines, line, 0);
      if (result && result.length) {
        result.forEach((item) => this.network.add(item));
      }
    });
    return this.network.size;
  }

  startWith(network: string, letter: string): boolean {
    const arr = network.split('-');
    return arr.some((item) => item.startsWith(letter));
  }

  findConnections(
    lines: string[],
    link: string,
    iter: number
  ): string[] | null {
    const indices = lines
      .map((item, i) =>
        this.containsComputers(link, item, iter === 1) ? i : -1
      )
      .filter((idx) => idx !== -1);
    if (indices.length) {
      const arr: any[] = [];
      for (let i = 0; i < indices.length; i++) {
        const l = lines[indices[i]];

        if (iter === 1) {
          return [l];
        }
        const diff = this.findDifference(link, lines[indices[i]]);
        if (this.connections.has(diff)) {
          const r = Array.from(
            new Set([...link.split('-'), ...diff.split('-')])
          );
          r.sort();
          arr.push(r.join('-'));
        }
      }
      return arr;
    }
    return null;
  }

  findDifference(str1: string, str2: string): string {
    const arr1 = str1.split('-');
    const arr2 = str2.split('-');
    return arr1
      .filter((x) => !arr2.includes(x))
      .concat(arr2.filter((x) => !arr1.includes(x)))
      .join('-');
  }

  containsComputers(
    computerList: string,
    computers: string,
    exact = false
  ): boolean {
    if (computerList === computers) {
      return false;
    }
    const set1 = new Set(computerList.split('-'));
    const arr = computers.split('-');
    const a = Array.from(new Set([...set1, ...arr]));
    a.sort();

    if (!this.startWith(a.join('-'), 't')) {
      return false;
    }

    if (this.network.has(a.join('-'))) {
      return false;
    }

    return exact
      ? arr.every((element) => set1.has(element))
      : arr.some((element) => set1.has(element));
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
