import { go } from '../lib/router.js';
import { loadBank, domainById } from '../lib/bank.js';
import { buildMock } from '../lib/session.js';
import { escapeHtml } from '../lib/render.js';
import { MOCK_SPLIT, MOCK_TOTAL, MOCK_MINUTES, PASS_RATE } from '../config.js';
import { mock } from './mock.js';
import { home } from './home.js';

export function mockIntro(root) {
  const need = Math.ceil(MOCK_TOTAL * PASS_RATE);
  root.innerHTML = `
  <section class="card setup">
    <p class="eyebrow">Mock exam</p>
    <h1>${MOCK_TOTAL} items, ${MOCK_MINUTES} minutes</h1>
    <p class="muted">This works like the real qualifying exam. Find a quiet place and keep a pen and scratch paper ready. Calculators are not allowed.</p>
    <table class="breakdown split">
      <thead><tr><th>Domain</th><th>Items</th></tr></thead>
      <tbody>${Object.entries(MOCK_SPLIT).map(([d, n]) => `<tr><td>${escapeHtml(domainById[d]?.name || d)}</td><td class="num">${n}</td></tr>`).join('')}</tbody>
    </table>
    <h2>Rules</h2>
    <ul class="tips">
      <li>The timer starts when you press <b>Start exam</b>. When it reaches 00:00, your exam is submitted automatically.</li>
      <li>You will not see if your answers are right until you submit.</li>
      <li>You can skip items, flag items to check later, and jump to any item using the question list.</li>
      <li>To pass, you need at least <b>${Math.round(PASS_RATE * 100)}%</b> (${need} of ${MOCK_TOTAL} correct). Unanswered items count as wrong.</li>
      <li>Do not reload or close the page. Nothing is saved, so your exam would be lost.</li>
    </ul>
    <div class="actions">
      <button type="button" class="btn btn-primary btn-lg" id="start">Start exam</button>
      <button type="button" class="btn btn-ghost" id="back">Back</button>
    </div>
  </section>`;
  root.querySelector('#back').addEventListener('click', () => go(home));
  root.querySelector('#start').addEventListener('click', async () => {
    const bank = await loadBank();
    go(mock, buildMock(bank, MOCK_SPLIT));
  });
}
