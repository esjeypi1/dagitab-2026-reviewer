// Answer checkers for Mathematics and Logic.
// Each entry re-solves one question on its own and returns the answer (see scripts/verify/index.js).
// If you edit a question's numbers or choices, update or remove its checker here.
// withOrder([..], fn): the checker was written for the original choice order; this maps its index to the stored order.
import { withOrder, parseNum, close, rows, sameFn, onlyMatch, NOT, AND, OR, XOR, NAND, NOR, XNOR, gcd, fact, nCr, nPr, deg, par } from './lib.js';

export default {
  'ML-FUN-001': withOrder([1,2,0,3], () => ({ value: 2 * (-2) ** 2 - 3 * -2 + 1 })),
  'ML-FUN-002': withOrder([2,1,0,3], () => { const f = (x) => 3 * x - 5; const g = (x) => x * x + 1; return { value: f(g(2)) }; }),
  'ML-FUN-003': withOrder([3,0,2,1], () => { const f = (x) => (2 * x + 3) / (x - 1); let lo = 1.0001, hi = 100; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (f(m) > 5) lo = m; else hi = m; } return { value: lo }; }),
  'ML-FUN-004': withOrder([0,2,3,1], () => {
        const ok = (x) => x - 2 >= 0 && x !== 5;
        const sets = [(x) => x >= 2 && x !== 5, (x) => x > 2 && x !== 5, (x) => x >= 2, (x) => x !== 5];
        const tests = [-1, 0, 2, 3, 4.9, 5, 6, 100];
        return { index: onlyMatch(sets, (s) => tests.every((t) => s(t) === ok(t))) };
      }),
  'ML-FUN-005': withOrder([1,0,3,2], () => {
        const c = [(x) => x * x + x - 2, (x) => x * x + 5 * x + 4, (x) => x * x + 3 * x - 4, (x) => x * x + x + 2];
        return { index: onlyMatch(c, (f) => [-3, -1, 0, 2, 5].every((x) => f(x + 1) === x * x + 3 * x)) };
      }),
  'ML-ALG-001': withOrder([3,1,0,2], () => {
        const sols = [];
        for (let x = -10; x <= 10; x += 0.5) if (x > 2 && close(Math.log2(x) + Math.log2(x - 2), 3)) sols.push(x);
        return { choice: sols.length === 1 && sols[0] === 4 ? '$x = 4$' : 'none' };
      }),
  'ML-ALG-002': withOrder([3,0,1,2], () => { const d = Math.sqrt(49 - 24); const r = (7 + d) / 4; const s = (7 - d) / 4; return { value: r * r + s * s }; }),
  'ML-ALG-003': withOrder([0,2,1,3], () => {
        const f = (x) => 4 ** x - 6 * 2 ** x + 8;
        let sum = 0;
        for (let x = -5; x <= 5; x += 0.25) if (Math.abs(f(x)) < 1e-9) sum += x;
        return { value: sum };
      }),
  'ML-ALG-004': withOrder([2,0,1,3], () => { for (let s = 0; s <= 50; s++) if (120 * (50 - s) + 80 * s === 4800) return { value: s }; return { value: NaN }; }),
  'ML-ALG-005': withOrder([1,3,0,2], () => {
        const truth = (x) => Math.abs(2 * x - 3) < 7;
        const c = [(x) => x > -2 && x < 5, (x) => x < 5, (x) => x > -5 && x < 2, (x) => x < -2 || x > 5];
        const xs = [-6, -2.5, -2, -1, 0, 2, 3, 4.9, 5, 6];
        return { index: onlyMatch(c, (f) => xs.every((x) => f(x) === truth(x))) };
      }),
  'ML-ALG-006': withOrder([1,3,0,2], () => { const P = (x) => x ** 3 - 2 * x ** 2 + 4 * x - 5; return { value: P(2) }; }),
  'ML-GEN-001': withOrder([3,1,0,2], () => ({ value: 10000 * 1.1 ** 3, tol: 0.0001 })),
  'ML-GEN-002': withOrder([1,2,0,3], () => { const f = 100 * 1.2 * 0.8; return { index: f < 100 && close(100 - f, 4) ? 0 : -1 }; }),
  'ML-GEN-003': withOrder([3,0,1,2], () => ({ value: 200 * 0.5 ** (20 / 5) })),
  'ML-GEN-005': withOrder([0,3,2,1], () => {
        const imp = (a, b) => (!a || b ? 1 : 0);
        const target = (p, q) => imp(p, q);
        const c = [(p, q) => imp(NOT(q), NOT(p)), (p, q) => imp(q, p), (p, q) => imp(NOT(p), NOT(q)), (p, q) => AND(p, NOT(q))];
        return { index: onlyMatch(c, (f) => sameFn(f, target, 2)) };
      }),
  'ML-GEN-006': withOrder([1,2,3,0], () => ({ value: 1 / (1 / 6 + 1 / 4 - 1 / 12) })),
  'ML-GEO-001': withOrder([2,3,1,0], () => { const c = Math.hypot(6, 8); return { value: (0.5 * 6 * 8) / ((6 + 8 + c) / 2) }; }),
  'ML-GEO-002': withOrder([0,1,3,2], () => ({ value: 144 - Math.PI * 144 / 4 })),
  'ML-GEO-003': withOrder([1,0,3,2], () => ({ value: (1.6 * 15) / 2.4 })),
  'ML-GEO-004': withOrder([0,1,3,2], () => { const n = 2340 / 180 + 2; return { value: (n * (n - 3)) / 2 }; }),
  'ML-GEO-005': withOrder([1,0,2,3], () => {
        const c = [[3, 2, 10], [2, -3, 11], [3, -2, 14], [3, 2, 14]];
        return { index: onlyMatch(c, ([a, b, k]) => a * 4 + b * -1 === k && close((-a / b) * (2 / 3), -1)) };
      }),
  'ML-GEO-006': withOrder([1,0,3,2], () => { const h = 6 / 2; const k = -4 / 2; const r = Math.sqrt(12 + h * h + k * k); return { index: h === 3 && k === -2 && r === 5 ? 0 : -1 }; }),
  'ML-TRI-001': withOrder([0,3,1,2], () => { const t = Math.PI - Math.asin(3 / 5); return { value: Math.tan(t) }; }),
  'ML-TRI-002': withOrder([2,3,1,0], () => ({ value: Math.sin(deg(75)) })),
  'ML-TRI-003': withOrder([1,3,0,2], () => ({ value: 60 * Math.tan(deg(30)) })),
  'ML-TRI-004': withOrder([1,3,2,0], () => {
        const P = Math.PI;
        const f = (x) => 2 * Math.sin(x) ** 2 - Math.sin(x) - 1;
        const sets = [[P / 2, 7 * P / 6, 11 * P / 6], [P / 2, P / 6, 5 * P / 6], [P / 2, 7 * P / 6], [3 * P / 2, P / 6, 5 * P / 6]];
        let roots = 0;
        for (let k = 0; k < 7200; k++) { const x = (k / 7200) * 2 * P; if (Math.abs(f(x)) < 1e-9) roots++; }
        return { index: onlyMatch(sets, (s) => s.length === roots && s.every((x) => Math.abs(f(x)) < 1e-9)) };
      }),
  'ML-TRI-005': withOrder([1,3,0,2], () => ({ value: Math.sqrt(49 + 64 - 2 * 7 * 8 * Math.cos(deg(60))) })),
  'ML-TRI-006': withOrder([1,0,3,2], () => ({ value: 9 * deg(140) })),
  'ML-PRB-001': withOrder([2,0,1,3], () => { let n = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === 8) n++; return { value: n / 36 }; }),
  'ML-PRB-002': withOrder([2,1,3,0], () => ({ value: nCr(5, 2) / nCr(10, 2) })),
  'ML-PRB-003': withOrder([3,1,2,0], () => ({ value: nCr(5, 2) * nCr(6, 2) })),
  'ML-PRB-004': withOrder([1,3,2,0], () => { let n = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let c = 1; c <= 6; c++) if (a === 6 || b === 6 || c === 6) n++; return { value: n / 216 }; }),
  'ML-PRB-005': withOrder([2,1,0,3], () => ({ value: 0.3 / 0.5 })),
  'ML-PRB-006': withOrder([0,2,3,1], () => {
        const w = 'CIRCUIT'.split('');
        const seen = new Set();
        const perm = (arr, cur) => { if (!arr.length) { seen.add(cur); return; } arr.forEach((ch, i) => perm([...arr.slice(0, i), ...arr.slice(i + 1)], cur + ch)); };
        perm(w, '');
        return { value: seen.size };
      }),
  'ML-RDG-005': withOrder([2,0,1,3], () => ({ index: 3000 / 600 === 5 ? 0 : -1 })),
  'ML-GAT-001': withOrder([3,2,1,0], () => {
        const Y = (a, b, c) => OR(AND(a, b), NOT(c));
        const cand = [(a, b, c) => OR(AND(a, b), NOT(c)), (a, b, c) => NOT(OR(AND(a, b), c)), (a, b, c) => AND(OR(a, b), NOT(c)), (a, b, c) => AND(a, b, NOT(c))];
        return { index: onlyMatch(cand, (f) => sameFn(f, Y, 3)) };
      }),
  'ML-GAT-002': withOrder([2,3,0,1], () => {
        const Y = (a, b, c) => AND(XOR(a, b), c);
        const combos = [[0, 1, 1], [1, 1, 1], [1, 0, 0], [0, 0, 1]];
        return { index: onlyMatch(combos, (r) => Y(...r) === 1) };
      }),
  'ML-GAT-003': withOrder([2,3,1,0], () => {
        const Y = (a, b) => OR(NOT(a), NOT(b));
        return { index: onlyMatch([NAND, NOR, AND, XOR], (g) => sameFn((a, b) => g(a, b), Y, 2)) };
      }),
  'ML-GAT-004': withOrder([2,3,1,0], () => ({ choice: `$S = ${XOR(1, 1)},\\ C = ${AND(1, 1)}$` })),
  'ML-GAT-005': withOrder([3,1,0,2], () => ({ value: rows(3).filter(([a, b, c]) => AND(NAND(a, b), OR(b, c))).length })),
  'ML-GAT-006': withOrder([2,1,3,0], () => {
        const Y = (a, b) => NAND(NAND(a, a), b);
        const c = [(a, b) => OR(a, NOT(b)), (a, b) => OR(NOT(a), b), (a, b) => AND(NOT(a), b), (a, b) => AND(a, NOT(b))];
        return { index: onlyMatch(c, (f) => sameFn(f, Y, 2)) };
      }),
  'ML-CIR-001': withOrder([2,0,1,3], () => {
        const lamp = (s1, s2, s3) => OR(AND(s1, s2), s3);
        const c = [(a, b, d) => OR(AND(a, b), d), (a, b, d) => AND(OR(a, b), d), (a, b, d) => OR(a, b, d), (a, b, d) => AND(a, b, d)];
        return { index: onlyMatch(c, (f) => sameFn(f, lamp, 3)) };
      }),
  'ML-CIR-002': withOrder([2,3,0,1], () => {
        const V = 1, r = 1;
        const i1b = V / (r + par(r, r)), i2b = i1b / 2;
        const ia = V / (2 * r);
        const b1 = ia < i1b ? 'dim' : 'bright', b2 = ia > i2b ? 'bright' : 'dim';
        const map = { 'dim,bright': 0, 'dim,dim': 1, 'bright,bright': 2, 'bright,dim': 3 };
        return { index: map[`${b1},${b2}`] };
      }),
  'ML-CIR-003': withOrder([3,0,1,2], () => { const before = 1 / 3, after = 1 / 2; return { index: after > before ? 0 : 2 }; }),
  'ML-TT-001': withOrder([3,1,0,2], () => {
        const t = [[0, 0, 1], [0, 1, 0], [1, 0, 0], [1, 1, 0]];
        return { index: onlyMatch([NOR, NAND, AND, XNOR], (g) => t.every(([a, b, y]) => g(a, b) === y)) };
      }),
  'ML-TT-002': withOrder([1,0,3,2], () => {
        const t = [[0, 0, 0, 1], [0, 0, 1, 0], [0, 1, 0, 1], [0, 1, 1, 0], [1, 0, 0, 1], [1, 0, 1, 0], [1, 1, 0, 1], [1, 1, 1, 1]];
        const c = [(a, b, d) => OR(AND(a, b), NOT(d)), (a, b, d) => OR(a, NOT(d)), (a, b, d) => NOT(d), (a, b, d) => OR(b, NOT(d))];
        return { index: onlyMatch(c, (f) => t.every(([a, b, d, y]) => f(a, b, d) === y)) };
      }),
  'ML-TT-003': withOrder([0,2,3,1], () => ({ choice: rows(3).map(([a, b, c]) => OR(AND(a, b), c)).join(', ') })),
  'ML-TT-004': withOrder([0,1,2,3], () => ({ value: rows(5).length })),
  'ML-TT-005': withOrder([3,1,0,2], () => {
        const t = [[0, 0, 0, 0], [0, 0, 1, 1], [0, 1, 0, 1], [0, 1, 1, 0], [1, 0, 0, 1], [1, 0, 1, 0], [1, 1, 0, 0], [1, 1, 1, 1]];
        const c = [(a, b, d) => XOR(XOR(a, b), d), (a, b, d) => NOT(XOR(XOR(a, b), d)), (a, b, d) => OR(a, b, d), (a, b, d) => AND(a, b, d)];
        return { index: onlyMatch(c, (f) => t.every(([a, b, d, y]) => f(a, b, d) === y)) };
      }),
  'ML-BOOL-001': withOrder([2,0,1,3], () => {
        const f = (a, b) => OR(AND(a, NOT(b)), AND(a, b));
        const c = [(a) => a, (a, b) => b, (a, b) => AND(a, NOT(b)), () => 1];
        return { index: onlyMatch(c, (g) => sameFn(g, f, 2)) };
      }),
  'ML-BOOL-002': withOrder([3,1,0,2], () => {
        const f = (a, b) => OR(a, AND(NOT(a), b));
        const c = [(a, b) => OR(a, b), (a, b) => AND(a, b), (a, b) => AND(NOT(a), b), (a) => a];
        return { index: onlyMatch(c, (g) => sameFn(g, f, 2)) };
      }),
  'ML-BOOL-003': withOrder([3,1,2,0], () => {
        const f = (a, b, c) => NOT(OR(AND(a, b), c));
        const cand = [(a, b, c) => AND(OR(NOT(a), NOT(b)), NOT(c)), (a, b, c) => OR(AND(NOT(a), NOT(b)), NOT(c)), (a, b, c) => AND(NOT(a), NOT(b), NOT(c)), (a, b, c) => OR(NOT(a), NOT(b), NOT(c))];
        return { index: onlyMatch(cand, (g) => sameFn(g, f, 3)) };
      }),
  'ML-BOOL-004': withOrder([0,2,3,1], () => {
        const f = (a, b, c) => OR(AND(a, b), AND(NOT(a), c), AND(b, c));
        const cand = [(a, b, c) => OR(AND(a, b), AND(NOT(a), c)), (a, b, c) => OR(AND(a, b), c), (a, b, c) => OR(a, c), (a, b, c) => OR(b, c)];
        return { index: onlyMatch(cand, (g) => sameFn(g, f, 3)) };
      }),
  'ML-BOOL-005': withOrder([3,2,0,1], () => {
        const f = (a, b) => AND(OR(a, b), OR(NOT(a), NOT(b)));
        const cand = [XOR, XNOR, (a, b) => AND(a, b), (a, b) => OR(a, b)];
        return { index: onlyMatch(cand, (g) => sameFn(g, f, 2)) };
      }),
  'ML-BOOL-006': withOrder([2,3,0,1], () => {
        const ms = [0, 2, 4, 6];
        const f = (a, b, c) => (ms.includes(a * 4 + b * 2 + c) ? 1 : 0);
        const cand = [(a, b, c) => NOT(c), (a, b, c) => AND(NOT(a), NOT(c)), (a, b, c) => NOT(b), (a, b, c) => OR(NOT(a), NOT(c))];
        return { index: onlyMatch(cand, (g) => sameFn(g, f, 3)) };
      }),
};
