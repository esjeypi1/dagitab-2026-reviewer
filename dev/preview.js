// Dev-only page: shows every question with its answer and explanation, in stored order.
// Open http://localhost:5173/dev/preview.html (optional: ?d=math-logic&s=Geometry&id=ML-GEO-001)
import 'katex/dist/katex.min.css';
import '../src/styles/main.css';
import { loadBank, DOMAINS } from '../src/lib/bank.js';
import { questionHtml, explanationHtml } from '../src/screens/parts.js';

const params = new URLSearchParams(location.search);
const app = document.getElementById('app');

loadBank().then((bank) => {
  const items = bank.filter((q) =>
    (!params.get('d') || q.domain === params.get('d'))
    && (!params.get('s') || q.subtopic === params.get('s'))
    && (!params.get('id') || q.id.startsWith(params.get('id'))));
  const nav = DOMAINS.map((d) => `<a href="?d=${d.id}">${d.short}</a>`).join(' | ');
  app.innerHTML = `<p>${nav} | <a href="?">All</a> | ${items.length} items</p>`
    + items.map((q) => {
      const item = { q, order: [0, 1, 2, 3], correct: q.answerIndex };
      return `<section style="margin-bottom:40px">
        <p><code>${q.id}</code></p>
        ${questionHtml(item, { state: (k) => ({ disabled: true, cls: k === q.answerIndex ? 'is-correct' : '' }) })}
        ${explanationHtml(q)}
      </section>`;
    }).join('');
});
