// Circuit schematic parts (ANSI/IEEE style). Each part is drawn between two points
// on a horizontal or vertical line; leads fill the space outside the symbol.
import { line, poly, circle, text, arrowHead, path } from './svg.js';

const unit = (x1, y1, x2, y2) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  return { len, ux: (x2 - x1) / len, uy: (y2 - y1) / len };
};

// Places a label beside the middle of a part. side: 1 = left/above, -1 = right/below.
function sideLabel(x1, y1, x2, y2, label, side = 1, dist = 18, size = 13) {
  if (!label) return '';
  const { ux, uy } = unit(x1, y1, x2, y2);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // normal pointing up (for horizontal) or left (for vertical)
  let nx = uy;
  let ny = -ux;
  if (ny > 0 || (ny === 0 && nx > 0)) { nx = -nx; ny = -ny; }
  const lx = mx + nx * dist * side;
  const ly = my + ny * dist * side;
  const anchor = Math.abs(nx) > 0.5 ? (nx * side < 0 ? 'end' : 'start') : 'middle';
  return text(anchor === 'middle' ? lx : lx + (anchor === 'start' ? -8 : 8), ly, label, { size, anchor });
}

function leads(x1, y1, x2, y2, body) {
  const { len, ux, uy } = unit(x1, y1, x2, y2);
  const a = (len - body) / 2;
  return {
    s: [x1 + ux * a, y1 + uy * a],
    e: [x2 - ux * a, y2 - uy * a],
    svg: line(x1, y1, x1 + ux * a, y1 + uy * a) + line(x2 - ux * a, y2 - uy * a, x2, y2),
  };
}

export const wire = (...pts) => poly(pts);
export const dot = (x, y) => circle(x, y, 3.5, 'fill="currentColor"');

export function resistor(x1, y1, x2, y2, label, side = 1) {
  const body = 40;
  const { ux, uy } = unit(x1, y1, x2, y2);
  const L = leads(x1, y1, x2, y2, body);
  const nx = -uy;
  const ny = ux;
  const pts = [L.s];
  const n = 6;
  for (let i = 0; i < n; i++) {
    const t = ((i + 0.5) / n) * body;
    const s = i % 2 === 0 ? 7 : -7;
    pts.push([L.s[0] + ux * t + nx * s, L.s[1] + uy * t + ny * s]);
  }
  pts.push(L.e);
  return L.svg + poly(pts) + sideLabel(x1, y1, x2, y2, label, side, 20);
}

// DC source (battery cell). The long plate is +. plus = 'start' or 'end' tells which endpoint is +.
export function battery(x1, y1, x2, y2, label, { plus = 'start', side = 1, signs = true } = {}) {
  const body = 12;
  const { ux, uy } = unit(x1, y1, x2, y2);
  const L = leads(x1, y1, x2, y2, body);
  const nx = -uy;
  const ny = ux;
  const [p, m] = plus === 'start' ? [L.s, L.e] : [L.e, L.s];
  const plate = ([x, y], h, w) => line(x + nx * h, y + ny * h, x - nx * h, y - ny * h, `stroke-width="${w}"`);
  let out = L.svg + plate(p, 14, 2) + plate(m, 7, 4);
  if (signs) {
    // signs go on the side opposite the label, nudged outward along the wire
    let qx = uy;
    let qy = -ux;
    if (qy > 0 || (qy === 0 && qx > 0)) { qx = -qx; qy = -qy; }
    const dir = plus === 'start' ? -1 : 1;
    const at = (pt, out) => [pt[0] - qx * side * 16 + ux * dir * out * 5, pt[1] - qy * side * 16 + uy * dir * out * 5];
    const pp = at(p, 1);
    const mm = at(m, -1);
    out += text(pp[0], pp[1], '+', { size: 13 }) + text(mm[0], mm[1], '\u2212', { size: 13 });
  }
  return out + sideLabel(x1, y1, x2, y2, label, side, 24);
}

