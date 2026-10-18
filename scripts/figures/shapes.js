// Shapes for abstract reasoning figures.
// shape(kind, cx, cy, r, { fill, rot }) draws a shape centered at (cx, cy) with "radius" r.
// fill: 'none' | 'solid' | 'grey'. rot: degrees clockwise.
import { circle, poly, rect, line, path, svg, solidFill, greyFill, thin } from './svg.js';

const fillAttr = (f) => (f === 'solid' ? solidFill : f === 'grey' ? greyFill : '');

function regular(n, cx, cy, r, start = -90) {
  return [...Array(n)].map((_, i) => {
    const a = ((start + (360 / n) * i) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
}

function star(cx, cy, r, points = 5) {
  const out = [];
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45;
    const a = ((-90 + (180 / points) * i) * Math.PI) / 180;
    out.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  return out;
}

export const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'pentagon', 'hexagon', 'star', 'plus', 'arrow', 'cross'];

export function shape(kind, cx, cy, r, { fill = 'none', rot = 0, extra = '' } = {}) {
  const f = [fillAttr(fill), extra].filter(Boolean).join(' ');
  let s;
  switch (kind) {
    case 'circle': s = circle(cx, cy, r, f); break;
    case 'square': s = rect(cx - r * 0.85, cy - r * 0.85, r * 1.7, r * 1.7, f); break;
    case 'triangle': s = poly(regular(3, cx, cy + r * 0.15, r * 1.05), { closed: true, extra: f }); break;
    case 'diamond': s = poly(regular(4, cx, cy, r), { closed: true, extra: f }); break;
    case 'pentagon': s = poly(regular(5, cx, cy, r), { closed: true, extra: f }); break;
    case 'hexagon': s = poly(regular(6, cx, cy, r, 0), { closed: true, extra: f }); break;
    case 'star': s = poly(star(cx, cy, r), { closed: true, extra: f }); break;
    case 'plus': {
      const w = r * 0.32;
      s = poly([
        [cx - w, cy - r], [cx + w, cy - r], [cx + w, cy - w], [cx + r, cy - w], [cx + r, cy + w], [cx + w, cy + w],
        [cx + w, cy + r], [cx - w, cy + r], [cx - w, cy + w], [cx - r, cy + w], [cx - r, cy - w], [cx - w, cy - w],
      ], { closed: true, extra: f });
      break;
    }
    case 'cross': {
      s = line(cx - r * 0.75, cy - r * 0.75, cx + r * 0.75, cy + r * 0.75) + line(cx - r * 0.75, cy + r * 0.75, cx + r * 0.75, cy - r * 0.75);
      break;
    }
    case 'arrow': {
      // points up before rotation
      const w = r * 0.28;
      s = poly([
        [cx, cy - r], [cx + r * 0.7, cy - r * 0.2], [cx + w, cy - r * 0.2], [cx + w, cy + r],
        [cx - w, cy + r], [cx - w, cy - r * 0.2], [cx - r * 0.7, cy - r * 0.2],
      ], { closed: true, extra: f });
      break;
    }
    case 'halfmoon': s = path(`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} Z`, f); break;
    case 'dot': s = circle(cx, cy, r, solidFill); break;
    default: throw new Error(`unknown shape ${kind}`);
  }
  return rot ? `<g transform="rotate(${rot} ${cx} ${cy})">${s}</g>` : s;
}

// A square figure box (used for choices and sequence cells).
export function box(x, y, size, body = '', { border = true, dashedBorder = false } = {}) {
  const b = border ? rect(x, y, size, size, `${thin}${dashedBorder ? ' stroke-dasharray="4 3"' : ''}`) : '';
  return b + body;
}

// Wraps a single cell's content as its own small SVG (for figure choices).
export function cell(body, label, size = 100) {
  return svg(size, size, rect(1, 1, size - 2, size - 2, thin) + body, label);
}

// Grid of squares; filled is a set of "r,c" strings to shade.
export function gridCells(x, y, n, m, cs, filled = new Set(), { fill = 'solid' } = {}) {
  let out = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < m; c++) {
      const f = filled.has(`${r},${c}`) ? (fill === 'grey' ? greyFill : solidFill) : '';
      out += rect(x + c * cs, y + r * cs, cs, cs, `${thin}${f ? ' ' + f : ''}`);
    }
  }
  return out;
}
