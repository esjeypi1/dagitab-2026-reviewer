import { go, setGuard, setTopbar } from '../lib/router.js';
import { startCountdown, formatTime } from '../lib/timer.js';
import { ask, toast } from '../lib/ui.js';
import { MOCK_MINUTES } from '../config.js';
import { questionHtml } from './parts.js';
import { mockResults } from './mock-results.js';

// items: presented items { q, order, correct } with choice order fixed for the session.
export function mock(root, items) {
  const n = items.length;
  const answers = Array(n).fill(null);
  const flags = new Set();
  let idx = 0;
  let finished = false;
  const started = Date.now();
  const deadline = started + MOCK_MINUTES * 60 * 1000;
  const warned = new Set();
  setGuard(true);

  root.innerHTML = `
    <div class="mock">
      <div class="mock-main">
        <div class="mock-tools">
          <button type="button" class="btn btn-ghost btn-sm nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav">Question list</button>
          <span class="muted" id="answered"></span>
        </div>
        <div id="q"></div>
        <div class="mock-actions">
          <button type="button" class="btn btn-ghost btn-sm" id="flag" aria-pressed="false">Flag</button>
          <button type="button" class="btn btn-ghost btn-sm" id="clear">Clear answer</button>
          <span class="grow"></span>
          <button type="button" class="btn btn-ghost" id="prev">Previous</button>
          <button type="button" class="btn btn-primary" id="next">Next</button>
        </div>
      </div>
      <aside class="mock-nav" id="nav">
        <div class="nav-head">
          <div class="nav-title"><h2>Questions</h2><button type="button" class="btn btn-ghost btn-sm nav-close" id="nav-close">Close</button></div>
          <div class="legend"><span class="lg lg-ans"></span>Answered <span class="lg lg-flag"></span>Flagged <span class="lg lg-empty"></span>Not answered</div>
        </div>
        <div class="nav-grid" id="nav-grid"></div>
        <button type="button" class="btn btn-primary btn-block" id="submit">Submit exam</button>
      </aside>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function drawNav() {
    $('#nav-grid').innerHTML = items.map((_, i) => {
      const cls = [answers[i] != null ? 'ans' : '', flags.has(i) ? 'flag' : '', i === idx ? 'cur' : ''].join(' ');
      const label = `Question ${i + 1}${answers[i] != null ? ', answered' : ', not answered'}${flags.has(i) ? ', flagged' : ''}`;
      return `<button type="button" class="nav-btn ${cls}" data-i="${i}" aria-label="${label}"${i === idx ? ' aria-current="true"' : ''}>${i + 1}</button>`;
    }).join('');
    const done = answers.filter((a) => a != null).length;
    $('#answered').textContent = `${done} of ${n} answered`;
  }

  function show() {
    const item = items[idx];
    $('#q').innerHTML = questionHtml(item, {
      label: `Question ${idx + 1} of ${n}`,
      state: (k) => ({ cls: answers[idx] === k ? 'is-picked' : '', pressed: answers[idx] === k }),
    });
    $('#q').querySelectorAll('.choice').forEach((b) => b.addEventListener('click', () => {
      answers[idx] = Number(b.dataset.k);
      show();
    }));
    $('#flag').textContent = flags.has(idx) ? 'Unflag' : 'Flag';
    $('#flag').setAttribute('aria-pressed', flags.has(idx) ? 'true' : 'false');
    $('#flag').classList.toggle('on', flags.has(idx));
    $('#clear').disabled = answers[idx] == null;
    $('#prev').disabled = idx === 0;
    $('#next').textContent = idx === n - 1 ? 'Review and submit' : answers[idx] == null ? 'Skip' : 'Next';
    drawNav();
  }

  function goTo(i) {
    idx = Math.max(0, Math.min(n - 1, i));
    show();
    closeNav();
    $('#q').scrollIntoView({ block: 'start', behavior: 'instant' });
    window.scrollBy(0, -80);
  }

  function closeNav() {
    $('#nav').classList.remove('open');
    $('#nav-toggle').setAttribute('aria-expanded', 'false');
  }

  async function submit(timeUp = false) {
    if (finished) return;
    if (!timeUp) {
      const left = answers.filter((a) => a == null).length;
      const flagged = flags.size;
      const notes = [
        left ? `<li><b>${left}</b> item${left === 1 ? ' is' : 's are'} not answered. ${left === 1 ? 'It counts' : 'They count'} as wrong.</li>` : '',
        flagged ? `<li><b>${flagged}</b> item${flagged === 1 ? ' is' : 's are'} flagged.</li>` : '',
      ].join('');
      const ok = await ask({
        title: 'Submit your exam?',
        body: notes ? `<ul>${notes}</ul><p>You cannot change your answers after submitting.</p>` : '<p>All items are answered. You cannot change your answers after submitting.</p>',
        buttons: [{ label: 'Keep answering', value: false }, { label: 'Submit', value: true, primary: true }],
      });
      if (!ok || finished) return;
    }
    finished = true;
    stopTimer();
    setGuard(false);
    const dlg = document.getElementById('dialog');
    if (dlg.open) dlg.close();
    go(mockResults, { items, answers, flags, usedMs: Math.min(Date.now(), deadline) - started, timeUp });
    if (timeUp) ask({ title: 'Time is up', body: '<p>Your exam was submitted automatically. Here are your results.</p>' });
  }

  function tick(left) {
    const el = document.getElementById('timer');
    if (el) {
      el.textContent = formatTime(left);
      el.classList.toggle('warn', left <= 10 * 60000 && left > 5 * 60000);
      el.classList.toggle('danger', left <= 5 * 60000);
    }
    for (const m of [10, 5, 1]) {
      if (left <= m * 60000 && left > (m * 60000 - 5000) && !warned.has(m) && MOCK_MINUTES > m) {
        warned.add(m);
        toast(`${m} minute${m === 1 ? '' : 's'} left`);
      }
    }
  }

  setTopbar(`<div class="timer-wrap" aria-label="Time left"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 9v4l2 2M9 2h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span class="timer" id="timer" role="timer">--:--</span></div>`);
  const stopTimer = startCountdown(deadline, tick, () => submit(true));

  $('#prev').addEventListener('click', () => goTo(idx - 1));
  $('#next').addEventListener('click', () => (idx === n - 1 ? submit() : goTo(idx + 1)));
  $('#flag').addEventListener('click', () => {
    if (flags.has(idx)) flags.delete(idx);
    else flags.add(idx);
    show();
  });
  $('#clear').addEventListener('click', () => { answers[idx] = null; show(); });
  $('#submit').addEventListener('click', () => submit());
  $('#nav-close').addEventListener('click', closeNav);
  $('#nav-grid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (b) goTo(Number(b.dataset.i));
  });
  $('#nav-toggle').addEventListener('click', () => {
    const open = $('#nav').classList.toggle('open');
    $('#nav-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  function onKey(e) {
    if (e.target.closest('input, textarea, dialog') || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 }[e.key.toLowerCase()];
    if (k != null) { answers[idx] = k; show(); }
    else if (e.key === 'ArrowRight' && idx < n - 1) goTo(idx + 1);
    else if (e.key === 'ArrowLeft' && idx > 0) goTo(idx - 1);
  }
  document.addEventListener('keydown', onKey);

  show();
  return () => {
    stopTimer();
    document.removeEventListener('keydown', onKey);
  };
}
