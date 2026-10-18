import { go } from '../lib/router.js';
import { icons } from '../lib/icons.js';
import { MOCK_TOTAL, MOCK_MINUTES, PASS_RATE } from '../config.js';
import { practiceSetup } from './practice-setup.js';
import { mockIntro } from './mock-intro.js';

export function home(root) {
  root.innerHTML = `
  <header class="page-head home">
    <h1>Dagitab 2026 Reviewer</h1>
    <p><span class="num">${MOCK_TOTAL}</span> items<span class="dot-sep">&middot;</span><span class="num">${MOCK_MINUTES}</span> minutes<span class="dot-sep">&middot;</span><span class="num">${Math.round(PASS_RATE * 100)}%</span> to pass</p>
  </header>

  <nav class="panel" aria-label="Choose a mode">
    <button class="mode-row row-enter" style="--i:0" id="go-practice" type="button">
      <span class="mode-icon">${icons.practice()}</span>
      <span class="grow">
        <span class="mode-title">Practice</span>
        <span class="mode-desc">No timer. Pick a topic and learn from each answer.</span>
      </span>
      <span class="chev">${icons.chevron()}</span>
    </button>
    <button class="mode-row row-enter" style="--i:1" id="go-mock" type="button">
      <span class="mode-icon">${icons.clock()}</span>
      <span class="grow">
        <span class="mode-title">Mock Exam</span>
        <span class="mode-desc">${MOCK_TOTAL} items, ${MOCK_MINUTES} minutes, just like the real one.</span>
      </span>
      <span class="chev">${icons.chevron()}</span>
    </button>
  </nav>

  <p class="note">No calculators. Nothing is saved, so every visit starts fresh.</p>`;

  root.querySelector('#go-practice').addEventListener('click', () => go(practiceSetup));
  root.querySelector('#go-mock').addEventListener('click', () => go(mockIntro));
}
