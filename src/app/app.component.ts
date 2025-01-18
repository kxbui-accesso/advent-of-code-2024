import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Validate rules of Ripple Carry Adder:
 *
 * XOR only outputs a bit if it doesn't take an input bit
 * XOR only takes an input bit if a XOR follows it, unless the input bits are the first bits
 * OR either outputs into z45 or is followed by an AND and a XOR
 * ANDs are only followed by ORs, unless the input bits are the first bits
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  input = `x00: 1
x01: 1
x02: 0
x03: 0
x04: 0
x05: 1
x06: 0
x07: 1
x08: 1
x09: 0
x10: 1
x11: 0
x12: 0
x13: 1
x14: 1
x15: 1
x16: 1
x17: 0
x18: 0
x19: 1
x20: 1
x21: 1
x22: 0
x23: 1
x24: 1
x25: 0
x26: 0
x27: 1
x28: 0
x29: 1
x30: 0
x31: 1
x32: 1
x33: 1
x34: 0
x35: 1
x36: 1
x37: 0
x38: 1
x39: 1
x40: 1
x41: 0
x42: 0
x43: 1
x44: 1
y00: 1
y01: 0
y02: 1
y03: 1
y04: 0
y05: 0
y06: 1
y07: 1
y08: 0
y09: 1
y10: 1
y11: 1
y12: 1
y13: 1
y14: 1
y15: 1
y16: 1
y17: 1
y18: 1
y19: 1
y20: 1
y21: 1
y22: 1
y23: 1
y24: 0
y25: 0
y26: 1
y27: 1
y28: 1
y29: 0
y30: 1
y31: 1
y32: 0
y33: 0
y34: 1
y35: 0
y36: 1
y37: 1
y38: 0
y39: 1
y40: 1
y41: 0
y42: 1
y43: 0
y44: 1

y30 AND x30 -> nww
vbw AND qhp -> smg
mwj OR pmq -> ngj
x19 AND y19 -> wrc
hnt XOR wnj -> z13
dsb XOR rgt -> z41
hqg OR cff -> fkm
tsw XOR vst -> z25
x14 AND y14 -> smm
npr OR jnh -> fhw
stg AND trp -> fmk
y05 AND x05 -> rkt
y22 AND x22 -> gsg
ftt AND mcb -> wmd
ngq AND cgm -> vdw
kpt AND prr -> rdt
rqf XOR grt -> z33
x24 XOR y24 -> nkc
hbq OR twj -> hkt
rkt OR ckj -> wts
x04 AND y04 -> pmq
y16 AND x16 -> bpn
x08 XOR y08 -> prr
kmk XOR qvw -> z09
jwd OR ssg -> cgm
mdm OR cwb -> hsf
y03 XOR x03 -> thv
jdb OR btb -> kpt
kvp AND pcv -> jnh
fff OR pgr -> tmk
hkt XOR qrn -> z34
ntr XOR gcc -> bfq
y37 XOR x37 -> ngq
cbj AND fnf -> pnj
btw OR gsg -> kvp
cbj XOR fnf -> z26
scv XOR mbp -> z20
hhd AND qrt -> spj
y20 XOR x20 -> mbp
y00 XOR x00 -> z00
swn AND jkm -> tbg
kps OR wvq -> wgm
x43 AND y43 -> dcp
tfj XOR bcg -> z44
x06 XOR y06 -> vrh
y21 XOR x21 -> gbs
x04 XOR y04 -> stt
x44 AND y44 -> fnd
mkj OR rdt -> qvw
nvc XOR tgd -> z11
hkt AND qrn -> qdd
wts XOR vrh -> z06
hdg XOR qpj -> z16
ngj AND pqj -> ckj
x21 AND y21 -> pgr
y22 XOR x22 -> svq
y39 AND x39 -> bng
y11 AND x11 -> tst
kqm OR vdw -> vvr
y15 XOR x15 -> nhg
rfw AND qnw -> wvq
x18 XOR y18 -> jss
jmh AND pfb -> nts
fmk OR dbr -> wnj
y14 XOR x14 -> nmb
grt AND rqf -> hbq
rrb OR dpj -> mdg
jcb OR pnj -> gcc
tst OR jnn -> stg
y43 XOR x43 -> jtb
x10 AND y10 -> vrj
y36 XOR x36 -> rfv
jss AND mdg -> z18
wvn XOR trw -> z10
y03 AND x03 -> bfs
vrh AND wts -> mcs
hnv OR rbm -> bdp
y31 AND x31 -> z31
y26 XOR x26 -> fnf
x08 AND y08 -> mkj
y34 AND x34 -> gck
x35 XOR y35 -> qnw
wnj AND hnt -> qdw
y32 XOR x32 -> vbw
y25 XOR x25 -> tsw
x34 XOR y34 -> qrn
y05 XOR x05 -> pqj
ckp OR wbt -> hdg
gcc AND ntr -> pph
dnr OR nhq -> rgt
dhg OR bpn -> pch
vrj OR cvp -> nvc
pbr XOR pch -> z17
x23 XOR y23 -> pcv
fqh XOR ctc -> hkh
y40 AND x40 -> dnr
x13 XOR y13 -> hnt
fkm AND hvb -> hnv
y28 XOR x28 -> mkq
hrh OR vtn -> swn
stg XOR trp -> z12
nkc AND fhw -> ngb
ngj XOR pqj -> z05
x33 AND y33 -> twj
qdd OR gck -> rfw
swp XOR fcs -> z07
rfv AND wgm -> jwd
fnd OR scp -> z45
vbm XOR qqb -> z40
x13 AND y13 -> mkh
svq AND tmk -> btw
pbr AND pch -> rrb
hsf XOR bng -> z39
x32 AND y32 -> nwj
x40 XOR y40 -> qqb
y38 AND x38 -> cwb
fhw XOR nkc -> z24
kpt XOR prr -> z08
y17 AND x17 -> dpj
swn XOR jkm -> z42
vbm AND qqb -> nhq
pfb XOR jmh -> z19
vvr AND crj -> mdm
y02 XOR x02 -> hvb
mkh OR qdw -> vsd
mdg XOR jss -> hmt
x36 AND y36 -> ssg
csh OR smm -> prp
y20 AND x20 -> jqj
y29 XOR x29 -> ftt
y24 AND x24 -> krb
vsd XOR nmb -> z14
x07 XOR y07 -> fcs
x37 AND y37 -> kqm
y10 XOR x10 -> wvn
nhg XOR prp -> z15
wgm XOR rfv -> z36
ngb OR krb -> vst
nww OR spj -> ctc
qvw AND kmk -> qfq
mcb XOR ftt -> z29
stt AND cmh -> mwj
prp AND nhg -> ckp
y12 XOR x12 -> trp
y23 AND x23 -> npr
nts OR wrc -> scv
jtb XOR bkf -> z43
mbp AND scv -> tpm
x01 XOR y01 -> sgt
mcs OR jwh -> swp
mkq XOR bfq -> z28
fqh AND ctc -> rjt
rfw XOR qnw -> z35
x11 XOR y11 -> tgd
thv AND bdp -> rvq
y06 AND x06 -> jwh
y18 AND x18 -> jcr
tpm OR jqj -> pdc
stt XOR cmh -> z04
x01 AND y01 -> hqg
qfq OR spq -> trw
fkm XOR hvb -> z02
x41 XOR y41 -> dsb
x02 AND y02 -> rbm
pdc XOR gbs -> z21
bfs OR rvq -> cmh
hdg AND qpj -> dhg
x31 XOR y31 -> fqh
vst AND tsw -> jgn
y17 XOR x17 -> pbr
y16 XOR x16 -> qpj
hmt OR jcr -> pfb
y15 AND x15 -> wbt
kvp XOR pcv -> z23
x39 XOR y39 -> fjp
y26 AND x26 -> jcb
x44 XOR y44 -> bcg
x42 AND y42 -> jfp
y07 AND x07 -> btb
tgd AND nvc -> jnn
nwj OR smg -> grt
fcs AND swp -> jdb
vgg OR pph -> z27
crj XOR vvr -> z38
trw AND wvn -> cvp
dcp OR dmk -> tfj
bdp XOR thv -> z03
y33 XOR x33 -> rqf
hkh OR rjt -> qhp
gbs AND pdc -> fff
svq XOR tmk -> z22
x19 XOR y19 -> jmh
tfj AND bcg -> scp
y35 AND x35 -> kps
qfw OR pms -> mcb
y09 AND x09 -> spq
vsd AND nmb -> csh
y30 XOR x30 -> qrt
rjr XOR sgt -> z01
ngq XOR cgm -> z37
rjr AND sgt -> cff
tbg OR jfp -> bkf
rgt AND dsb -> vtn
x27 AND y27 -> vgg
jtb AND bkf -> dmk
y42 XOR x42 -> jkm
x28 AND y28 -> qfw
wmd OR bsk -> hhd
bng AND hsf -> tkf
y09 XOR x09 -> kmk
qhp XOR vbw -> z32
hcp OR jgn -> cbj
y12 AND x12 -> dbr
y00 AND x00 -> rjr
y38 XOR x38 -> crj
y41 AND x41 -> hrh
y29 AND x29 -> bsk
tkf OR fjp -> vbm
qrt XOR hhd -> z30
y25 AND x25 -> hcp
bfq AND mkq -> pms
x27 XOR y27 -> ntr`;

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
    const { gateWireMap } = this.parseInput(lines);
    const zOutput = Array.from(gateWireMap.entries())
      .filter(([key]) => key.startsWith('z'))
      .map(([key]) => key)
      .sort((a, b) => a.localeCompare(b));

    const faultyRules = [];
    const gateWireList = Array.from(gateWireMap.values());
    for (let i = 0; i < gateWireList.length; i++) {
      !this.testRule(gateWireList[i], gateWireMap, zOutput) &&
        faultyRules.push(gateWireList[i]);
    }

    console.log(faultyRules);
    return faultyRules
      .reduce((arr, item) => [...arr, item.output], [])
      .sort()
      .join(',');
  }

  testRule(
    rule: any,
    gateWireMap: Map<string, any>,
    zOutput: string[]
  ): boolean {
    switch (rule.opr) {
      case 'AND':
        return this.testAnd(rule, gateWireMap);
      case 'XOR':
        return this.testXOr(rule, gateWireMap);
      case 'OR':
        return this.testOr(rule, gateWireMap, zOutput);
    }
    return false;
  }

  testAnd(rule: any, gateWireMap: Map<string, any>): boolean {
    if (
      ['x00', 'y00'].some((str) => rule.input1.startsWith(str)) &&
      ['x00', 'y00'].some((str) => rule.input2.startsWith(str))
    ) {
      return true;
    }

    if (
      Array.from(gateWireMap.values()).some(
        (item) =>
          [item.input1, item.input2].includes(rule.output) && item.opr === 'OR'
      )
    ) {
      return true;
    }

    return false;
  }

  testOr(rule: any, gateWireMap: Map<string, any>, zOutput: string[]): boolean {
    const rule1 = gateWireMap.get(rule.input1);
    const rule2 = gateWireMap.get(rule.input2);

    if (rule.output === zOutput[zOutput.length - 1]) {
      return true;
    }

    if (rule.output.startsWith('z')) {
      return false;
    }

    if (rule1.opr === 'AND' && rule2.opr === 'AND') {
      return true;
    }

    return true;
  }

  testXOr(rule: any, gateWireMap: Map<string, any>): boolean {
    if (
      ['x00', 'y00'].some((str) => rule.input1.includes(str)) &&
      ['x00', 'y00'].some((str) => rule.input2.includes(str))
    ) {
      return true;
    }

    if (
      !rule.output.startsWith('z') &&
      !['x', 'y'].some((str) => rule.input1.startsWith(str)) &&
      !['x', 'y'].some((str) => rule.input2.startsWith(str))
    ) {
      return false;
    }

    if (
      rule.output.startsWith('z') &&
      !['x', 'y'].some((str) => rule.input1.startsWith(str)) &&
      !['x', 'y'].some((str) => rule.input2.startsWith(str))
    ) {
      return true;
    }

    if (
      !rule.output.startsWith('z') &&
      (['x', 'y'].some((str) => rule.input1.startsWith(str)) ||
        ['x', 'y'].some((str) => rule.input2.startsWith(str)))
    ) {
      return Array.from(gateWireMap.values()).some(
        (item) =>
          item.opr === 'XOR' && [item.input1, item.input2].includes(rule.output)
      );
    }

    return false;
  }

  parseInput(lines: string[]): {
    wireMap: Map<string, number>;
    gateWireMap: Map<string, any>;
  } {
    let count = 0;
    const wireMap = new Map<string, number>();
    while (lines[count].trim()) {
      const [wire, val] = lines[count].split(':');
      wireMap.set(wire.trim(), Number(val));
      count++;
    }

    const gateWireMap = new Map<string, any>();
    lines.slice(++count).forEach((line) => {
      const [input, output] = line.split('->');
      const [input1, opr, input2] = input.split(/\s*[\s,]\s*/);
      gateWireMap.set(output.trim(), {
        input1: input1.trim(),
        opr: opr.trim(),
        input2: input2.trim(),
        output: output.trim(),
      });
    });

    return { wireMap, gateWireMap };
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
