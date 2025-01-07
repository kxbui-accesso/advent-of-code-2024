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
  input = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

  result = signal('');
  patternMap = new Map<string, number>();

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      this.patternMap.clear();
      const input = this.parseInput(this.parseRow(this.input));
      const total = this.start(input);
      this.result.set(`${total}`);
    }, 0);
  }

  start(input: { patterns: string[]; desgins: string[] }): bigint {
    let count = BigInt(0);
    input.desgins.forEach((design) => {
      count += BigInt(this.countPattern(input.patterns, design, 0, 0));
    });
    return count;
  }

  countPattern(patterns: string[], design: string, total: number, startingIdx: number): number {
    const designSubStr = design.substring(startingIdx);
    if (!designSubStr.trim()) return 1;

    if (this.patternMap.has(designSubStr)) {
      return this.patternMap.get(designSubStr)!;
    }

    const matchedPatterns = patterns.filter(pattern => designSubStr.startsWith(pattern));

    if (!matchedPatterns.length) {
      return 0;
    }

    let count = total;
    for (let i = 0; i < matchedPatterns.length; i++) {
      const matchedPattern = matchedPatterns[i];
      const idx = startingIdx + matchedPattern.length;

      const result = this.countPattern(patterns, design, total, idx);
      count += result;
    }

    if (!this.patternMap.has(designSubStr)) {
      this.patternMap.set(designSubStr, count);
    }

    return count;
  }

  exactlyMatch(str: string, compareTo: string): boolean {
    return str === compareTo;
  }

  parseInput(input: string[]) {
    return {
      patterns: input[0].split(',').map((item) => item.trim()),
      desgins: input.slice(2),
    };
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
