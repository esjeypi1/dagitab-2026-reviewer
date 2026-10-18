// ANSI/IEEE distinctive-shape logic gates.
// gate(type, x, y) draws a gate whose body starts at (x, y) and is 40 units tall.
// It returns { svg, in: [[x,y], ...], out: [x,y] } so wires can be connected to the pins.
import { path, circle, poly, text } from './svg.js';

const H = 40;

function inputYs(n, y) {
  if (n === 1) return [y + 20];
  if (n === 2) return [y + 10, y + 30];
  return [y + 8, y + 20, y + 32];
}

// x offset of the curved back of an OR gate at a given height (quadratic curve with control 12)
const orBack = (yy, y) => {
  const t = (yy - y) / H;
  return 2 * (1 - t) * t * 12;
};

export function gate(type, x, y, { inputs = 2, label } = {}) {
  type = type.toUpperCase();
  const inv = ['NAND', 'NOR', 'XNOR', 'NOT'].includes(type);
  let body = '';
  let outX;
  let ins;
  if (type === 'NOT' || type === 'BUFFER') {
    body = poly([[x, y + 4], [x, y + 36], [x + 32, y + 20]], { closed: true });
    outX = x + 32;
    ins = [[x, y + 20]];
  } else if (type === 'AND' || type === 'NAND') {
    body = path(`M ${x} ${y} H ${x + 25} A 20 20 0 0 1 ${x + 25} ${y + H} H ${x} Z`);
    outX = x + 45;
    ins = inputYs(inputs, y).map((yy) => [x, yy]);
  } else {
    const bx = type === 'XOR' || type === 'XNOR' ? x + 7 : x;
    body = path(`M ${bx} ${y} Q ${bx + 12} ${y + 20} ${bx} ${y + H} Q ${bx + 32} ${y + H} ${bx + 46} ${y + 20} Q ${bx + 32} ${y} ${bx} ${y} Z`);
    if (bx !== x) body += path(`M ${x} ${y} Q ${x + 12} ${y + 20} ${x} ${y + H}`);
    outX = bx + 46;
    ins = inputYs(inputs, y).map((yy) => [x + orBack(yy, y), yy]);
  }
  if (inv) {
    body += circle(outX + 4.5, y + 20, 4.5);
    outX += 9;
  }
  if (label) body += text((x + outX) / 2 - 2, y + H + 12, label, { size: 11 });
  return { svg: body, in: ins, out: [outX, y + 20] };
}

// A small labeled input terminal, e.g. "A" at the far left of a wire.
export function inputLabel(x, y, name) {
  return text(x - 6, y, name, { size: 15, anchor: 'end', italic: false, weight: 'bold' });
}

export function outputLabel(x, y, name) {
  return text(x + 6, y, name, { size: 15, anchor: 'start', weight: 'bold' });
}
