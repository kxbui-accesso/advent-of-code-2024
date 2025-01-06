import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const REGISTER_A = 'A';
const REGISTER_B = 'B';
const REGISTER_C = 'C';
const OUTPUT = 'O';

const COMBO_OPERAND: Record<string, string> = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': REGISTER_A,
  '5': REGISTER_B,
  '6': REGISTER_C,
};

const OPCODE: Record<string, string> = {
  '0': 'ADV',
  '1': 'BXL',
  '2': 'BST',
  '3': 'JNZ',
  '4': 'BXC',
  '5': 'OUT',
  '6': 'BDV',
  '7': 'CDV',
};

interface Register {
  [REGISTER_A]: string;
  [REGISTER_B]: string;
  [REGISTER_C]: string;
}

interface Result {
  [REGISTER_A]?: string;
  [REGISTER_B]?: string;
  [REGISTER_C]?: string;
  [OUTPUT]?: string[];
  jumpTo?: number;
}

type InstructionResult = Result | null;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
    input = `Register A: 729
  Register B: 0
  Register C: 0

  Program: 0,1,5,4,3,0`;

  result = signal('');

  onSubmit() {
    this.result.set(`...waiting`);

    setTimeout(() => {
      const input = this.parseInput(this.parseRow(this.input));
      const total = this.start(input);
      this.result.set(`${total}`);
    }, 0);
  }

  start(input: {
    registerA: string;
    registerB: string;
    registerC: string;
    program: string;
  }): string {
    const program = input.program.split(',');
    let registers = {
      [REGISTER_A]: input.registerA,
      [REGISTER_B]: input.registerB,
      [REGISTER_C]: input.registerC,
    };
    let output: string[] = [];
    let count = 0;

    while (count < program.length) {
      const opcode = OPCODE[program[count]];
      if (opcode === 'JNZ') {
        const result = this.callOpcode('JNZ', registers, program[count + 1]);
        count =
          result && result.jumpTo !== undefined ? result.jumpTo : count + 2;
      } else {
        const result = this.callOpcode(
          OPCODE[program[count]],
          registers,
          program[count + 1]
        );
        if (result) {
          if (result[OUTPUT]) {
            output = [...output, ...result[OUTPUT]];
          } else {
            registers = { ...registers, ...result };
          }
        }
        count += 2;
      }
    }

    return output.join(',');
  }

  callOpcode(
    opcode: string,
    register: Register,
    operand: string
  ): InstructionResult {
    switch (opcode) {
      case 'ADV':
        return this.doADV(register, operand);
      case 'BXL':
        return this.doBXL(register, operand);
      case 'BST':
        return this.doBST(register, operand);
      case 'JNZ':
        return this.doJNZ(register, operand);
      case 'BXC':
        return this.doBXC(register, operand);
      case 'OUT':
        return this.doOUT(register, operand);
      case 'BDV':
        return this.doBDV(register, operand);
      case 'CDV':
        return this.doCDV(register, operand);
    }
    return null;
  }

  /**
   * The adv instruction (opcode 0) performs division.
   * The numerator is the value in the A register.
   * The denominator is found by raising 2 to the power of the instruction's combo operand.
   * The result of the division operation is truncated to an integer and then
   * written to the A register.
   * @param register
   */
  doADV(register: Register, operand: string): InstructionResult {
    const comboOperand = COMBO_OPERAND[operand];
    const denominator = Number.isInteger(Number(comboOperand))
      ? Number(comboOperand)
      : Number((register as Record<string, any>)[comboOperand]);

    const result = Math.trunc(
      Number(register[REGISTER_A]) / 2 ** Number(denominator)
    );
    return {
      [REGISTER_A]: `${result}`,
    };
  }

  /**
   * The bxl instruction (opcode 1) calculates the bitwise XOR of
   * register B and the instruction's literal operand,
   * then stores the result in register B.
   * @param register
   * @param operand
   */
  doBXL(register: Register, operand: string): InstructionResult {
    const result = Number(register[REGISTER_B]) ^ Number(operand);
    return {
      [REGISTER_B]: `${result}`,
    };
  }

  /**
   * The bst instruction (opcode 2) calculates the value of its combo operand modulo 8
   * then writes that value to the B register.
   * @param register
   * @param operand
   * @returns
   */
  doBST(register: Register, operand: string): InstructionResult {
    const comboOperand = COMBO_OPERAND[operand];
    const dividend = Number.isInteger(Number(comboOperand))
      ? Number(comboOperand)
      : Number((register as Record<string, any>)[comboOperand]);

    const result = dividend % 8;
    return {
      [REGISTER_B]: `${result}`,
    };
  }

  /**
   * The jnz instruction (opcode 3) does nothing if the A register is 0.
   * However, if the A register is not zero, it jumps by setting the instruction
   * pointer to the value of its literal operand; if this instruction jumps,
   * the instruction pointer is not increased by 2 after this instruction.
   * @param register
   * @param operand
   * @returns
   */
  doJNZ(register: Register, operand: string): InstructionResult {
    if (!Number(register[REGISTER_A])) {
      return null;
    }
    return {
      jumpTo: Number(operand),
    };
  }

  /**
   * The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C,
   * then stores the result in register B.
   * @param register
   * @param operand
   * @returns
   */
  doBXC(register: Register, operand: string): InstructionResult {
    const result = Number(register[REGISTER_B]) ^ Number(register[REGISTER_C]);
    return {
      [REGISTER_B]: `${result}`,
    };
  }

  /**
   * The out instruction (opcode 5) calculates the value of its combo operand modulo 8,
   * then outputs that value. (If a program outputs multiple values,
   * they are separated by commas.)
   * @param register
   * @param operand
   * @returns
   */
  doOUT(register: Register, operand: string): InstructionResult {
    const comboOperand = COMBO_OPERAND[operand];
    const dividend = Number.isInteger(Number(comboOperand))
      ? Number(comboOperand)
      : Number((register as Record<string, any>)[comboOperand]);
    const result = dividend % 8;
    return {
      [OUTPUT]: [`${result}`],
    };
  }

  /**
   * The bdv instruction (opcode 6) works exactly like the adv instruction
   * except that the result is stored in the B register.
   * (The numerator is still read from the A register.)
   * @param register
   * @param operand
   * @returns
   */
  doBDV(register: Register, operand: string): InstructionResult {
    const comboOperand = COMBO_OPERAND[operand];
    const denominator = Number.isInteger(Number(comboOperand))
      ? Number(comboOperand)
      : Number((register as Record<string, any>)[comboOperand]);

    const result = Math.trunc(
      Number(register[REGISTER_A]) / 2 ** Number(denominator)
    );
    return {
      [REGISTER_B]: `${result}`,
    };
  }

  /**
   * The cdv instruction (opcode 7) works exactly like the adv instruction
   * except that the result is stored in the C register.
   * (The numerator is still read from the A register.)
   * @param register
   * @param operand
   * @returns
   */
  doCDV(register: Register, operand: string): InstructionResult {
    const comboOperand = COMBO_OPERAND[operand];
    const denominator = Number.isInteger(Number(comboOperand))
      ? Number(comboOperand)
      : Number((register as Record<string, any>)[comboOperand]);

    const result = Math.trunc(
      Number(register[REGISTER_A]) / 2 ** Number(denominator)
    );
    return {
      [REGISTER_C]: `${result}`,
    };
  }

  parseInput(input: string[]): {
    registerA: string;
    registerB: string;
    registerC: string;
    program: string;
  } {
    const arr: any[] = [];

    const registerA = this.parseValue(input[0], 'Register A: ');
    const registerB = this.parseValue(input[1], 'Register B: ');
    const registerC = this.parseValue(input[2], 'Register C: ');

    const program = this.parseValue(input[4], 'Program: ');

    return { registerA, registerB, registerC, program };
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
