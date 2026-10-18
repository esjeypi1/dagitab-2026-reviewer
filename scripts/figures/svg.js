// Basic SVG building blocks. Every figure uses currentColor so it works in light and dark mode.
// These helpers are for authoring: they return SVG strings that you paste into the question JSON.

const r2 = (n) => Math.round(n * 100) / 100;

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function svg(w, h, body, label, { pad = 0 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${w + 2 * pad} ${h + 2 * pad}" width="${w + 2 * pad}" height="${h + 2 * pad}" role="img" aria-label="${esc(label)}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

export function line(x1, y1, x2, y2, extra = '') {
  return `<line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}"${extra ? ' ' + extra : ''}/>`;
}

export function poly(points, { closed = false, extra = '' } = {}) {
  const pts = points.map(([x, y]) => `${r2(x)},${r2(y)}`).join(' ');
  return `<${closed ? 'polygon' : 'polyline'} points="${pts}"${extra ? ' ' + extra : ''}/>`;
}

export function circle(cx, cy, r, extra = '') {
  return `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}"${extra ? ' ' + extra : ''}/>`;
}

export function rect(x, y, w, h, extra = '') {
  return `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}"${extra ? ' ' + extra : ''}/>`;
}

export function path(d, extra = '') {
  return `<path d="${d}"${extra ? ' ' + extra : ''}/>`;
}

// Text. Lines separated by \n are stacked.
export function text(x, y, str, { size = 14, anchor = 'middle', weight = 'normal', italic = false, mono = false } = {}) {
  const lines = String(str).split('\n');
  const lh = size * 1.2;
  const y0 = y - ((lines.length - 1) * lh) / 2;
  const attrs = `font-size="${size}" text-anchor="${anchor}" dominant-baseline="central" fill="currentColor" stroke="none"`
    + (weight !== 'normal' ? ` font-weight="${weight}"` : '')
    + (italic ? ' font-style="italic"' : '')
    + (mono ? ' font-family="ui-monospace, Menlo, Consolas, monospace"' : '');
  if (lines.length === 1) return `<text x="${r2(x)}" y="${r2(y)}" ${attrs}>${esc(str)}</text>`;
  return `<text x="${r2(x)}" y="${r2(y0)}" ${attrs}>${lines
    .map((l, i) => `<tspan x="${r2(x)}" y="${r2(y0 + i * lh)}">${esc(l)}</tspan>`)
    .join('')}</text>`;
}

// Filled arrowhead pointing from (x1,y1) toward (x2,y2), tip at (x2,y2).
export function arrowHead(x1, y1, x2, y2, size = 8) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p1 = [x2 - size * Math.cos(a - 0.45), y2 - size * Math.sin(a - 0.45)];
  const p2 = [x2 - size * Math.cos(a + 0.45), y2 - size * Math.sin(a + 0.45)];
  return poly([[x2, y2], p1, p2], { closed: true, extra: 'fill="currentColor" stroke-width="1"' });
}

// Polyline with an arrowhead at the end.
export function arrow(points, { size = 8, extra = '' } = {}) {
  const [x1, y1] = points[points.length - 2];
  const [x2, y2] = points[points.length - 1];
  return poly(points, { extra }) + arrowHead(x1, y1, x2, y2, size);
}

export const dashed = 'stroke-dasharray="5 4"';
export const thin = 'stroke-width="1"';
export const solidFill = 'fill="currentColor"';
export const greyFill = 'fill="currentColor" fill-opacity="0.35"';
