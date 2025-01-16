import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * CLIQUE problem (NP Complete)
 * Bron-Kerbosch Algorithm
 */
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

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      const input = this.parseRow(this.input);
      const total = this.start(input);
      this.result.set(`${total}`);
    }, 0);
  }

  start(lines: string[]): string {
    const connections = this.buildConnectionMap(lines);
    const P = this.getAllVertices(lines);
    const result = new Set<string>();

    this.findCliques(new Set(), P, new Set(), connections, result);

    return this.findMaxClique(result);
  }

  findMaxClique(set: Set<string>): string {

    const arr = Array.from([...set]);
    let maxLength = -Infinity;
    let str = '';

    arr.forEach(item => {
      const length = item.split(',').length;
      if (maxLength < length) {
        maxLength = length;
        str = item;
      }
    })

    return str;
  }

  findCliques(
    R: Set<string>,
    P: Set<string>,
    X: Set<string>,
    connections: Map<string, Set<string>>,
    result: Set<string>
  ): void {
    if (!P.size && !X.size) {
      const arr = Array.from(R.values());
      arr.sort()
      result.add(arr.join(','));
      return;
    }

    const arr = Array.from(P.values());
    arr.forEach((v) => {
      const neighbors = connections.get(v)!;

      this.findCliques(
        new Set([...R]).add(v),
        this.findIntersection(P, neighbors),
        this.findIntersection(X, neighbors),
        connections,
        result
      );

      P.delete(v);
      X.add(v);
    });
  }

  buildConnectionMap(lines: string[]): Map<string, Set<string>> {
    let map = new Map<string, Set<string>>();

    lines.forEach((line) => {
      const [a, b] = line.split('-');
      map = this.addToMap(map, a, b);
      map = this.addToMap(map, b, a);
    });

    return map;
  }

  getAllVertices(lines: string[]): Set<string> {
    const set = new Set<string>();

    lines.forEach((line) => {
      const [a, b] = line.split('-');
      set.add(a).add(b);
    });

    return set;
  }

  addToMap(
    map: Map<string, Set<string>>,
    key: string,
    value: string
  ): Map<string, Set<string>> {
    map.has(key)
      ? map.set(key, new Set([...map.get(key)!, value]))
      : map.set(key, new Set([value]));
    return map;
  }

  startWith(network: string, letter: string): boolean {
    const arr = network.split('-');
    return arr.some((item) => item.startsWith(letter));
  }

  findIntersection(set1: Set<string>, set2: Set<string>): Set<string> {
    return new Set([...set1].filter((i) => set2.has(i)));
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
