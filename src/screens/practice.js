import { go, setGuard, setTopbar } from '../lib/router.js';
import { present } from '../lib/session.js';
import { LETTERS } from '../lib/render.js';
import { confirmLeave } from '../lib/ui.js';
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
    setTopbar(`<div class="progress-mini"><span>${Math.min(idx + 1, questions.length)} / ${questions.length}</span><span class="sep"></span><span>Score: ${score()}</span></div>`);
  }

  function show() {
    item = present(questions[idx]); // choices are shuffled every time a question is shown
    answered = false;
    bar();
    root.innerHTML = `
      <div class="runner">
        <div class="progress" aria-hidden="true"><span style="transform:scaleX(${idx / questions.length})"></span></div>
        ${questionHtml(item, { label: `Question ${idx + 1} of ${questions.length}` })}
        <div id="feedback" aria-live="polite"></div>
        <div class="runner-actions">
          <button type="button" class="btn btn-ghost" id="end">End practice</button>
          <button type="button" class="btn btn-primary" id="next" hidden>${idx + 1 < questions.length ? 'Next question' : 'See results'}</button>
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
        <b>${ok ? 'Correct!' : 'Not quite.'}</b>
        ${ok ? '' : `The correct answer is <b>${LETTERS[item.correct]}</b>.`}
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
