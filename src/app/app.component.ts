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

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      const input = this.parseInput(this.parseRow(this.input));
      const total = this.start(input);
      this.result.set(`${total}`);
    }, 0);
  }

  start(input: { patterns: string[]; desgins: string[] }): number {
    let count = 0;
    input.desgins.forEach((design) => {
      this.checkPattern(input.patterns, design) && count++;
    });
    return count;
  }

  checkPattern(patterns: string[], design: string): boolean {
    if (!design.trim()) return true;

    const matchedPatterns = patterns.filter((pattern) =>
      design.startsWith(pattern)
    );
    if (!matchedPatterns.length) {
      return false;
    }

    for (let i = 0; i < matchedPatterns.length; i++) {
      const subStr = design.substring(matchedPatterns[i].length);
      if (this.checkPattern(patterns, subStr)) {
        return true;
      }
    }

    return false;
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
