// Pieces shared by the Practice and Mock screens.
import { rich, questionBody, explanationBody, escapeHtml, LETTERS } from '../lib/render.js';
import { domainById } from '../lib/bank.js';
import { isMarkup } from '../lib/markup-rules.js';

const DIFF = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

export function metaLine(q) {
  const d = domainById[q.domain];
  return `<div class="q-meta">
    <span class="tag tag-${q.domain}">${escapeHtml(d ? d.short : q.domain)}</span>
    <span class="tag tag-plain">${escapeHtml(q.subtopic)}</span>
    <span class="tag tag-diff tag-${q.difficulty}">${DIFF[q.difficulty] || ''}</span>
  </div>`;
}

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
    <div class="q-head">${label ? `<span class="q-num">${label}</span>` : ''}${metaLine(item.q)}</div>
    <div class="q-body">${questionBody(item.q)}</div>
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
    const yourLetter = r.pick == null ? 'None' : LETTERS[r.pick];
    const verdict = st === 'correct' ? 'Correct' : st === 'wrong' ? 'Wrong' : 'Skipped';
    return `<div class="review-item" data-status="${st}" data-flagged="${r.flagged ? 1 : 0}">
      <div class="review-top">
        <span class="badge badge-${st}">${verdict}</span>
        ${r.flagged ? '<span class="badge badge-flag">Flagged</span>' : ''}
        <span class="review-ans">Your answer: <b>${yourLetter}</b> &middot; Correct answer: <b>${LETTERS[item.correct]}</b></span>
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
      <h2>Review your answers</h2>
      <div class="chips" role="group" aria-label="Show">
        ${filters.map(([k, l], i) => `<button type="button" class="chip${i === 0 ? ' on' : ''}" data-filter="${k}">${l} (${counts[k]})</button>`).join('')}
      </div>
    </div>
    <div class="review-list">${cards}</div>
  </section>`;
}

export function bindReviewFilters(root) {
  root.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    root.querySelectorAll('[data-filter]').forEach((x) => x.classList.toggle('on', x === b));
    root.querySelectorAll('.review-item').forEach((el) => {
      const show = f === 'all' || (f === 'flagged' ? el.dataset.flagged === '1' : el.dataset.status === f);
      el.hidden = !show;
    });
  }));
}

export function breakdownTable(groups, title) {
  return `<table class="breakdown">
    <thead><tr><th>${escapeHtml(title)}</th><th>Score</th><th class="bar-col">%</th></tr></thead>
    <tbody>${groups.map((g) => {
      const p = g.total ? Math.round((g.correct / g.total) * 100) : 0;
      return `<tr${g.sub ? ' class="sub"' : ''}>
        <td>${escapeHtml(g.label)}</td>
        <td class="num">${g.correct}/${g.total}</td>
        <td class="bar-col"><div class="bar-wrap"><div class="bar" aria-hidden="true"><span style="width:${p}%"></span></div><span class="num">${p}%</span></div></td>
      </tr>`;
    }).join('')}</tbody>
  </table>`;
}
