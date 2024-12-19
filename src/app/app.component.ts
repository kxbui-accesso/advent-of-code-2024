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
  input = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;
  result = '';

  onSubmit() {
    const arr = this.parseRow(this.input);
    let safeRows = 0;
    for (let y = 0; y < arr.length; y++) {
      const arr1 = arr[y]
        .trim()
        .split(/\s*[\s,]\s*/)
        .map((item: any) => +item);
      let increasing = false;
      let decreasing = false;
      let dist = [];
      for (let i = 1; i < arr1.length; i++) {
        if (arr1[i] > arr1[i - 1]) increasing = true;
        else if (arr1[i] < arr1[i - 1]) decreasing = true;
        dist.push(Math.abs(arr1[i] - arr1[i - 1]));
      }
      if (dist.some((item) => item === 0 || item < 1 || item > 3)) {
      } else {
        safeRows =
          (increasing && decreasing) || (!increasing && !decreasing)
            ? safeRows
            : safeRows + 1;
      }
    }
    this.result = `${safeRows}`;
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
