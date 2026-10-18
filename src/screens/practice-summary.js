import { go } from '../lib/router.js';
import { tally, pct } from '../lib/session.js';
import { shuffle } from '../lib/shuffle.js';
import { DOMAINS, domainById } from '../lib/bank.js';
import { PASS_RATE } from '../config.js';
import { reviewHtml, bindReviewFilters, breakdownTable } from './parts.js';
import { practice } from './practice.js';
import { practiceSetup } from './practice-setup.js';
import { home } from './home.js';

export function practiceSummary(root, results, planned) {
  const correct = results.filter((r) => r.pick === r.item.correct).length;
  const total = results.length;
  const p = pct(correct, total);
  const missed = results.filter((r) => r.pick !== r.item.correct).map((r) => r.item.q);

  // Breakdown: domain rows, each followed by its subtopics.
  const groups = [];
  const domains = DOMAINS.filter((d) => results.some((r) => r.item.q.domain === d.id));
  for (const d of domains) {
    const rows = results.filter((r) => r.item.q.domain === d.id);
    const isRight = (r) => r.pick === r.item.correct;
    if (domains.length > 1) {
      const t = tally(rows, () => d.id, isRight)[0];
      groups.push({ label: domainById[d.id].name, correct: t.correct, total: t.total });
    }
    const subs = tally(rows, (r) => r.item.q.subtopic, isRight);
    subs.sort((a, b) => d.subtopics.indexOf(a.key) - d.subtopics.indexOf(b.key));
    for (const s of subs) groups.push({ label: s.key, correct: s.correct, total: s.total, sub: domains.length > 1 });
  }

  const msg = p >= 85 ? 'Excellent work!' : p >= PASS_RATE * 100 ? 'Good job. Keep it up!' : p >= 40 ? 'Nice try. Review the explanations and try again.' : 'Keep practicing. Read each explanation carefully.';

  root.innerHTML = `
  <section class="card result-card">
    <p class="eyebrow">Practice results</p>
    <div class="score-row">
      <div class="score-big"><b>${correct}</b><span>/ ${total}</span></div>
      <div>
        <div class="score-pct">${p}%</div>
        <p class="muted">${msg}${total < planned ? ` You answered ${total} of ${planned} questions.` : ''}</p>
      </div>
    </div>
    <div class="actions">
      ${missed.length ? `<button type="button" class="btn btn-primary" id="retry">Practice the ${missed.length} missed item${missed.length === 1 ? '' : 's'}</button>` : ''}
      <button type="button" class="btn ${missed.length ? 'btn-ghost' : 'btn-primary'}" id="new">New practice set</button>
      <button type="button" class="btn btn-ghost" id="home">Home</button>
    </div>
  </section>
  ${total ? `<section class="card"><h2>Score by subtopic</h2>${breakdownTable(groups, domains.length > 1 ? 'Domain / subtopic' : 'Subtopic')}</section>` : ''}
  ${total ? reviewHtml(results.map((r) => ({ item: r.item, pick: r.pick }))) : ''}`;

  root.querySelector('#retry')?.addEventListener('click', () => go(practice, shuffle(missed)));
  root.querySelector('#new').addEventListener('click', () => go(practiceSetup));
  root.querySelector('#home').addEventListener('click', () => go(home));
  bindReviewFilters(root);
}
