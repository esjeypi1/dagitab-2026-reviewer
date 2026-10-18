// Re-solves every computable question and checks the keyed answer. Run with: npm run verify
//
// Each domain has a checker file (for example math-logic.verify.js) that exports an object:
//   { 'ML-ALG-001': () => ({ value: 12 }) }          numeric answer; keyed choice must match, no other choice may match
//   { 'ML-BOOL-003': () => ({ index: 2 }) }          index in the JSON "choices" array (before shuffling)
//   { 'TK-PSE-004': () => ({ choice: 'Output: 7' }) } exact text of the correct choice
// Optional: tol (relative tolerance, default 0.005) for value checks.
// Items without a checker are listed as "checked by hand" (reading, concepts, figures).

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseNum, close } from './lib.js';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, '../../src/data');
const meta = JSON.parse(readFileSync(join(dataDir, 'subtopics.json'), 'utf8'));

let failures = 0;
let checked = 0;
let manual = 0;

for (const d of meta.domains) {
  const items = JSON.parse(readFileSync(join(dataDir, d.file), 'utf8'));
  const byId = new Map(items.map((q) => [q.id, q]));
  const checkerFile = join(here, `${d.id}.verify.js`);
  const checkers = existsSync(checkerFile) ? (await import(checkerFile)).default : {};
  const fail = (id, msg) => { failures++; console.log(`  FAIL ${id}: ${msg}`); };

  console.log(`\n${d.name}`);
  for (const id of Object.keys(checkers)) if (!byId.has(id)) fail(id, 'checker exists but no question has this id');

  let domChecked = 0;
  const manualIds = [];
  for (const q of items) {
    const fn = checkers[q.id];
    if (!fn) { manualIds.push(q.id); continue; }
    domChecked++;
    let res;
    try {
      res = fn(q);
    } catch (e) {
      fail(q.id, `checker threw: ${e.message}`);
      continue;
    }
    if ('value' in res) {
      const tol = res.tol ?? 0.005;
      const nums = q.choices.map(parseNum);
      if (Number.isNaN(nums[q.answerIndex])) { fail(q.id, `cannot read a number from the keyed choice "${q.choices[q.answerIndex]}"`); continue; }
      if (!close(nums[q.answerIndex], res.value, tol)) {
        fail(q.id, `computed ${res.value}, but keyed choice is "${q.choices[q.answerIndex]}" (${nums[q.answerIndex]})`);
      }
      nums.forEach((n, k) => {
        if (k !== q.answerIndex && !Number.isNaN(n) && close(n, res.value, tol)) {
          fail(q.id, `distractor "${q.choices[k]}" also matches the computed answer ${res.value}`);
        }
      });
    } else if ('index' in res) {
      if (res.index !== q.answerIndex) fail(q.id, `computed choice ${res.index} ("${q.choices[res.index]}"), but key is ${q.answerIndex}`);
    } else if ('choice' in res) {
      const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
      const k = q.choices.findIndex((c) => norm(c) === norm(res.choice));
      if (k < 0) fail(q.id, `computed answer "${res.choice}" is not among the choices`);
      else if (k !== q.answerIndex) fail(q.id, `computed answer is choice ${k}, but key is ${q.answerIndex}`);
    } else {
      fail(q.id, 'checker must return { value }, { index }, or { choice }');
    }
  }
  checked += domChecked;
  manual += manualIds.length;
  console.log(`  computed checks: ${domChecked}, checked by hand: ${manualIds.length}`);
}

console.log(`\nComputed checks: ${checked}. Checked by hand: ${manual}.`);
if (failures) {
  console.log(`${failures} failure(s).`);
  process.exit(1);
}
console.log('All computed answers match the answer key.');
