import { go } from '../lib/router.js';
import { loadBank, DOMAINS, domainById } from '../lib/bank.js';
import { escapeHtml } from '../lib/render.js';
import { buildPractice } from '../lib/session.js';
import { PRACTICE_COUNTS } from '../config.js';
import { practice } from './practice.js';

// Remembers the last choices only while the page is open (not saved anywhere).
const last = { domain: 'all', subs: null, count: 10 };

export function practiceSetup(root) {
  root.innerHTML = '<p class="loading">Loading questions...</p>';
  loadBank().then((bank) => render(root, bank));
}

function render(root, bank) {
  const state = { domain: last.domain, subs: new Set(last.subs || []), count: last.count };
  const countOf = (dom) => (dom === 'all' ? bank.length : bank.filter((q) => q.domain === dom).length);
  if (state.domain !== 'all' && !state.subs.size) state.subs = new Set(domainById[state.domain].subtopics);

  const pool = () => bank.filter((q) => state.domain === 'all' || (q.domain === state.domain && state.subs.has(q.subtopic)));

  root.innerHTML = `
  <section class="card setup">
    <h1>Practice</h1>
    <p class="muted">No timer. You get feedback and an explanation after every answer.</p>

    <fieldset>
      <legend>1. Choose a domain</legend>
      <div class="options" id="domains">
        <label class="opt"><input type="radio" name="domain" value="all"><span>All domains <small>${countOf('all')}</small></span></label>
        ${DOMAINS.map((d) => `<label class="opt"><input type="radio" name="domain" value="${d.id}"><span>${escapeHtml(d.name)} <small>${countOf(d.id)}</small></span></label>`).join('')}
      </div>
    </fieldset>

    <fieldset id="subs-box" hidden>
      <legend>2. Choose subtopics <span class="muted">(optional)</span></legend>
      <div class="sub-actions">
        <button type="button" class="link" id="subs-all">Select all</button>
        <button type="button" class="link" id="subs-none">Clear</button>
      </div>
      <div class="options subs" id="subs"></div>
    </fieldset>

    <fieldset>
      <legend id="count-legend">2. How many questions?</legend>
      <div class="options counts" id="counts">
        ${PRACTICE_COUNTS.map((c) => `<label class="opt opt-sm"><input type="radio" name="count" value="${c}"><span>${c === 'all' ? 'All' : c}</span></label>`).join('')}
      </div>
    </fieldset>

    <p class="summary" id="summary" aria-live="polite"></p>
    <div class="actions">
      <button type="button" class="btn btn-primary btn-lg" id="start">Start practice</button>
    </div>
  </section>`;

  const $ = (s) => root.querySelector(s);

  function drawSubs() {
    const box = $('#subs-box');
    if (state.domain === 'all') {
      box.hidden = true;
      $('#count-legend').textContent = '2. How many questions?';
      return;
    }
    box.hidden = false;
    $('#count-legend').textContent = '3. How many questions?';
    const d = domainById[state.domain];
    $('#subs').innerHTML = d.subtopics.map((s) => {
      const n = bank.filter((q) => q.domain === d.id && q.subtopic === s).length;
      return `<label class="opt opt-check"><input type="checkbox" value="${escapeHtml(s)}" ${state.subs.has(s) ? 'checked' : ''}><span>${escapeHtml(s)} <small>${n}</small></span></label>`;
    }).join('');
    $('#subs').querySelectorAll('input').forEach((inp) => inp.addEventListener('change', () => {
      if (inp.checked) state.subs.add(inp.value);
      else state.subs.delete(inp.value);
      update();
    }));
  }

  function update() {
    const n = pool().length;
    const want = state.count === 'all' ? n : Math.min(state.count, n);
    $('#summary').innerHTML = n
      ? `You will get <b>${want}</b> question${want === 1 ? '' : 's'} from <b>${n}</b> available.`
      : 'Choose at least one subtopic.';
    $('#start').disabled = n === 0;
  }

  root.querySelectorAll('input[name=domain]').forEach((inp) => {
    inp.checked = inp.value === state.domain;
    inp.addEventListener('change', () => {
      state.domain = inp.value;
      state.subs = new Set(state.domain === 'all' ? [] : domainById[state.domain].subtopics);
      drawSubs();
      update();
    });
  });
  root.querySelectorAll('input[name=count]').forEach((inp) => {
    inp.checked = String(state.count) === inp.value;
    inp.addEventListener('change', () => {
      state.count = inp.value === 'all' ? 'all' : Number(inp.value);
      update();
    });
  });
  $('#subs-all').addEventListener('click', () => { state.subs = new Set(domainById[state.domain].subtopics); drawSubs(); update(); });
  $('#subs-none').addEventListener('click', () => { state.subs.clear(); drawSubs(); update(); });
  $('#start').addEventListener('click', () => {
    Object.assign(last, { domain: state.domain, subs: [...state.subs], count: state.count });
    const items = buildPractice(pool(), state.count);
    if (items.length) go(practice, items);
  });

  drawSubs();
  update();
}
