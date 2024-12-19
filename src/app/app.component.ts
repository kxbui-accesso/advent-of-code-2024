import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

const ZERO = 0;
const M = 1;
const U = 2;
const L = 3;
const OP = 4;
const D1 = 5;
const COMMA = 6;
const D2 = 7;
const CP = 8;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
  result = '';

  onSubmit() {
    const str = this.input;
    let res = 0;
    let prevStage: number = ZERO;
    let number1 = '',
      number2 = '';
    for (let i = 0; i < str.length; i++) {
      const stage = this.checkStage(prevStage, str[i]);
      if ((prevStage === OP || prevStage === D1) && stage === D1) {
        number1 += str[i];
      }
      if ((prevStage === COMMA || prevStage === D2) && stage === D2) {
        number2 += str[i];
      }
      if (prevStage === D2 && stage === CP) {
        res += +number1 * +number2;
      }
      if (stage === ZERO || stage === M) {
        (number1 = ''), (number2 = '');
      }
      prevStage = stage;
    }
    this.result = `${res}`;
  }

  checkStage(stage: number, char: string): number {
    switch (stage) {
      case ZERO:
        if (char === 'm') {
          return M;
        }
        return 0;
      case M:
        if (char === 'u') {
          return U;
        }
        return 0;
      case U:
        if (char === 'l') {
          return L;
        }
        return 0;
      case L:
        if (char === '(') {
          return OP;
        }
        return 0;
      case OP:
        if (this.isNumeric(char)) {
          return D1;
        }
        return 0;
      case D1:
        if (char === ',') {
          return COMMA;
        }
        if (!this.isNumeric(char)) return 0;
        return stage;
      case COMMA:
        if (this.isNumeric(char)) {
          return D2;
        }
        return 0;
      case D2:
        if (char === ')') {
          return CP;
        }
        if (!this.isNumeric(char)) return 0;
        return stage;
      case CP:
        if (char === 'm') {
          return M;
        }
        return 0;
      default:
        return 0;
    }
  }

  isNumeric(str: string) {
    return /^\d+$/.test(str);
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
