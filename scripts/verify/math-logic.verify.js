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
  'ML-FUN-006': withOrder([0,1,3,2], () => { const g = (x) => 5 - 2 * x; return { value: g(g(1)) }; }),
  'ML-FUN-007': withOrder([2,1,0,3], () => {
        const f = (x) => 3 * x + 2;
        const cand = [(x) => (x - 2) / 3, (x) => (x + 2) / 3, (x) => 1 / (3 * x + 2), (x) => 3 * x - 2];
        return { index: onlyMatch(cand, (g) => [0, 1, 5, -4].every((x) => Math.abs(g(f(x)) - x) < 1e-9)) };
      }),
  'ML-FUN-008': withOrder([1,0,3,2], () => {
        let m = Infinity;
        for (let x = -50; x <= 50; x += 0.001) m = Math.min(m, x * x - 6 * x + 11);
        return { index: Math.abs(m - 2) < 1e-6 ? 0 : -1 };
      }),
  'ML-FUN-009': withOrder([0,1,3,2], () => { const f = (x) => 2 ** x; const g = (x) => x - 1; return { value: f(g(4)) + g(f(1)) }; }),
  'ML-FUN-010': withOrder([3,1,2,0], () => {
        const cand = [(x) => x ** 3 - x, (x) => x ** 2 + 1, (x) => x ** 3 + 1, (x) => Math.abs(x)];
        return { index: onlyMatch(cand, (f) => [0.5, 1, 2, 3].every((x) => Math.abs(f(-x) + f(x)) < 1e-9)) };
      }),
  'ML-FUN-011': withOrder([3,0,2,1], () => { const f = (x) => (x < 1 ? x * x : 3 * x - 1); return { value: f(-2) + f(2) }; }),
  'ML-FUN-013': withOrder([1,2,0,3], () => { const a = Math.sqrt(4); const b = 9 / (a + 1); return { value: a * 1 + b }; }),
  'ML-FUN-014': withOrder([1,3,0,2], () => {
        const ok = (x) => x * x - 5 * x + 6 > 0;
        const cand = [(x) => x < 2 || x > 3, (x) => x > 2 && x < 3, (x) => x >= 2 && x <= 3, (x) => x <= 2 || x >= 3];
        const pts = [-5, 0, 1.9, 2, 2.5, 3, 3.1, 10];
        return { index: onlyMatch(cand, (p) => pts.every((x) => p(x) === ok(x))) };
      }),
  'ML-ALG-007': withOrder([2,3,1,0], () => ({ value: (5 + 6) / (3 - 2) })),
  'ML-ALG-008': withOrder([0,2,1,3], () => {
        const det = 2 * -1 - 3 * 1;
        const x = (12 * -1 - 3 * 1) / det;
        const y = (2 * 1 - 12 * 1) / det;
        return { value: x * y };
      }),
  'ML-ALG-009': withOrder([1,3,0,2], () => {
        const P = (x) => x ** 3 - 2 * x ** 2 - 5 * x + 6;
        return { index: onlyMatch([1, -1, 2, -3], (r) => P(r) === 0) };
      }),
  'ML-ALG-010': withOrder([2,1,0,3], () => ({ value: -(9 + 12) / 3 })),
  'ML-ALG-011': withOrder([2,1,0,3], () => {
        const F = (x) => (x * x - 4) / (x * x + x - 6);
        const cand = [(x) => (x + 2) / (x + 3), (x) => (x - 2) / (x - 3), (x) => (x + 2) / (x - 3), (x) => -4 / (x - 6)];
        return { index: onlyMatch(cand, (g) => [5, 7, -1].every((x) => Math.abs(g(x) - F(x)) < 1e-9)) };
      }),
  'ML-ALG-012': withOrder([1,3,2,0], () => ({ value: (2 ** 5 * 4 ** 3) / 8 ** 3 })),
  'ML-ALG-013': withOrder([0,2,1,3], () => {
        const d = (27 - 11) / 4;
        const a1 = 11 - 2 * d;
        let s = 0;
        for (let n = 0; n < 10; n++) s += a1 + n * d;
        return { value: s };
      }),
  'ML-ALG-014': withOrder([0,2,3,1], () => ({ value: 18 / (1 - -1 / 3) })),
  'ML-GEN-007': withOrder([2,1,0,3], () => ({ value: (1500 / 5) * 3 })),
  'ML-GEN-008': withOrder([1,3,0,2], () => ({ value: 45 / 0.15 })),
  'ML-GEN-009': withOrder([3,0,1,2], () => ({ value: 240 / (120 / 60 + 120 / 40) })),
  'ML-GEN-010': withOrder([0,1,2,3], () => ({ value: (6 * 10) / 4 })),
  'ML-GEN-012': withOrder([2,0,3,1], () => ({ value: 8000 * (1 + 0.05 * 3) })),
  'ML-GEN-013': withOrder([1,0,3,2], () => ({ value: (0.3 * 10) / 0.2 - 10 })),
  'ML-GEO-007': withOrder([2,1,0,3], () => ({ value: 0.5 * (8 + 12) * 5 })),
  'ML-GEO-008': withOrder([2,1,0,3], () => ({ value: Math.hypot(7 - 1, 10 - 2) })),
  'ML-GEO-009': withOrder([0,1,2,3], () => ({ value: (180 / 6) * 3 })),
  'ML-GEO-010': withOrder([3,1,2,0], () => ({ value: 100 / 2 })),
  'ML-GEO-011': withOrder([2,0,3,1], () => ({ value: Math.PI * 3 ** 2 * 10 })),
  'ML-GEO-012': withOrder([3,0,1,2], () => ({ value: 20 * (3 / 2) ** 2 })),
  'ML-GEO-013': withOrder([2,0,3,1], () => {
        const cand = [[-2, 7], [0.5, 2], [2, -1], [-2, 3]];
        return { index: onlyMatch(cand, ([m, b]) => m === -2 && m * 2 + b === 3) };
      }),
  'ML-GEO-014': withOrder([2,3,0,1], () => ({ value: 6 * (Math.sqrt(3) / 4) * 16 })),
  'ML-TRI-007': withOrder([0,3,1,2], () => ({ value: Math.cos(deg(60)) + Math.sin(deg(30)) })),
  'ML-TRI-008': withOrder([0,1,2,3], () => ({ value: (150 * Math.PI) / 180 })),
  'ML-TRI-009': withOrder([2,0,3,1], () => ({ value: 10 * Math.sin(deg(60)) })),
  'ML-TRI-010': withOrder([2,0,1,3], () => {
        const F = (t) => (1 - Math.cos(t) ** 2) / Math.sin(t);
        const cand = [Math.sin, Math.cos, Math.tan, () => 1];
        return { index: onlyMatch(cand, (g) => [0.4, 0.7, 2].every((t) => Math.abs(g(t) - F(t)) < 1e-9)) };
      }),
  'ML-TRI-011': withOrder([2,1,3,0], () => ({ value: Math.tan(deg(225)) })),
  'ML-TRI-012': withOrder([3,0,2,1], () => ({ value: (10 * Math.sqrt(2) * Math.sin(deg(30))) / Math.sin(deg(45)) })),
  'ML-TRI-013': withOrder([3,2,1,0], () => ({ value: (2 * Math.PI) / 4 })),
  'ML-TRI-014': withOrder([0,2,1,3], () => { const s = 5 / 13; const c = Math.sqrt(1 - s * s); return { value: 2 * s * c }; }),
  'ML-PRB-007': withOrder([1,2,0,3], () => ({ value: nCr(3, 2) / 2 ** 3 })),
  'ML-PRB-008': withOrder([1,0,2,3], () => ({ value: 2 / 52 })),
  'ML-PRB-009': withOrder([2,3,1,0], () => ({ value: nPr(5, 3) })),
  'ML-PRB-010': withOrder([3,0,1,2], () => ({ value: fact(4) })),
  'ML-PRB-011': withOrder([3,0,1,2], () => ({ value: 0.4 + 0.5 - 0.4 * 0.5 })),
  'ML-PRB-012': withOrder([1,3,2,0], () => ({ value: 50 * (1 / 5) - 10 * (4 / 5) })),
  'ML-PRB-013': withOrder([0,3,1,2], () => ({ value: nCr(6, 3) / nCr(10, 3) })),
  'ML-PRB-014': withOrder([1,3,2,0], () => ({ value: 2 * fact(5) })),
  'ML-GAT-007': withOrder([0,1,2,3], () => {
        const Y = (a, b) => NOT(OR(a, b));
        return { index: onlyMatch([NOR, NAND, OR, XNOR], (f) => sameFn(f, Y, 2)) };
      }),
  'ML-GAT-008': withOrder([1,0,3,2], () => {
        const Y = (a, b) => AND(a, NOT(b));
        return { index: onlyMatch([[1, 0], [0, 1], [1, 1], [0, 0]], (r) => Y(...r) === 1) };
      }),
  'ML-GAT-009': withOrder([0,3,1,2], () => {
        const Y = (a, b) => NOT(XOR(a, b));
        const cand = [(a, b) => (a === b ? 1 : 0), (a, b) => (a !== b ? 1 : 0), (a, b) => OR(a, b), (a, b) => AND(a, b)];
        return { index: onlyMatch(cand, (f) => sameFn(f, Y, 2)) };
      }),
  'ML-GAT-010': withOrder([0,3,2,1], () => {
        const Y = (a, b, c) => OR(AND(a, b), AND(a, c));
        const cand = [(a, b, c) => AND(a, OR(b, c)), (a, b, c) => OR(AND(a, b), c), (a, b, c) => OR(a, AND(b, c)), (a, b, c) => AND(OR(a, b), OR(a, c))];
        return { index: onlyMatch(cand, (f) => sameFn(f, Y, 3)) };
      }),
  'ML-GAT-011': withOrder([3,1,0,2], () => {
        const Y = (a, b) => NAND(NAND(a, b), NAND(a, b));
        return { index: onlyMatch([AND, NAND, OR, NOR], (f) => sameFn(f, Y, 2)) };
      }),
  'ML-GAT-012': withOrder([3,0,2,1], () => { const P = NAND(1, 1); const Q = NOR(P, 0); return { choice: `$P = ${P},\\ Q = ${Q}$` }; }),
  'ML-GAT-013': withOrder([3,0,1,2], () => {
        const Y = (a, b) => NOR(NOR(a, a), NOR(b, b));
        return { index: onlyMatch([AND, OR, NAND, NOR], (f) => sameFn(f, Y, 2)) };
      }),
  'ML-GAT-014': withOrder([0,3,1,2], () => {
        const Y = (a, b, c) => OR(AND(a, b), AND(b, c), AND(a, c));
        const cand = [(a, b, c) => (a + b + c >= 2 ? 1 : 0), (a, b, c) => (a + b + c === 1 ? 1 : 0), (a, b, c) => AND(a, b, c), (a, b, c) => OR(a, b, c)];
        return { index: onlyMatch(cand, (f) => sameFn(f, Y, 3)) };
      }),
  'ML-CIR-009': withOrder([1,0,3,2], () => {
        const lamp = (s1, s2, s3) => AND(OR(s1, s2), s3);
        return { index: onlyMatch([[0, 1, 1], [1, 1, 0], [1, 0, 0], [0, 0, 1]], (r) => lamp(...r) === 1) };
      }),
  'ML-CIR-012': withOrder([1,0,2,3], () => {
        const V = 1, Rb = 1;
        const p1 = V ** 2 / Rb, p2 = (V / 2) ** 2 / Rb, p3 = (V / 2) ** 2 / Rb;
        return { index: p1 > p2 && p2 === p3 ? 0 : -1 };
      }),
  'ML-TT-006': withOrder([3,2,1,0], () => {
        const tbl = [[0, 0, 1], [0, 1, 1], [1, 0, 1], [1, 1, 0]];
        return { index: onlyMatch([NAND, AND, NOR, XOR], (f) => tbl.every(([a, b, y]) => f(a, b) === y)) };
      }),
  'ML-TT-007': withOrder([0,3,1,2], () => ({ value: rows(2).filter(([a, b]) => OR(a, NOT(b)) === 0).length })),
  'ML-TT-008': withOrder([2,3,1,0], () => {
        const col = [0, 0, 0, 1, 0, 0, 0, 1];
        const cand = [(a, b, c) => AND(b, c), (a, b, c) => AND(a, b), (a, b, c) => OR(a, AND(b, c)), (a, b, c) => AND(a, b, c)];
        return { index: onlyMatch(cand, (f) => rows(3).every((r, i) => f(...r) === col[i])) };
      }),
  'ML-TT-009': withOrder([0,2,1,3], () => ({ choice: rows(3).map(([a, b, c]) => XOR(XOR(a, b), c)).join(', ') })),
  'ML-TT-010': withOrder([2,3,1,0], () => {
        const col = [1, 1, 0, 1];
        const cand = [(a, b) => OR(NOT(a), b), (a, b) => OR(a, NOT(b)), (a, b) => AND(a, NOT(b)), (a, b) => AND(NOT(a), b)];
        return { index: onlyMatch(cand, (f) => rows(2).every((r, i) => f(...r) === col[i])) };
      }),
  'ML-TT-011': withOrder([1,3,0,2], () => {
        const col = [1, 1, 0, 1, 0, 0, 0, 1];
        const cand = [
          (a, b, c) => OR(AND(NOT(a), NOT(b)), AND(b, c)),
          (a, b, c) => OR(NOT(a), AND(b, c)),
          (a, b, c) => OR(AND(NOT(a), c), AND(b, NOT(c))),
          (a, b, c) => OR(NOT(b), c),
        ];
        return { index: onlyMatch(cand, (f) => rows(3).every((r, i) => f(...r) === col[i])) };
      }),
  'ML-TT-012': withOrder([1,2,0,3], () => ({ value: 2 ** (2 ** 2) })),
  'ML-TT-013': withOrder([1,3,0,2], () => {
        const col = [0, 1, 1, 0, 0, 1, 0, 0];
        const lists = [[1, 2, 5], [0, 3, 4, 6, 7], [1, 2, 6], [2, 3, 5]];
        return { index: onlyMatch(lists, (L) => col.every((y, i) => y === (L.includes(i) ? 1 : 0))) };
      }),
  'ML-TT-014': withOrder([2,0,1,3], () => ({ value: rows(4).filter(([a, b]) => a === 1 && b === 0).length })),
  'ML-BOOL-007': withOrder([2,0,3,1], () => {
        const F = (a) => OR(AND(a, 1), AND(a, 0));
        return { index: onlyMatch([(a) => a, () => 1, () => 0, (a) => NOT(a)], (f) => sameFn(f, F, 1)) };
      }),
  'ML-BOOL-008': withOrder([3,2,1,0], () => {
        const F = (a, b) => OR(a, AND(a, b));
        return { index: onlyMatch([(a) => a, (a, b) => AND(a, b), (a, b) => OR(a, b), (a, b) => b], (f) => sameFn(f, F, 2)) };
      }),
  'ML-BOOL-009': withOrder([2,3,1,0], () => {
        const F = (a, b) => NOT(OR(a, NOT(b)));
        const cand = [(a, b) => AND(NOT(a), b), (a, b) => OR(NOT(a), b), (a, b) => AND(a, NOT(b)), (a, b) => AND(NOT(a), NOT(b))];
        return { index: onlyMatch(cand, (f) => sameFn(f, F, 2)) };
      }),
  'ML-BOOL-010': withOrder([3,2,0,1], () => {
        const F = (a, b, c) => AND(OR(a, b), OR(a, c));
        const cand = [(a, b, c) => OR(a, AND(b, c)), (a, b, c) => OR(AND(a, b), AND(a, c)), (a, b, c) => OR(a, b, c), (a, b, c) => AND(a, b, c)];
        return { index: onlyMatch(cand, (f) => sameFn(f, F, 3)) };
      }),
  'ML-BOOL-011': withOrder([0,3,1,2], () => {
        const F = (a, b) => OR(AND(NOT(a), NOT(b)), AND(NOT(a), b), AND(a, b));
        const cand = [(a, b) => OR(NOT(a), b), (a, b) => OR(a, NOT(b)), (a, b) => b, (a) => NOT(a)];
        return { index: onlyMatch(cand, (f) => sameFn(f, F, 2)) };
      }),
  'ML-BOOL-012': withOrder([1,0,2,3], () => {
        const F = (a, b, c) => OR(AND(a, b, c), AND(a, b, NOT(c)), AND(a, NOT(b), c));
        const cand = [(a, b, c) => AND(a, OR(b, c)), (a, b, c) => AND(a, b, c), (a, b, c) => OR(a, AND(b, c)), (a, b) => AND(a, b)];
        return { index: onlyMatch(cand, (f) => sameFn(f, F, 3)) };
      }),
  'ML-BOOL-013': withOrder([3,2,1,0], () => {
        const cand = [(a, b) => OR(AND(a, NOT(b)), AND(NOT(a), b)), (a, b) => OR(AND(a, b), AND(NOT(a), NOT(b))), (a, b) => AND(OR(a, b), AND(a, b)), (a, b) => OR(a, b)];
        return { index: onlyMatch(cand, (f) => sameFn(f, XOR, 2)) };
      }),
  'ML-BOOL-014': withOrder([3,1,2,0], () => {
        const cand = [(a, b) => OR(NOT(a), NOT(b)), (a, b) => AND(NOT(a), NOT(b)), (a, b) => OR(NOT(a), b), (a, b) => NOT(OR(a, b))];
        return { index: onlyMatch(cand, (f) => sameFn(f, NAND, 2)) };
      }),
};
