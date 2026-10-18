import { go } from '../lib/router.js';
import { loadBank, DOMAINS } from '../lib/bank.js';
import { escapeHtml } from '../lib/render.js';
import { MOCK_TOTAL, MOCK_MINUTES, PASS_RATE } from '../config.js';
import { practiceSetup } from './practice-setup.js';
import { mockIntro } from './mock-intro.js';

export function home(root) {
  root.innerHTML = `
  <section class="hero">
    <p class="eyebrow">Free reviewer for SHS students</p>
    <h1>Get ready for the Dagitab 2026 qualifying exam</h1>
    <p class="lead">Practice by topic with instant explanations, or take a timed mock exam that works like the real one.</p>
    <ul class="facts" aria-label="About the real exam">
      <li><b>${MOCK_TOTAL}</b><span>items</span></li>
      <li><b>${MOCK_MINUTES}</b><span>minutes</span></li>
      <li><b>${Math.round(PASS_RATE * 100)}%</b><span>to pass</span></li>
      <li><b>4</b><span>domains</span></li>
    </ul>
  </section>

  <section class="modes">
    <button class="mode-card" id="go-practice" type="button">
      <span class="mode-kicker">Main mode</span>
      <span class="mode-title">Practice</span>
      <span class="mode-desc">No timer. Choose a domain or subtopic, answer one item at a time, and see the explanation right away.</span>
      <span class="mode-cta">Start practicing <span aria-hidden="true">&rarr;</span></span>
    </button>
    <button class="mode-card mode-mock" id="go-mock" type="button">
      <span class="mode-kicker">Exam simulation</span>
      <span class="mode-title">Mock Exam</span>
      <span class="mode-desc">${MOCK_TOTAL} items from all four domains with a ${MOCK_MINUTES}-minute timer. You see your score and the answers at the end.</span>
      <span class="mode-cta">Take the mock exam <span aria-hidden="true">&rarr;</span></span>
    </button>
  </section>

  <section class="card">
    <h2>What the exam covers</h2>
    <div class="domains" id="domains">
      ${DOMAINS.map((d) => `
        <div class="domain">
          <h3><span class="dot dot-${d.id}" aria-hidden="true"></span>${escapeHtml(d.name)} <small data-count="${d.id}"></small></h3>
          <p>${d.subtopics.map(escapeHtml).join(', ')}</p>
        </div>`).join('')}
    </div>
  </section>

  <section class="card">
    <h2>Before you start</h2>
    <ul class="tips">
      <li>Calculators are not allowed, just like in the real exam. Every item can be solved with pen and scratch paper.</li>
      <li>Questions and choices are shuffled every time, so each session is different.</li>
      <li>Nothing is saved. If you reload or close the page, your session ends.</li>
    </ul>
    <details class="pseudo">
      <summary>How to read the pseudocode in this reviewer</summary>
      <pre class="code">SET x TO 5            store 5 in x
x &larr; x + 1             same as SET x TO x + 1
INPUT n               read a value into n
OUTPUT x              display the value of x
IF x &gt; 3 THEN ... ELSE ... END IF
WHILE x &lt; 10 DO ... END WHILE
FOR i FROM 1 TO 5 DO ... END FOR      i takes 1, 2, 3, 4, 5
REPEAT ... UNTIL x = 0                runs at least once
x MOD y               remainder when x is divided by y
x DIV y               whole-number part of x divided by y
AND, OR, NOT          logical operators
=, &ne;, &lt;, &gt;, &le;, &ge;      comparisons</pre>
    </details>
  </section>`;

  root.querySelector('#go-practice').addEventListener('click', () => go(practiceSetup));
  root.querySelector('#go-mock').addEventListener('click', () => go(mockIntro));

  loadBank().then((bank) => {
    for (const d of DOMAINS) {
      const el = root.querySelector(`[data-count="${d.id}"]`);
      if (el) el.textContent = `${bank.filter((q) => q.domain === d.id).length} items`;
    }
  });
}
