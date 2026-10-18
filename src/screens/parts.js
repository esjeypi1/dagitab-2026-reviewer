// Pieces shared by the Practice and Mock screens.
import { rich, questionBody, explanationBody, escapeHtml, LETTERS } from '../lib/render.js';
import { domainById } from '../lib/bank.js';
import { isMarkup } from '../lib/markup-rules.js';

export function metaLine(q) {
  const d = domainById[q.domain];
  return `<div class="q-meta">${escapeHtml(d ? d.short : q.domain)}<span class="dot-sep">&middot;</span>${escapeHtml(q.subtopic)}</div>`;
}

// Short guide to the generic pseudocode, shown under items that have code.
const PSEUDO_HELP = `<details class="pseudo-help">
  <summary>How to read this pseudocode</summary>
  <pre class="code">SET x TO 5          store 5 in x
x &larr; x + 1           same as SET x TO x + 1
INPUT n             read a value into n
OUTPUT x            display x
IF ... THEN ... ELSE ... END IF
WHILE x &lt; 10 DO ... END WHILE
FOR i FROM 1 TO 5 DO ... END FOR    i = 1, 2, 3, 4, 5
REPEAT ... UNTIL x = 0              runs at least once
x MOD y             remainder of x / y
x DIV y             whole part of x / y
AND, OR, NOT        logic
=, &ne;, &lt;, &gt;, &le;, &ge;    comparisons</pre>
</details>`;

const isGrid = (q) => q.choiceLayout === 'grid' || q.choices.some(isMarkup);

// item = { q, order, correct }. state(k) returns extra classes and a note for choice position k.
export function choicesHtml(item, state = () => ({})) {
  const { q, order } = item;
  return `<div class="choices${isGrid(q) ? ' grid' : ''}" role="group" aria-label="Choices">
    ${order.map((ci, k) => {
      const s = state(k);
      return `<button type="button" class="choice ${s.cls || ''}" data-k="${k}" ${s.disabled ? 'disabled' : ''} aria-pressed="${s.pressed ? 'true' : 'false'}">
        <span class="letter">${LETTERS[k]}</span>
        <span class="ctext">${rich(q.choices[ci], { block: false })}</span>
        ${s.note ? `<span class="cnote">${s.note}</span>` : ''}
      </button>`;
    }).join('')}
  </div>`;
}

export function questionHtml(item, { label = '', state } = {}) {
  return `<article class="qcard">
    <div class="q-head">${label ? `<span class="q-num" aria-label="Question ${label}">${label}</span>` : ''}${metaLine(item.q)}</div>
    <div class="q-body">${questionBody(item.q)}${item.q.code ? PSEUDO_HELP : ''}</div>
    ${choicesHtml(item, state)}
  </article>`;
}

export function explanationHtml(q) {
  return `<div class="explain"><h3>Explanation</h3>${explanationBody(q)}</div>`;
}

// Full review list used after practice and after the mock exam.
// rows: [{ item, pick (position or null), flagged }]
export function reviewHtml(rows, { showFlags = false } = {}) {
  const status = (r) => (r.pick == null ? 'skipped' : r.pick === r.item.correct ? 'correct' : 'wrong');
  const counts = { all: rows.length, wrong: 0, skipped: 0, correct: 0, flagged: 0 };
  rows.forEach((r) => { counts[status(r)]++; if (r.flagged) counts.flagged++; });
  const filters = [
    ['all', 'All'], ['wrong', 'Wrong'], ['skipped', 'Skipped'], ['correct', 'Correct'],
    ...(showFlags ? [['flagged', 'Flagged']] : []),
  ].filter(([k]) => k === 'all' || counts[k] > 0);

  const cards = rows.map((r, i) => {
    const st = status(r);
    const { item } = r;
    const yourLetter = r.pick == null ? 'none' : `<span class="num">${LETTERS[r.pick]}</span>`;
    const verdict = st === 'correct' ? 'Correct' : st === 'wrong' ? 'Wrong' : 'Skipped';
    return `<div class="review-item" data-status="${st}" data-flagged="${r.flagged ? 1 : 0}">
      <div class="review-top">
        <span class="badge badge-${st}">${verdict}</span>
        ${r.flagged ? '<span class="badge badge-flag">Flagged</span>' : ''}
        <span class="review-ans">You: ${yourLetter}<span class="dot-sep">&middot;</span>Answer: <span class="num">${LETTERS[item.correct]}</span></span>
      </div>
      ${questionHtml(item, {
        label: `${i + 1}`,
        state: (k) => ({
          disabled: true,
          cls: k === item.correct ? 'is-correct' : k === r.pick ? 'is-wrong' : 'is-dim',
          note: k === item.correct && k === r.pick ? 'Your answer' : k === item.correct ? 'Correct answer' : k === r.pick ? 'Your answer' : '',
        }),
      })}
      ${explanationHtml(item.q)}
    </div>`;
  }).join('');

  return `<section class="review">
    <div class="review-head">
      <h2>Review</h2>
      <div class="chips" role="group" aria-label="Show">
        ${filters.map(([k, l], i) => `<button type="button" class="chip${i === 0 ? ' on' : ''}" data-filter="${k}" aria-pressed="${i === 0}">${l} <small>${counts[k]}</small></button>`).join('')}
      </div>
    </div>
    <div class="review-list">${cards}</div>
  </section>`;
}

export function bindReviewFilters(root) {
  root.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    root.querySelectorAll('[data-filter]').forEach((x) => {
      x.classList.toggle('on', x === b);
      x.setAttribute('aria-pressed', String(x === b));
    });
    root.querySelectorAll('.review-item').forEach((el) => {
      const show = f === 'all' || (f === 'flagged' ? el.dataset.flagged === '1' : el.dataset.status === f);
      el.hidden = !show;
    });
  }));
}

// Score rows inside a panel: label, correct/total, percent.
export function breakdownPanel(groups, title) {
  return `<section class="panel">
    <div class="panel-head"><h2>${escapeHtml(title)}</h2></div>
    ${groups.map((g, i) => {
      const p = g.total ? Math.round((g.correct / g.total) * 100) : 0;
      return `<div class="row row-enter${g.sub ? ' sub' : ''}" style="--i:${i}">
        <span class="grow">${escapeHtml(g.label)}</span>
        <span class="num score-row-frac">${g.correct}/${g.total}</span>
        <span class="num score-row-pct">${p}%</span>
      </div>`;
    }).join('')}
  </section>`;
}
