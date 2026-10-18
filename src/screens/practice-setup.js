import { go } from '../lib/router.js';
import { loadBank, DOMAINS, domainById } from '../lib/bank.js';
import { escapeHtml } from '../lib/render.js';
import { icons } from '../lib/icons.js';
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
  <header class="page-head">
    <h1>Practice</h1>
    <p>No timer. You see the answer after each item.</p>
  </header>

  <section class="panel"><div class="panel-body">
    <div class="field" role="radiogroup" aria-labelledby="l-domain">
      <div class="field-label" id="l-domain">Domain</div>
      <div class="chips">
        <label class="chip"><input type="radio" name="domain" value="all"><span>All <small>${countOf('all')}</small></span></label>
        ${DOMAINS.map((d) => `<label class="chip"><input type="radio" name="domain" value="${d.id}"><span>${escapeHtml(d.name)} <small>${countOf(d.id)}</small></span></label>`).join('')}
      </div>
    </div>

    <div class="field" id="subs-box" hidden>
      <div class="field-label"><span id="l-subs">Topics</span><button type="button" class="link" id="subs-toggle"></button></div>
      <div class="checks" id="subs" role="group" aria-labelledby="l-subs"></div>
    </div>

    <div class="field" role="radiogroup" aria-labelledby="l-count">
      <div class="field-label" id="l-count">Number of items</div>
      <div class="chips">
        ${PRACTICE_COUNTS.map((c) => `<label class="chip wide"><input type="radio" name="count" value="${c}"><span>${c === 'all' ? 'All' : `<span class="num">${c}</span>`}</span></label>`).join('')}
      </div>
    </div>

    <div class="start-bar">
      <p class="summary" id="summary" aria-live="polite"></p>
      <button type="button" class="btn btn-primary" id="start">Start</button>
    </div>
  </div></section>`;

  const $ = (s) => root.querySelector(s);

  function drawSubs() {
    const box = $('#subs-box');
    box.hidden = state.domain === 'all';
    if (box.hidden) return;
    const d = domainById[state.domain];
    $('#subs').innerHTML = d.subtopics.map((s) => {
      const n = bank.filter((q) => q.domain === d.id && q.subtopic === s).length;
      return `<label class="check"><input type="checkbox" value="${escapeHtml(s)}" ${state.subs.has(s) ? 'checked' : ''}><span class="box">${icons.check(14)}</span><span class="grow">${escapeHtml(s)}</span><span class="num">${n}</span></label>`;
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
    $('#summary').innerHTML = n ? `<span class="num">${want}</span> item${want === 1 ? '' : 's'}` : 'Pick at least one topic.';
    $('#start').disabled = n === 0;
    if (state.domain !== 'all') {
      $('#subs-toggle').textContent = state.subs.size === domainById[state.domain].subtopics.length ? 'Clear all' : 'Select all';
    }
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
  $('#subs-toggle').addEventListener('click', () => {
    const all = domainById[state.domain].subtopics;
    state.subs = state.subs.size === all.length ? new Set() : new Set(all);
    drawSubs();
    update();
  });
  $('#start').addEventListener('click', () => {
    Object.assign(last, { domain: state.domain, subs: [...state.subs], count: state.count });
    const items = buildPractice(pool(), state.count);
    if (items.length) go(practice, items);
  });

  drawSubs();
  update();
}
