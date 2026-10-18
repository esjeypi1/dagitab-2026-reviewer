// Checks the question bank. Run with: npm run validate
// Exits with code 1 if any error is found. Warnings do not fail the run.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import katex from 'katex';
import { XMLValidator, XMLParser } from 'fast-xml-parser';
import { splitMath } from '../src/lib/mathsplit.js';
import { ALLOWED_TAGS, BLOCKED_ATTR, isMarkup } from '../src/lib/markup-rules.js';
import { MOCK_SPLIT, MOCK_TOTAL } from '../src/config.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'src/data');
const meta = JSON.parse(readFileSync(join(dataDir, 'subtopics.json'), 'utf8'));

const MIN_PER_DOMAIN = 50;
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const REQUIRED = ['id', 'domain', 'subtopic', 'difficulty', 'question', 'choices', 'answerIndex', 'explanation'];
const OPTIONAL = ['passage', 'code', 'figure', 'choiceLayout', 'explanationFigure', 'verified'];
const KNOWN = new Set([...REQUIRED, ...OPTIONAL]);

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@', preserveOrder: true });

function checkMath(where, field, text) {
  if (typeof text !== 'string') return;
  for (const part of splitMath(text)) {
    if (part.type === 'unclosed') {
      err(where, `${field} has a "$" with no closing "$" near: ${part.value.slice(0, 40)}`);
    } else if (part.type === 'math') {
      try {
        katex.renderToString(part.value, { displayMode: part.display, throwOnError: true, strict: 'error' });
      } catch (e) {
        err(where, `${field} KaTeX error in "${part.value}": ${e.message.split('\n')[0]}`);
      }
    }
  }
}

function walkTags(nodes, where, field) {
  for (const node of nodes) {
    for (const key of Object.keys(node)) {
      if (key === ':@' || key === '#text') continue;
      if (!ALLOWED_TAGS.has(key.toLowerCase())) err(where, `${field} uses tag <${key}> which is not allowed`);
      const attrs = node[':@'] || {};
      for (const a of Object.keys(attrs)) {
        const name = a.slice(1);
        if (BLOCKED_ATTR.test(name)) err(where, `${field} uses attribute "${name}" which is not allowed`);
      }
      if (Array.isArray(node[key])) walkTags(node[key], where, field);
    }
  }
}

function checkMarkup(where, field, markup) {
  const res = XMLValidator.validate(markup);
  if (res !== true) {
    err(where, `${field} is not well-formed: ${res.err.msg} (line ${res.err.line})`);
    return;
  }
  walkTags(xmlParser.parse(markup), where, field);
  if (/^\s*<svg/i.test(markup)) {
    if (!/viewBox="[^"]+"/.test(markup)) err(where, `${field} SVG needs a viewBox`);
    if (!/aria-label="[^"]+"/.test(markup)) warn(where, `${field} SVG has no aria-label`);
  }
}

function checkText(where, field, value) {
  if (typeof value !== 'string' || !value.trim()) {
    err(where, `${field} must be a non-empty string`);
    return;
  }
  if (value.includes('—')) err(where, `${field} contains an em dash`);
  if (isMarkup(value)) checkMarkup(where, field, value);
  else checkMath(where, field, value);
}

const ids = new Map();
const domainCounts = {};

