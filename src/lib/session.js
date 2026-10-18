import { shuffle, drawSpread } from './shuffle.js';

// Wraps a question with a shuffled choice order.
// order[k] = index in q.choices of the choice shown at position k.
export function present(q) {
  const order = shuffle([0, 1, 2, 3]);
  return { q, order, correct: order.indexOf(q.answerIndex) };
}

export function buildPractice(pool, count) {
  const n = count === 'all' ? pool.length : Math.min(count, pool.length);
  return drawSpread(pool, n, [(q) => q.domain, (q) => q.subtopic]);
}

// Draws the mock exam using the per-domain split. Each domain's items are spread over its subtopics.
export function buildMock(bank, split) {
  const picked = [];
  for (const [domain, n] of Object.entries(split)) {
    const pool = bank.filter((q) => q.domain === domain);
    picked.push(...drawSpread(pool, n, [(q) => q.subtopic]));
  }
  // Choice order is fixed once per mock session so it stays the same while moving around and in the review.
  return shuffle(picked).map(present);
}

// Groups results by a key. Returns [{ key, correct, total }] in first-seen order.
export function tally(rows, keyOf, isCorrect) {
  const map = new Map();
  for (const r of rows) {
    const k = keyOf(r);
    if (!map.has(k)) map.set(k, { key: k, correct: 0, total: 0 });
    const t = map.get(k);
    t.total++;
    if (isCorrect(r)) t.correct++;
  }
  return [...map.values()];
}

export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
