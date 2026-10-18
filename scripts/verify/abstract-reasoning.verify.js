// Answer checkers for Abstract Reasoning.
// Each entry re-solves one question on its own and returns the answer (see scripts/verify/index.js).
// If you edit a question's numbers or choices, update or remove its checker here.
// withOrder([..], fn): the checker was written for the original choice order; this maps its index to the stored order.
import { withOrder, parseNum, close, rows, sameFn, onlyMatch, NOT, AND, OR, XOR, NAND, NOR, XNOR, gcd, fact, nCr, nPr, deg, par } from './lib.js';

export default {
  'AR-SPA-018': withOrder([3,0,2,1], () => ({ value: [[3, 2, 1], [2, 2, 1], [1, 1, 1]].flat().reduce((a, b) => a + b, 0) })),
  'AR-VIS-001': withOrder([1,3,2,0], () => { let n = 0; for (let k = 1; k <= 3; k++) n += (3 - k + 1) * (3 - k + 1); return { value: n }; }),
  'AR-VIS-002': withOrder([1,3,2,0], () => { let n = 0; for (let k = 1; k <= 3; k++) n += Math.max(0, 4 - k + 1) * Math.max(0, 3 - k + 1); return { value: n }; }),
  'AR-VIS-003': withOrder([0,3,1,2], () => {
        // lines as lists of the labeled points they pass through
        const lines = ['AFB', 'AGC', 'BDEC', 'AHD', 'AIE', 'FHIG'];
        const pts = [...new Set(lines.join(''))];
        const share = (p, q) => lines.some((l) => l.includes(p) && l.includes(q));
        const col = (p, q, r) => lines.some((l) => l.includes(p) && l.includes(q) && l.includes(r));
        let n = 0;
        for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) for (let k = j + 1; k < pts.length; k++) {
          const [p, q, r] = [pts[i], pts[j], pts[k]];
          if (share(p, q) && share(q, r) && share(p, r) && !col(p, q, r)) n++;
        }
        return { value: n };
      }),
  'AR-VIS-004': withOrder([1,2,0,3], () => { let n = 0; for (let x1 = 0; x1 < 4; x1++) for (let x2 = x1 + 1; x2 < 4; x2++) for (let y1 = 0; y1 < 3; y1++) for (let y2 = y1 + 1; y2 < 3; y2++) n++; return { value: n }; }),
  'AR-VIS-008': withOrder([2,1,3,0], () => { const dir = (k) => (k % 2 === 0 ? 'clockwise' : 'counterclockwise'); return { choice: `C ${dir(2)}, D ${dir(3)}` }; }),
  'AR-VIS-009': withOrder([1,0,3,2], () => { const n = 3; return { index: n % 2 === 1 ? 0 : 1 }; }),
  'AR-VIS-010': withOrder([2,0,1,3], () => ({ choice: `${40 / 10} turns ${2 % 2 === 0 ? 'clockwise' : 'counterclockwise'}` })),
  'AR-VIS-014': withOrder([2,3,1,0], () => { const t = 12 * 60 - (2 * 60 + 20); return { choice: `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}` }; }),
  'AR-VIS-015': withOrder([2,3,0,1], () => { const d = Math.abs(40 * 6 - (3 * 30 + 40 * 0.5)); return { value: Math.min(d, 360 - d) }; }),
  'AR-VIS-016': withOrder([3,1,0,2], () => ({ value: nCr(6, 2) })),
};
