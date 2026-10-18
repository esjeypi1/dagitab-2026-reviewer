// Tags and attributes allowed in figures (inline SVG) and truth tables (HTML tables).
// Shared by the app (render.js) and the validator (scripts/validate.js).

export const ALLOWED_TAGS = new Set([
  // SVG
  'svg', 'g', 'path', 'line', 'rect', 'circle', 'ellipse', 'polygon', 'polyline',
  'text', 'tspan', 'title', 'desc',
  // HTML (truth tables and small formatting inside them)
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption', 'b', 'i', 'sub', 'sup', 'span', 'br',
]);

export const BLOCKED_ATTR = /^(on|href$|xlink:href$|src$|style$)/i;

// A string is treated as markup (not plain text) when it starts with one of these tags.
export function isMarkup(str) {
  return typeof str === 'string' && /^\s*<(svg|table)[\s>]/i.test(str);
}
