import { go } from '../lib/router.js';
import { tally, pct } from '../lib/session.js';
import { DOMAINS } from '../lib/bank.js';
import { PASS_RATE } from '../config.js';
import { reviewHtml, bindReviewFilters, breakdownTable } from './parts.js';
import { mockIntro } from './mock-intro.js';
import { home } from './home.js';

export function mockResults(root, { items, answers, flags, usedMs, timeUp }) {
  const n = items.length;
  const correct = items.filter((it, i) => answers[i] === it.correct).length;
  const p = pct(correct, n);
  const pass = correct / n >= PASS_RATE;
  const need = Math.ceil(n * PASS_RATE);
  const skipped = answers.filter((a) => a == null).length;
  const mins = Math.floor(usedMs / 60000);
  const secs = Math.floor((usedMs % 60000) / 1000);

  const rows = items.map((item, i) => ({ item, pick: answers[i], flagged: flags.has(i) }));
  const byDomain = tally(rows, (r) => r.item.q.domain, (r) => r.pick === r.item.correct);
  const groups = DOMAINS.map((d) => {
    const t = byDomain.find((g) => g.key === d.id) || { correct: 0, total: 0 };
    return { label: d.name, correct: t.correct, total: t.total };
  }).filter((g) => g.total);

  root.innerHTML = `
  <section class="card result-card ${pass ? 'is-pass' : 'is-fail'}">
    <p class="eyebrow">Mock exam results${timeUp ? ' (time ran out)' : ''}</p>
    <div class="score-row">
      <div class="score-big"><b>${correct}</b><span>/ ${n}</span></div>
      <div>
        <div class="score-pct">${p}% <span class="pf ${pass ? 'pass' : 'fail'}">${pass ? 'PASSED' : 'NOT YET PASSED'}</span></div>
        <p class="muted">Passing score: ${Math.round(PASS_RATE * 100)}% (${need} of ${n}). Time used: ${mins} min ${secs} s.${skipped ? ` Unanswered: ${skipped}.` : ''}</p>
      </div>
    </div>
    <div class="actions">
      <button type="button" class="btn btn-primary" id="again">Take another mock exam</button>
      <button type="button" class="btn btn-ghost" id="home">Home</button>
    </div>
  </section>
  <section class="card"><h2>Score by domain</h2>${breakdownTable(groups, 'Domain')}</section>
  ${reviewHtml(rows, { showFlags: true })}`;

  root.querySelector('#again').addEventListener('click', () => go(mockIntro));
  root.querySelector('#home').addEventListener('click', () => go(home));
  bindReviewFilters(root);
}
