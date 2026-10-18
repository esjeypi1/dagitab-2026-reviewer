// Flowchart symbols. Each takes a center point, width, height and text (use \n for line breaks).
import { rect, poly, text } from './svg.js';

const T = (cx, cy, s, size) => text(cx, cy, s, { size, mono: false });

export const terminal = (cx, cy, w, h, s, size = 13) =>
  rect(cx - w / 2, cy - h / 2, w, h, `rx="${h / 2}"`) + T(cx, cy, s, size);

export const process = (cx, cy, w, h, s, size = 13) => rect(cx - w / 2, cy - h / 2, w, h) + T(cx, cy, s, size);

export const decision = (cx, cy, w, h, s, size = 13) =>
  poly([[cx, cy - h / 2], [cx + w / 2, cy], [cx, cy + h / 2], [cx - w / 2, cy]], { closed: true }) + T(cx, cy, s, size);

export const io = (cx, cy, w, h, s, size = 13) => {
  const k = 12;
  return poly([[cx - w / 2 + k, cy - h / 2], [cx + w / 2 + k, cy - h / 2], [cx + w / 2 - k, cy + h / 2], [cx - w / 2 - k, cy + h / 2]], { closed: true })
    + T(cx, cy, s, size);
};

export const label = (x, y, s, anchor = 'middle') => text(x, y, s, { size: 12, anchor, weight: 'bold' });
