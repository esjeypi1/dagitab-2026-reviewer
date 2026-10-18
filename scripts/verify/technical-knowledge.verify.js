// Answer checkers for Technical Knowledge.
// Each entry re-solves one question on its own and returns the answer (see scripts/verify/index.js).
// If you edit a question's numbers or choices, update or remove its checker here.
// withOrder([..], fn): the checker was written for the original choice order; this maps its index to the stored order.
import { withOrder, parseNum, close, rows, sameFn, onlyMatch, NOT, AND, OR, XOR, NAND, NOR, XNOR, gcd, fact, nCr, nPr, deg, par } from './lib.js';

export default {
  'TK-FLO-002': withOrder([3,2,0,1], () => { let sum = 0, i = 1; while (i <= 5) { sum += i; i += 2; } return { value: sum }; }),
  'TK-FLO-003': withOrder([0,1,3,2], () => { const A = 4, B = 9, Cc = 7; let M = A; if (B > M) M = B; if (Cc > M) M = Cc; return { value: M }; }),
  'TK-FLO-004': withOrder([3,0,1,2], () => {
        const run = (step) => { let f = 1, i = 1, guard = 0; const n = 5; while (i <= n && guard++ < 100) { [f, i] = step(f, i); i = i + 1; } return f; };
        const c = [(f, i) => [f * i, i], (f, i) => [f + i, i], (f, i) => [f, i * f], (f, i) => [i, i]];
        return { index: onlyMatch(c, (s) => run(s) === 120) };
      }),
  'TK-FLO-006': withOrder([1,2,0,3], () => { let i = 10, n = 0; while (i > 1) { n++; i = Math.floor(i / 2); } return { value: n }; }),
  'TK-FLO-007': withOrder([3,1,2,0], () => { const s = 75; return { choice: s > 90 ? '"A"' : s > 75 ? '"B"' : '"C"' }; }),
  'TK-FLO-008': withOrder([0,3,2,1], () => { let n = 472, s = 0; while (n > 0) { s += n % 10; n = Math.floor(n / 10); } return { value: s }; }),
  'TK-FLO-009': withOrder([0,2,3,1], () => { let x = 1; do { x *= 3; } while (!(x > 50)); return { value: x }; }),
  'TK-FLO-010': withOrder([3,0,2,1], () => { let A = 5, B = 8; const T = A; A = B; B = T; return { choice: `$${A},\\ ${B}$` }; }),
  'TK-FLO-011': withOrder([3,0,2,1], () => { let c = 0; for (let i = 1; i <= 20; i++) if (i % 3 === 0) c++; return { value: c }; }),
  'TK-PSE-001': withOrder([0,1,2,3], () => {
        const c = [(a, b, d) => (a + b + d) / 3, (a, b, d) => a + b + d / 3, (a, b, d) => (a + b + d) * 3, (a, b, d) => a / 3 + b + d];
        return { index: onlyMatch(c, (f) => [[3, 3, 3], [1, 2, 6], [10, 0, 5]].every(([a, b, d]) => close(f(a, b, d), (a + b + d) / 3))) };
      }),
  'TK-PSE-002': withOrder([0,2,3,1], () => { let c = 0; for (let i = 1; i <= 4; i++) for (let j = 1; j <= i; j++) c++; return { value: c }; }),
  'TK-PSE-003': withOrder([1,3,0,2], () => { let x = 5, y = 3; x = x + y; y = x - y; x = x - y; return { choice: `$${x},\\ ${y}$` }; }),
  'TK-PSE-004': withOrder([2,0,3,1], () => {
        const flow = () => { const o = []; let i = 1; while (!(i > 3)) { o.push(i); i++; } return o.join(','); };
        const c = [
          () => { const o = []; let i = 1; while (i <= 3) { o.push(i); i++; } return o.join(','); },
          () => { const o = []; let i = 1; while (i < 3) { o.push(i); i++; } return o.join(','); },
          () => { const o = []; let i = 1; while (i > 3) { o.push(i); i++; } return o.join(','); },
          () => { const o = []; let i = 1; while (i <= 3) { i++; o.push(i); } return o.join(','); },
        ];
        return { index: onlyMatch(c, (f) => f() === flow()) };
      }),
  'TK-PSE-005': withOrder([2,3,0,1], () => { const o = []; for (let i = 1; i <= 10; i++) if (i % 2 === 0 && i % 3 === 0) o.push(i); return { choice: o.join(', ') }; }),
  'TK-PSE-006': withOrder([3,1,0,2], () => { let t = 0; for (let k = 1; k <= 5; k++) t += k * k; return { value: t }; }),
  'TK-PSE-007': withOrder([1,3,2,0], () => { const f = (n) => (n <= 1 ? 1 : n * f(n - 1)); return { value: f(4) }; }),
  'TK-PSE-008': withOrder([3,2,0,1], () => { let max = 0; for (const x of [-4, -9, -2, -7]) if (x > max) max = x; return { value: max }; }),
  'TK-PSE-009': withOrder([1,3,0,2], () => {
        const run = (cond, subFirst) => { const o = []; let n = 10; while (cond(n)) { if (subFirst) { n -= 2; o.push(n); } else { o.push(n); n -= 2; } } return o.join(','); };
        const c = [() => run((n) => n > 0, false), () => run((n) => n >= 0, false), () => run((n) => n > 2, false), () => run((n) => n > 0, true)];
        return { index: onlyMatch(c, (f) => f() === '10,8,6,4,2') };
      }),
  'TK-PSE-010': withOrder([3,0,1,2], () => { let a = 2; do { a = a * a; } while (!(a > 100)); return { value: a }; }),
  'TK-PSE-011': withOrder([3,0,1,2], () => ({ choice: `$${Math.floor(17 / 5)},\\ ${17 % 5}$` })),
  'TK-PRG-001': withOrder([1,2,0,3], () => {
        const t = (x) => !(x < 3 || x > 8);
        const c = [(x) => x >= 3 && x <= 8, (x) => x >= 3, (x) => x < 3 || x > 8, (x) => x > 3 && x < 8];
        const xs = [-5, 0, 2, 3, 4, 7, 8, 9, 20];
        return { index: onlyMatch(c, (f) => xs.every((x) => f(x) === t(x))) };
      }),
  'TK-PRG-002': withOrder([3,2,0,1], () => ({ value: 2 + (3 * 4 ** 2) / 8 - 1 })),
  'TK-PRG-004': withOrder([1,3,0,2], () => { let n = 0; for (let i = 3; i <= 12; i++) n++; return { value: n }; }),
  'TK-PRG-005': withOrder([2,3,0,1], () => { const A = [5, 10, 15, 20, 25]; return { value: A[A[0] - 3] }; }),
  'TK-PRG-006': withOrder([1,0,3,2], () => {
        const want = (l, r) => (l + r === 1 ? 1 : 0);
        const c = [(l, r) => OR(AND(l, NOT(r)), AND(NOT(l), r)), (l, r) => OR(l, r), (l, r) => AND(l, r), (l, r) => NOT(OR(l, r))];
        return { index: onlyMatch(c, (f) => sameFn(f, want, 2)) };
      }),
  'TK-PRG-007': withOrder([0,2,3,1], () => ({ choice: `$${(45).toString(2)}$` })),
  'TK-PRG-008': withOrder([2,3,0,1], () => ({ value: parseInt('2F', 16) })),
  'TK-PRG-009': withOrder([2,3,0,1], () => ({ choice: `$${(0b1011 + 0b0110).toString(2)}_2$` })),
  'TK-PRG-011': withOrder([0,2,3,1], () => {
        const want = (y) => y % 4 === 0 && y % 100 !== 0;
        const c = [(y) => y % 4 === 0 && y % 100 !== 0, (y) => y % 4 === 0 || y % 100 !== 0, (y) => y % 4 !== 0 && y % 100 === 0, (y) => y % 100 === 0 && y % 4 === 0];
        const ys = [1900, 2000, 2023, 2024, 2100, 1996];
        return { index: onlyMatch(c, (f) => ys.every((y) => f(y) === want(y))) };
      }),
  'TK-ROB-002': withOrder([3,0,1,2], () => ({ value: ((340 * 0.002) / 2) * 100 })),
  'TK-ROB-005': withOrder([1,3,2,0], () => ({ value: (300 * 12) / 36 })),
  'TK-ROB-006': withOrder([3,1,0,2], () => ({ value: 10 * 2 * Math.PI * 3 })),
  'TK-ROB-009': withOrder([3,0,2,1], () => ({ value: 0.25 * 5 })),
  'TK-SYS-003': withOrder([0,3,1,2], () => ({ value: (5 - 2) / 0.02 })),
  'TK-SYS-005': withOrder([1,0,3,2], () => ({ value: (512 * 5) / 1024 })),
  'TK-SYS-006': withOrder([0,3,2,1], () => ({ value: 2000 / 500 })),
  'TK-SYS-007': withOrder([2,1,3,0], () => {
        const c = [[10, 10], [10, 20], [20, 10], [5, 10]];
        return { index: onlyMatch(c, ([r1, r2]) => close((9 * r2) / (r1 + r2), 4.5)) };
      }),
  'TK-SYS-011': withOrder([2,3,0,1], () => ({ choice: `${(3.7 * 2).toFixed(1)} V, ${2000} mAh` })),
  'TK-FLO-012': withOrder([2,0,1,3], () => { const o = []; let n = 5; while (n > 0) { o.push(n); n -= 2; } return { choice: o.join(', ') }; }),
  'TK-FLO-013': withOrder([1,2,0,3], () => { const x = 4; let y = 2 * x + 3; y = y * 2; return { value: y }; }),
  'TK-FLO-014': withOrder([3,1,0,2], () => ({ choice: 30 > 30 ? '"FAN ON"' : '"FAN OFF"' })),
  'TK-FLO-015': withOrder([1,0,3,2], () => { let p = 1, i = 1; while (i <= 4) { p *= 2; i++; } return { value: p }; }),
  'TK-FLO-017': withOrder([2,3,1,0], () => { let n = 100, c = 0; while (n >= 10) { n = Math.floor(n / 2); c++; } return { value: c }; }),
  'TK-FLO-018': withOrder([1,2,3,0], () => { let x = 2; do { x += 3; } while (!(x > 10)); return { value: x }; }),
  'TK-FLO-019': withOrder([1,2,3,0], () => {
        const f = (a, b) => (a > b ? a - b : b - a);
        const c = [(a, b) => Math.abs(a - b), (a, b) => Math.max(a, b), (a, b) => a - b, (a, b) => a + b];
        return { index: onlyMatch(c, (g) => [[3, 8], [8, 3], [5, 5], [-2, 4]].every(([a, b]) => g(a, b) === f(a, b))) };
      }),
  'TK-FLO-020': withOrder([0,1,2,3], () => {
        const run = (cond) => { let s = 0, i = 1; while (cond(i)) { s += i; i++; } return s; };
        const c = [(i) => i <= 10, (i) => i < 10, (i) => i > 10, (i) => i <= 11];
        return { index: onlyMatch(c, (f) => run(f) === 55) };
      }),
  'TK-PSE-012': withOrder([2,1,0,3], () => { let x = 1; while (x < 100) x *= 3; return { value: x }; }),
  'TK-PSE-013': withOrder([1,3,0,2], () => { const n = 15; let o; if (n % 3 === 0) o = '"Fizz"'; else if (n % 5 === 0) o = '"Buzz"'; else if (n % 15 === 0) o = '"FizzBuzz"'; else o = String(n); return { choice: o }; }),
  'TK-PSE-014': withOrder([3,0,1,2], () => { const A = [3, 8, 2, 7, 5]; let s = 0; for (let i = 0; i <= 4; i++) if (A[i] > 4) s += A[i]; return { value: s }; }),
  'TK-PSE-015': withOrder([2,1,3,0], () => {
        const run = (start, lt, addFirst) => { let s = 0, i = start; while (lt ? i < 20 : i <= 20) { if (addFirst) { s += i; i += 2; } else { i += 2; s += i; } } return s; };
        const vals = [run(2, false, true), run(2, true, true), run(2, false, false), run(1, false, true)];
        return { index: onlyMatch(vals, (v) => v === 110) };
      }),
  'TK-PSE-016': withOrder([0,3,1,2], () => { let n = 0; do { n++; } while (!(n * n > 30)); return { value: n }; }),
  'TK-PSE-017': withOrder([1,0,2,3], () => { const area = (w, h) => w * h; return { value: area(3, 4) + area(2, 5) }; }),
  'TK-PSE-018': withOrder([3,0,1,2], () => ({ choice: '$' + Math.floor(47 / 5) + ',\\ ' + (47 % 5) + '$' })),
  'TK-PSE-019': withOrder([3,1,0,2], () => { let c = 0; for (let i = 1; i <= 3; i++) for (let j = 1; j <= 4; j++) if (i < j) c++; return { value: c }; }),
  'TK-PSE-020': withOrder([3,2,0,1], () => { const p = (b, e) => (e === 0 ? 1 : b * p(b, e - 1)); return { value: p(3, 4) }; }),
  'TK-PRG-012': withOrder([0,2,3,1], () => {
        const a = 4, b = 9;
        return { index: onlyMatch([a < b && b < 10, a > b || b === 4, !(a < b), a + b > 13], (v) => v) };
      }),
  'TK-PRG-013': withOrder([0,1,3,2], () => ({ value: parseInt('110110', 2) })),
  'TK-PRG-014': withOrder([0,1,3,2], () => ({ choice: '$' + (2 ** 8 - 1) + '$' })),
  'TK-PRG-015': withOrder([2,1,3,0], () => { let i = 0, c = 0; while (i < 20) { i += 3; c++; } return { value: c }; }),
  'TK-PRG-016': withOrder([3,2,0,1], () => {
        const idx = new Set([0, 1, 2, 3, 4, 5, 6, 7]);
        const ok = (a, b) => { const s = []; for (let i = a; i <= b; i++) s.push(i); return s.length === 8 && s.every((i) => idx.has(i)); };
        return { index: onlyMatch([[0, 7], [1, 8], [0, 8], [1, 7]], ([a, b]) => ok(a, b)) };
      }),
  'TK-PRG-018': withOrder([0,2,3,1], () => ({ choice: '$' + (0xa7).toString(2) + '_2$' })),
  'TK-PRG-019': withOrder([1,0,3,2], () => {
        const c = [(a, b) => !a || !b, (a, b) => !a && !b, (a, b) => a || b, (a, b) => !a && b];
        const rows2 = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => [!!a, !!b]);
        return { index: onlyMatch(c, (f) => rows2.every(([a, b]) => f(a, b) === !(a && b))) };
      }),
  'TK-PRG-020': withOrder([1,2,3,0], () => { let c = 250; for (let k = 0; k < 10; k++) c = (c + 1) % 256; return { value: c }; }),
  'TK-ROB-012': withOrder([3,2,1,0], () => ({ value: (100 / 20) * 30 })),
  'TK-ROB-014': withOrder([0,2,3,1], () => ({ value: ((1.5 - 1) / (2 - 1)) * 180 })),
  'TK-ROB-016': withOrder([3,2,0,1], () => ({ value: (90 / 360) * 200 })),
  'TK-ROB-018': withOrder([0,1,2,3], () => ({ choice: '$' + (120 * 10) / 100 + '\\pi$ m' })),
  'TK-SYS-016': withOrder([1,0,2,3], () => ({ value: (128 / 256) * 5 })),
  'TK-SYS-018': withOrder([3,1,0,2], () => { const t = 50 + 50 + 4 * 250; return { choice: t > 1000 ? 'No. The total is ' + t / 1000 + ' A, which is more than 1 A.' : 'x' }; }),
};
