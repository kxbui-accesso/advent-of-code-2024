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
  input = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;
  result = signal('');

  onSubmit() {
    const map = this.parseRow(this.input).map((row) => row.split(''));
    let locations = new Set();
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        if (this.isAntenna(map[row][col])) {
          const antennas = this.findOtherAntennasAbove(map, row, col, map[row][col]);
          if (antennas.length > 0) {
            this.getAntinodes(map, { row, col }, antennas).forEach(
              (antinode) => {
                if (
                  !locations.has(this.formatLoc(antinode.row, antinode.col))
                ) {
                  locations.add(this.formatLoc(antinode.row, antinode.col));
                }
              }
            );
          }
        }
      }
    }

    this.result.set(`${locations.size}`);
  }

  formatLoc(row: number, col: number): string {
    return `${row}-${col}`;
  }

  getAntinodes(
    map: any[][],
    currAnt: { row: number; col: number },
    antennas: { row: number; col: number }[]
  ): any[] {
    const antinodes: any[] = [];

    for (let i = 0; i < antennas.length; i++) {
      const antn1 = this.calcAntinodeLoc(currAnt, antennas[i]);
      this.isValidLoc(map, antn1.row, antn1.col) && antinodes.push(antn1);

      const antn2 = this.calcAntinodeLoc(antennas[i], currAnt);
      this.isValidLoc(map, antn2.row, antn2.col) && antinodes.push(antn2);
    }
    return antinodes;
  }

  calcAntinodeLoc(
    ant1: { row: number; col: number },
    ant2: { row: number; col: number }
  ): { row: number; col: number } {
    const rowDiff = Math.abs(ant1.row - ant2.row);
    const colDiff = Math.abs(ant1.col - ant2.col);

    return {
      row: ant1.row < ant2.row ? ant1.row - rowDiff : ant1.row + rowDiff,
      col: ant1.col < ant2.col ? ant1.col - colDiff : ant1.col + colDiff,
    };
  }

  isValidLoc(map: any[], row: number, col: number): boolean {
    const width = map[0].length;
    const height = map.length;

    return row >= 0 && row < height && col >= 0 && col < width;
  }

  findOtherAntennasAbove(
    map: any[][],
    row: number,
    col: number,
    antenna: string
  ): { row: number; col: number }[] {
    const antennas = [];
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (i === row && j === col) break;
        if (map[i][j] === antenna && i !== row && j !== col) {
          antennas.push({ row: i, col: j });
        }
      }
    }
    return antennas;
  }

  isAntenna(char: string) {
    return char.match(/^[0-9a-zA-Z]+$/);
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