for (const d of meta.domains) {
  const file = join(dataDir, d.file);
  let items;
  try {
    items = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    err(d.file, `cannot read or parse JSON: ${e.message}`);
    continue;
  }
  if (!Array.isArray(items)) {
    err(d.file, 'top level must be an array of questions');
    continue;
  }

  const perSub = Object.fromEntries(d.subtopics.map((s) => [s, 0]));
  const perDiff = { easy: 0, medium: 0, hard: 0 };

  items.forEach((q, i) => {
    const where = `${d.file}#${i}${q && q.id ? ` (${q.id})` : ''}`;
    if (!q || typeof q !== 'object' || Array.isArray(q)) { err(where, 'item must be an object'); return; }

    for (const k of REQUIRED) if (!(k in q)) err(where, `missing field "${k}"`);
    for (const k of Object.keys(q)) if (!KNOWN.has(k)) err(where, `unknown field "${k}"`);

    // id
    if (typeof q.id !== 'string' || !new RegExp(`^${d.idPrefix}-[A-Z0-9]+-\\d{3}$`).test(q.id)) {
      err(where, `id must look like ${d.idPrefix}-XXX-001`);
    }
    if (ids.has(q.id)) err(where, `duplicate id, also used in ${ids.get(q.id)}`);
    else ids.set(q.id, d.file);

    if (q.domain !== d.id) err(where, `domain must be "${d.id}" in this file`);
    if (!d.subtopics.includes(q.subtopic)) err(where, `subtopic "${q.subtopic}" is not listed for ${d.id} in subtopics.json`);
    else perSub[q.subtopic]++;
    if (!DIFFICULTIES.includes(q.difficulty)) err(where, `difficulty must be one of ${DIFFICULTIES.join(', ')}`);
    else perDiff[q.difficulty]++;

    checkText(where, 'question', q.question);
    if ('passage' in q) checkText(where, 'passage', q.passage);
    checkText(where, 'explanation', q.explanation);
    if ('code' in q && (typeof q.code !== 'string' || !q.code.trim())) err(where, 'code must be a non-empty string');
    if ('code' in q && q.code.includes('—')) err(where, 'code contains an em dash');
    for (const f of ['figure', 'explanationFigure']) {
      if (f in q) {
        if (!isMarkup(q[f])) err(where, `${f} must start with <svg or <table`);
        else checkMarkup(where, f, q[f]);
      }
    }

    // choices
    if (!Array.isArray(q.choices) || q.choices.length !== 4) {
      err(where, 'choices must be an array of exactly 4 items');
    } else {
      q.choices.forEach((c, k) => checkText(where, `choices[${k}]`, c));
      const norm = q.choices.map((c) => String(c).replace(/\s+/g, ' ').trim());
      if (new Set(norm).size !== 4) err(where, 'two or more choices are the same');
      const markupCount = q.choices.filter(isMarkup).length;
      if (markupCount && q.choiceLayout !== 'grid') warn(where, 'figure choices usually look better with "choiceLayout": "grid"');
    }
    if ('choiceLayout' in q && !['list', 'grid'].includes(q.choiceLayout)) err(where, 'choiceLayout must be "list" or "grid"');
    if (!Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex > 3) err(where, 'answerIndex must be 0, 1, 2, or 3');
    if ('verified' in q && typeof q.verified !== 'boolean') err(where, 'verified must be true or false');
    if (q.verified !== true) warn(where, 'not marked "verified": true');

    // Choices are shuffled, so explanations must name a choice by its content, never by its position.
    const pos = /\b(first|second|third|fourth|last)\s+(choice|option)\b|\b(choice|option)\s+[A-D]\b/i;
    if (typeof q.explanation === 'string' && pos.test(q.explanation)) {
      err(where, `explanation refers to a choice by position ("${q.explanation.match(pos)[0]}"), but choices are shuffled`);
    }

    // Choice text must not reveal the answer with "all/none of the above", since choices are shuffled.
    if (Array.isArray(q.choices) && q.choices.some((c) => /\b(all|none|both) of the above\b/i.test(c))) {
      err(where, '"... of the above" choices break when choices are shuffled');
    }
  });

  domainCounts[d.id] = items.length;
  if (items.length < MIN_PER_DOMAIN) err(d.file, `has ${items.length} items, needs at least ${MIN_PER_DOMAIN}`);
  for (const [s, n] of Object.entries(perSub)) if (n === 0) err(d.file, `subtopic "${s}" has no items`);

  console.log(`\n${d.name} (${items.length} items)`);
  console.log(`  difficulty: easy ${perDiff.easy}, medium ${perDiff.medium}, hard ${perDiff.hard}`);
  for (const [s, n] of Object.entries(perSub)) console.log(`  ${String(n).padStart(3)}  ${s}`);
}

// Mock exam split
const splitSum = Object.values(MOCK_SPLIT).reduce((a, b) => a + b, 0);
if (splitSum !== MOCK_TOTAL) err('config.js', `MOCK_SPLIT adds up to ${splitSum}, but MOCK_TOTAL is ${MOCK_TOTAL}`);
for (const [dom, n] of Object.entries(MOCK_SPLIT)) {
  if (!(dom in domainCounts)) err('config.js', `MOCK_SPLIT has unknown domain "${dom}"`);
  else if (n > domainCounts[dom]) err('config.js', `MOCK_SPLIT asks for ${n} items from ${dom}, but it only has ${domainCounts[dom]}`);
}

// No em dashes in UI source files either.
function scanSource(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (name !== 'data') scanSource(p); continue; }
    if (!/\.(js|html|css)$/.test(name)) continue;
    readFileSync(p, 'utf8').split('\n').forEach((line, n) => {
      if (line.includes('—')) err(`${p.replace(root + '/', '')}:${n + 1}`, 'contains an em dash');
    });
  }
}
scanSource(join(root, 'src'));
readFileSync(join(root, 'index.html'), 'utf8').split('\n').forEach((line, n) => {
  if (line.includes('—')) err(`index.html:${n + 1}`, 'contains an em dash');
});

const total = Object.values(domainCounts).reduce((a, b) => a + b, 0);
console.log(`\nTotal: ${total} items`);

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings.slice(0, 50)) console.log('  WARN ' + w);
  if (warnings.length > 50) console.log(`  ... and ${warnings.length - 50} more`);
}
if (errors.length) {
  console.log(`\n${errors.length} error(s):`);
  for (const e of errors) console.log('  ERROR ' + e);
  process.exit(1);
}
console.log('\nAll checks passed.');
