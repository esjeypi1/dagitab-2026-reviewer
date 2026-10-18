import katex from 'katex';
import { ALLOWED_TAGS, BLOCKED_ATTR, isMarkup } from './markup-rules.js';
import { splitMath } from './mathsplit.js';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

// Plain text formatting: `code`, **bold**, line breaks.
function formatPlain(s) {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// A bare number in math ($10$, $-2.5$) is set in the mono numeral face, like every other number on the site.
const BARE_NUMBER = /^-?\d+(\.\d+)?$/;

// Renders one paragraph: text with $inline$ and $$display$$ math.
function renderInline(src) {
  return splitMath(src)
    .map((p) => {
      if (p.type !== 'math') return formatPlain(p.value);
      if (!p.display && BARE_NUMBER.test(p.value.trim())) return `<span class="mnum">${escapeHtml(p.value.trim())}</span>`;
      return katex.renderToString(p.value, { displayMode: p.display, throwOnError: false, output: 'html' });
    })
    .join('');
}

// Renders one paragraph. Lines that start with "- " become a list.
function renderBlock(src) {
  const out = [];
  let text = [];
  let list = [];
  const flushText = () => { if (text.length) out.push(`<p>${renderInline(text.join('\n'))}</p>`); text = []; };
  const flushList = () => { if (list.length) out.push(`<ul>${list.map((li) => `<li>${renderInline(li)}</li>`).join('')}</ul>`); list = []; };
  for (const line of src.split('\n')) {
    const m = line.match(/^\s*-\s+(.*)$/);
    if (m) { flushText(); list.push(m[1]); }
    else { flushList(); text.push(line); }
  }
  flushText();
  flushList();
  return out.join('');
}

// Removes anything outside the whitelist from figure markup.
export function sanitizeMarkup(markup) {
  const tpl = document.createElement('template');
  tpl.innerHTML = markup;
  const walk = (node) => {
    for (const el of [...node.children]) {
      const tag = el.localName.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) { el.remove(); continue; }
      for (const attr of [...el.attributes]) {
        if (BLOCKED_ATTR.test(attr.name)) el.removeAttribute(attr.name);
      }
      walk(el);
    }
  };
  walk(tpl.content);
  return tpl.innerHTML;
}

// Turns a question field into HTML. Handles plain text with math, or a figure.
export function rich(text, { block = true } = {}) {
  if (text == null || text === '') return '';
  if (isMarkup(text)) return `<div class="figure">${sanitizeMarkup(text)}</div>`;
  if (!block) return renderInline(text);
  return String(text)
    .split(/\n\s*\n/)
    .map((p) => renderBlock(p.trim()))
    .join('');
}

// Renders the parts of a question above the choices.
export function questionBody(q) {
  let html = '';
  if (q.passage) html += `<div class="passage">${rich(q.passage)}</div>`;
  html += `<div class="stem">${rich(q.question)}</div>`;
  if (q.code) html += `<pre class="code">${escapeHtml(q.code)}</pre>`;
  if (q.figure) html += rich(q.figure);
  return html;
}

export function explanationBody(q) {
  let html = rich(q.explanation);
  if (q.explanationFigure) html += rich(q.explanationFigure);
  return html;
}

export const LETTERS = ['A', 'B', 'C', 'D'];
