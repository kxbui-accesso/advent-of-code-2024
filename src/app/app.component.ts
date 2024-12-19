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

const D = 9;
const O = 10;
const N = 11;
const SQ = 12;
const T = 13;
const D_OP = 14;
const D_CP = 15;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
  result = '';

  onSubmit() {
    const str = this.input;
    let res = 0;
    let prevStage: number = ZERO;
    let number1 = '',
      number2 = '';
    let start = -1;
    for (let i = 0; i < str.length; i++) {
      const stage = this.checkStage(prevStage, str[i]);
      if ((prevStage === OP || prevStage === D1) && stage === D1) {
        number1 += str[i];
      }
      if ((prevStage === COMMA || prevStage === D2) && stage === D2) {
        number2 += str[i];
      }
      if (prevStage === D2 && stage === CP) {
        const action = this.findAction(str.slice(0, start));
        if (!!action) {
          res += +number1 * +number2;
        }
      }
      if (stage === ZERO || stage === M) {
        (number1 = ''), (number2 = '');
      }
      if (stage === M) {
        start = i;
      }
      prevStage = stage;
    }
    this.result = `${res}`;
  }

  findAction(str: string): boolean | null {
    let prevStage = 0;
    let action = '';
    for (let i = str.length - 1; i >= 0; i--) {
      const stage = this.checkDoStage(prevStage, str[i]);
      if (stage >= D && stage <= D_CP) {
        action = `${str[i]}${action}`;
      }
      if (prevStage !== ZERO && stage === D) {
        return !action.includes("don't()");
      }
      if (stage === ZERO || stage === D) {
        action = '';
      }
      prevStage = stage;
    }
    return true;
  }

  checkDoStage(stage: number, char: string): number {
    switch (stage) {
      case ZERO:
        if (char === ')') {
          return D_CP;
        }
        return 0;
      case D_CP:
        if (char === '(') {
          return D_OP;
        }
        return 0;
      case D_OP:
        if (char === 't') {
          return T;
        }
        if (char === 'o') {
          return O;
        }
        return 0;
      case T:
        if (char === "'") {
          return SQ;
        }
        return 0;
      case SQ:
        if (char === 'n') {
          return N;
        }
        return 0;
      case N:
        if (char === 'o') {
          return O;
        }
        return 0;
      case O:
        if (char === 'd') {
          return D;
        }
        return 0;
      default:
        return 0;
    }
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
