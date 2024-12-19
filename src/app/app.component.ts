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
  input = `3   4
4   3
2   5
1   3
3   9
3   3`;
  result = '';

  onSubmit() {
    const { arr1, arr2 } = this.parseColumn(this.input);
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    this.result = sortedArr1.reduce((total, curr, i) => {
      return (total += Math.abs(curr - sortedArr2[i]));
    }, 0);
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
