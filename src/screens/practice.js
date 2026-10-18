import { go, setGuard, setTopbar } from '../lib/router.js';
import { present } from '../lib/session.js';
import { LETTERS } from '../lib/render.js';
import { confirmLeave } from '../lib/ui.js';
import { icons } from '../lib/icons.js';
import { questionHtml, explanationHtml } from './parts.js';
import { practiceSummary } from './practice-summary.js';
import { practiceSetup } from './practice-setup.js';

// questions: array of question objects, already shuffled.
export function practice(root, questions) {
  const results = []; // { item, pick }
  let idx = 0;
  let item = null;
  let answered = false;
  setGuard(true);

  const score = () => results.filter((r) => r.pick === r.item.correct).length;

  function bar() {
    setTopbar(`<span><span class="num">${Math.min(idx + 1, questions.length)}</span> of <span class="num">${questions.length}</span></span><span>Score <span class="num">${score()}</span></span>`);
  }

  function show() {
    item = present(questions[idx]); // choices are shuffled every time a question is shown
    answered = false;
    bar();
    root.innerHTML = `
      <div class="runner">
        <div class="progress" aria-hidden="true"><span style="transform:scaleX(${idx / questions.length})"></span></div>
        ${questionHtml(item, { label: `${idx + 1}` })}
        <div id="feedback" aria-live="polite"></div>
        <div class="runner-actions">
          <button type="button" class="btn btn-ghost" id="end">End</button>
          <button type="button" class="btn btn-primary" id="next" hidden>${idx + 1 < questions.length ? 'Next' : 'See results'}</button>
        </div>
      </div>`;
    root.querySelectorAll('.choice').forEach((b) => b.addEventListener('click', () => pick(Number(b.dataset.k))));
    root.querySelector('#next').addEventListener('click', next);
    root.querySelector('#end').addEventListener('click', end);
  }

  function pick(k) {
    if (answered) return;
    answered = true;
    results.push({ item, pick: k });
    const ok = k === item.correct;
    root.querySelectorAll('.choice').forEach((b) => {
      const j = Number(b.dataset.k);
      b.disabled = true;
      if (j === item.correct) b.classList.add('is-correct');
      else if (j === k) b.classList.add('is-wrong');
      else b.classList.add('is-dim');
      if (j === k) b.setAttribute('aria-pressed', 'true');
    });
    root.querySelector('#feedback').innerHTML = `
      <div class="verdict ${ok ? 'ok' : 'no'}">
        ${ok ? icons.check() : icons.x()}
        <span>${ok ? 'Correct' : `Not quite. <span class="muted">The answer is <span class="num">${LETTERS[item.correct]}</span>.</span>`}</span>
      </div>
      ${explanationHtml(item.q)}`;
    bar();
    const nextBtn = root.querySelector('#next');
    nextBtn.hidden = false;
    nextBtn.focus({ preventScroll: true });
  }

  function next() {
    idx++;
    if (idx >= questions.length) finish();
    else {
      show();
      window.scrollTo({ top: 0 });
    }
  }

  async function end() {
    if (!results.length) {
      if (await confirmLeave()) { setGuard(false); go(practiceSetup); }
      return;
    }
    finish();
  }

  function finish() {
    setGuard(false);
    go(practiceSummary, results, questions.length);
  }

  function onKey(e) {
    if (e.target.closest('input, textarea, dialog')) return;
    const k = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 }[e.key.toLowerCase()];
    if (k != null && !answered && !e.ctrlKey && !e.metaKey && !e.altKey) { pick(k); return; }
    if ((e.key === 'Enter' || e.key === 'ArrowRight') && answered && document.activeElement?.id !== 'next') { e.preventDefault(); next(); }
  }
  document.addEventListener('keydown', onKey);

  show();
  return () => document.removeEventListener('keydown', onKey);
}