export function lamp(x1, y1, x2, y2, label, side = 1) {
  const r = 12;
  const L = leads(x1, y1, x2, y2, 2 * r);
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const d = r * 0.7;
  return L.svg + circle(cx, cy, r) + line(cx - d, cy - d, cx + d, cy + d) + line(cx - d, cy + d, cx + d, cy - d)
    + sideLabel(x1, y1, x2, y2, label, side, 22);
}

// Ammeter or voltmeter: circle with a letter.
export function meter(x1, y1, x2, y2, letter, label, side = 1) {
  const r = 12;
  const L = leads(x1, y1, x2, y2, 2 * r);
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  return L.svg + circle(cx, cy, r) + text(cx, cy + 0.5, letter, { size: 14, weight: 'bold' })
    + sideLabel(x1, y1, x2, y2, label, side, 22);
}

export function switchOpen(x1, y1, x2, y2, label, side = 1) {
  const body = 30;
  const { ux, uy } = unit(x1, y1, x2, y2);
  const L = leads(x1, y1, x2, y2, body);
  const nx = -uy;
  const ny = ux;
  const tip = [L.e[0] - nx * 12 - ux * 2, L.e[1] - ny * 12 - uy * 2];
  // make the blade lift toward the label side
  return L.svg + circle(L.s[0], L.s[1], 2.5, 'fill="currentColor"') + circle(L.e[0], L.e[1], 2.5, 'fill="currentColor"')
    + line(L.s[0], L.s[1], tip[0], tip[1]) + sideLabel(x1, y1, x2, y2, label, side, 22);
}

// Current arrow on a wire at (x, y) pointing in direction dir ('right','left','up','down').
export function currentArrow(x, y, dir, label, labelPos = 'above') {
  const d = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }[dir];
  const head = arrowHead(x - d[0] * 10, y - d[1] * 10, x + d[0] * 5, y + d[1] * 5, 10);
  const off = { above: [0, -16], below: [0, 16], left: [-16, 0], right: [16, 0] }[labelPos];
  const anchor = labelPos === 'left' ? 'end' : labelPos === 'right' ? 'start' : 'middle';
  return head + (label ? text(x + off[0], y + off[1], label, { size: 13, anchor }) : '');
}

export function ground(x, y) {
  return line(x, y, x, y + 10) + line(x - 12, y + 10, x + 12, y + 10) + line(x - 7, y + 15, x + 7, y + 15) + line(x - 3, y + 20, x + 3, y + 20);
}

// LED: diode triangle with two small arrows. Anode at (x1,y1).
export function led(x1, y1, x2, y2, label, side = 1) {
  const body = 24;
  const { ux, uy } = unit(x1, y1, x2, y2);
  const L = leads(x1, y1, x2, y2, body);
  const nx = -uy;
  const ny = ux;
  const tri = [
    [L.s[0] + nx * 10, L.s[1] + ny * 10],
    [L.s[0] - nx * 10, L.s[1] - ny * 10],
    [L.e[0] - ux * 4, L.e[1] - uy * 4],
  ];
  const bar = line(L.e[0] - ux * 4 + nx * 10, L.e[1] - uy * 4 + ny * 10, L.e[0] - ux * 4 - nx * 10, L.e[1] - uy * 4 - ny * 10);
  const cx = (L.s[0] + L.e[0]) / 2;
  const cy = (L.s[1] + L.e[1]) / 2;
  const ax = cx - nx * 14;
  const ay = cy - ny * 14;
  const em = (o) => line(ax + ux * o, ay + uy * o, ax + ux * o - nx * 10 + ux * 6, ay + uy * o - ny * 10 + uy * 6, 'stroke-width="1.5"')
    + arrowHead(ax + ux * o, ay + uy * o, ax + ux * o - nx * 12 + ux * 7, ay + uy * o - ny * 12 + uy * 7, 6);
  return L.svg + poly(tri, { closed: true }) + bar + line(L.s[0], L.s[1], L.e[0] - ux * 4, L.e[1] - uy * 4) + em(-4) + em(6)
    + sideLabel(x1, y1, x2, y2, label, side, 22);
}

export { path };
