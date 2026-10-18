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
  <header class="page-head">
    <h1>Mock Exam</h1>
    <p><span class="num">${MOCK_TOTAL}</span> items<span class="dot-sep">&middot;</span><span class="num">${MOCK_MINUTES}</span> minutes<span class="dot-sep">&middot;</span>pass with <span class="num">${need}</span> correct</p>
  </header>
  <section class="panel">
    ${Object.entries(MOCK_SPLIT).map(([d, n], i) => `<div class="row row-enter" style="--i:${i}"><span class="grow">${escapeHtml(domainById[d]?.name || d)}</span><span class="num">${n}</span></div>`).join('')}
  </section>
  <ul class="rules">
    <li>The timer starts when you tap Start. At <span class="num">00:00</span> your exam is submitted.</li>
    <li>You see your score only after you submit. You can skip and flag items.</li>
    <li>No calculators. Do not reload the page, or your exam is lost.</li>
  </ul>
  <div class="actions">
    <button type="button" class="btn btn-primary" id="start">Start exam</button>
    <button type="button" class="btn btn-ghost" id="back">Back</button>
  </div>`;
  root.querySelector('#back').addEventListener('click', () => go(home));
  root.querySelector('#start').addEventListener('click', async () => {
    const bank = await loadBank();
    go(mock, buildMock(bank, MOCK_SPLIT));
  });
}
