// Helpers for answer checkers.

// Converts a choice written in simple LaTeX (like "$\frac{3}{4}$", "$2.5\text{ k}\Omega$",
// "$4\sqrt{3}$", "$1.2 \times 10^{-3}$ A") into a number. Returns NaN if it cannot.
export function parseNum(text) {
  // When the choice has math, read only the first math part (units written outside it are ignored).
  const m = String(text).match(/\$([^$]+)\$/);
  let s = (m ? m[1] : String(text)).replace(/\$/g, ' ').replace(/\{,\}/g, '').replace(/₱|PHP/g, ' ');
  if (s.includes('=')) s = s.slice(s.lastIndexOf('=') + 1);
  s = s.replace(/\\(text|mathrm|operatorname)\{[^}]*\}(\^(\{[^}]*\}|\d))?/g, ' ');
  s = s.replace(/\\[,;:! ]|~/g, ' ');
  s = s.replace(/\^\{?\\circ\}?|\\%|%|°/g, ' ');
  s = s.replace(/(\d),(\d{3})(?!\d)/g, '$1$2');
  s = s.replace(/\\left|\\right/g, '');
  for (let k = 0; k < 6; k++) {
    s = s.replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))');
    s = s.replace(/\\sqrt\[3\]\{([^{}]*)\}/g, '#($1)');
    s = s.replace(/\\sqrt\{([^{}]*)\}/g, '@($1)');
    s = s.replace(/\^\{([^{}]*)\}/g, '**($1)');
  }
  s = s.replace(/\^(\d)/g, '**$1');
  s = s.replace(/\\times|\\cdot/g, '*');
  s = s.replace(/\\pi/g, '&');
  s = s.replace(/−/g, '-');
  s = s.replace(/\\[A-Za-z]+/g, ' ');
  s = s.replace(/[A-Za-zΩμ°²³]+/g, ' ');
  s = s.replace(/[{}]/g, (c) => (c === '{' ? '(' : ')'));
  s = s.replace(/\s+/g, '');
  // implicit multiplication
  s = s.replace(/(\d|\))(?=[(@#&])/g, '$1*').replace(/&(?=[(@#&\d])/g, '&*');
  s = s.replace(/@/g, 'Math.sqrt').replace(/#/g, 'Math.cbrt').replace(/&/g, 'Math.PI');
  if (!s || !/^[\d.+\-*/()Mathsqrcbt.PI]+$/.test(s)) return NaN;
  try {
    const v = Function(`"use strict"; return (${s});`)();
    return typeof v === 'number' ? v : NaN;
  } catch {
    return NaN;
  }
}

export function close(a, b, rel = 0.005, abs = 1e-9) {
  return Math.abs(a - b) <= Math.max(abs, rel * Math.abs(b));
}

// All 2^n input rows, most significant input first: [[0,0],[0,1],[1,0],[1,1]] for n = 2.
export function rows(n) {
  const out = [];
  for (let r = 0; r < 2 ** n; r++) out.push([...Array(n)].map((_, i) => (r >> (n - 1 - i)) & 1));
  return out;
}

export const sameFn = (f, g, n) => rows(n).every((r) => !!f(...r) === !!g(...r));

// Returns the index of the only candidate equal to target, or throws if zero or more than one match.
export function onlyMatch(candidates, test) {
  const hits = candidates.map((c, i) => (test(c) ? i : -1)).filter((i) => i >= 0);
  if (hits.length !== 1) throw new Error(`expected exactly one matching choice, found ${hits.length} (${hits})`);
  return hits[0];
}

// Boolean helpers for writing checkers.
export const NOT = (a) => (a ? 0 : 1);
export const AND = (...x) => (x.every(Boolean) ? 1 : 0);
export const OR = (...x) => (x.some(Boolean) ? 1 : 0);
export const XOR = (a, b) => (a ^ b ? 1 : 0);
export const NAND = (...x) => NOT(AND(...x));
export const NOR = (...x) => NOT(OR(...x));
export const XNOR = (a, b) => NOT(XOR(a, b));

export const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
export const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
export const nCr = (n, r) => (r < 0 || r > n ? 0 : fact(n) / (fact(r) * fact(n - r)));
export const nPr = (n, r) => fact(n) / fact(n - r);
export const deg = (x) => (x * Math.PI) / 180;
export const par = (...r) => 1 / r.reduce((s, x) => s + 1 / x, 0);

// Wraps a checker written for an earlier choice order. order[j] = original index of the choice now stored at j.
export function withOrder(order, fn) {
  return (q) => {
    const res = fn(q);
    if (res && 'index' in res) return { ...res, index: order.indexOf(res.index) };
    return res;
  };
}
