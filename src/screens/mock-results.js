import { go } from '../lib/router.js';
import { tally, pct } from '../lib/session.js';
import { DOMAINS } from '../lib/bank.js';
import { PASS_RATE } from '../config.js';
import { reviewHtml, bindReviewFilters, breakdownPanel } from './parts.js';
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
  <header class="page-head">
    <h1>Mock exam results</h1>
    ${timeUp ? '<p>Time ran out, so your exam was submitted.</p>' : ''}
  </header>
  <section class="panel"><div class="panel-body">
    <div class="score-line">
      <span class="score-big">${correct}<span class="of">/${n}</span></span>
      <span class="score-pct">${p}%</span>
      <span class="pf ${pass ? 'pass' : 'fail'}">${pass ? 'Passed' : 'Not yet passed'}</span>
    </div>
    <p class="score-meta">Pass mark <span class="num">${need}</span><span class="dot-sep">&middot;</span>Time <span class="num">${mins}:${String(secs).padStart(2, '0')}</span>${skipped ? `<span class="dot-sep">&middot;</span>Unanswered <span class="num">${skipped}</span>` : ''}</p>
    <div class="actions">
      <button type="button" class="btn btn-primary" id="again">Try another</button>
      <button type="button" class="btn btn-ghost" id="home">Home</button>
    </div>
  </div></section>
  ${breakdownPanel(groups, 'By domain')}
  ${reviewHtml(rows, { showFlags: true })}`;

  root.querySelector('#again').addEventListener('click', () => go(mockIntro));
  root.querySelector('#home').addEventListener('click', () => go(home));
  bindReviewFilters(root);
}
