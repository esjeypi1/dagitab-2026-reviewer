# Dagitab 2026 Reviewer

A free, public practice website for senior high school students preparing for the **Dagitab 2026 qualifying exam**.
It is an unofficial reviewer and is not affiliated with or endorsed by the UP Engineering Radio Guild.

- **Practice mode:** untimed, filter by domain and subtopic, instant feedback with a worked explanation, score breakdown at the end.
- **Mock exam mode:** 50 items, 60-minute countdown, auto-submits at 00:00, skip/flag/jump between items, full review at the end.
- **470 questions** in four domains (Mathematics and Logic, Physics and Circuits, Technical Knowledge, Abstract Reasoning). All are solvable without a calculator.
- Static site: no backend, no accounts, no cookies, no localStorage. Every visit starts fresh.

Built with [Vite](https://vite.dev) and plain JavaScript (no framework), with [KaTeX](https://katex.org) for math.

---

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the site into the `dist/` folder |
| `npm run preview` | Serves the built `dist/` folder to test it |
| `npm run validate` | Checks the question files (see below) |
| `npm run verify` | Re-solves every computable question and compares with the answer key |
| `npm run check` | Runs `validate` and then `verify` |

While `npm run dev` is running, open **http://localhost:5173/dev/preview.html** to see every question with its
answer and explanation. You can filter it: `?d=physics-circuits`, `?s=Geometry`, or `?id=ML-GEO` (id prefix).
This page is for checking questions only and is **not** included in the deployed site.

---

## Deploy to Vercel

**Option A: from GitHub (easiest)**

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com/new and import the repository.
3. Vercel detects Vite automatically (build command `npm run build`, output folder `dist`). Click **Deploy**.

Every push to the main branch redeploys the site.

**Option B: with the Vercel CLI**

```bash
npm install -g vercel
vercel          # first time: log in and link the project; makes a preview deployment
vercel --prod   # deploys to your production URL
```

`vercel.json` already sets the framework, build command, output folder, and long-term caching for the built assets.

---

## Change the mock exam split

Open `src/config.js`:

```js
export const MOCK_SPLIT = {
  'math-logic': 13,
  'physics-circuits': 13,
  'technical-knowledge': 12,
  'abstract-reasoning': 12,
};
export const MOCK_TOTAL = 50;
export const MOCK_MINUTES = 60;
export const PASS_RATE = 0.6;
```

The four numbers must add up to `MOCK_TOTAL`, and no domain can ask for more items than it has.
`npm run validate` checks both. Within each domain, the mock exam spreads its items across the subtopics.

---

## Add or edit questions

Questions live in `src/data/`, one JSON file per domain:

| File | Domain | id prefix |
| --- | --- | --- |
| `math-logic.json` | Mathematics and Logic | `ML` |
| `physics-circuits.json` | Physics and Circuits | `PC` |
| `technical-knowledge.json` | Technical Knowledge | `TK` |
| `abstract-reasoning.json` | Abstract Reasoning | `AR` |

The list of subtopics for each domain is in `src/data/subtopics.json`. A question's `subtopic` must match one of them exactly.

### Question format

```json
{
  "id": "PC-OHM-007",
  "domain": "physics-circuits",
  "subtopic": "Ohm's Law",
  "difficulty": "medium",
  "question": "A $6\\ \\Omega$ resistor carries 2 A. What is the voltage across it?",
  "choices": ["$12$ V", "$3$ V", "$8$ V", "$0.33$ V"],
  "answerIndex": 0,
  "explanation": "$V = IR = 2 \\times 6 = 12$ V. The choice $3$ V divides instead of multiplying.",
  "verified": true
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | `PREFIX-CODE-NNN`, for example `ML-GEO-007`. Must be unique. |
| `domain` | yes | Must match the file it is in. |
| `subtopic` | yes | Must be listed in `subtopics.json` for that domain. |
| `difficulty` | yes | `easy`, `medium`, or `hard`. |
| `question` | yes | The question text. Supports math (see below). |
| `choices` | yes | Exactly 4. Text, math, or an SVG figure. |
| `answerIndex` | yes | 0, 1, 2, or 3: the position of the correct choice **in this file**. |
| `explanation` | yes | Worked solution shown after answering. |
| `passage` | no | Reading passage shown above the question. Blank lines separate paragraphs. |
| `code` | no | Pseudocode shown in a monospace box, exactly as typed. |
| `figure` | no | An inline `<svg>` or a `<table>` (for truth tables) shown under the question. |
| `choiceLayout` | no | `"grid"` shows the 4 choices as a 2 by 2 grid (use it for figure choices). |
| `explanationFigure` | no | An optional figure shown inside the explanation. |
| `verified` | no | Set to `true` after you have solved the question yourself. Unverified items give a warning. |

**Choices are shuffled** every time a question is shown, so the app tracks the right answer for you.
Because of this:

- Never write "all of the above" or "none of the above". The validator rejects these.
- In explanations, describe a choice by its **content** ("The choice $3$ V divides instead..."), never by its
  position ("the last choice", "choice B"). The validator rejects positional wording.

### Writing math

- Inline math: `$...$`. Display math on its own line: `$$...$$`.
- In JSON every backslash is doubled: write `"$\\frac{1}{2}$"` to get $\frac{1}{2}$.
- Units: `$4.7\\text{ k}\\Omega$`, `$9.8\\text{ m/s}^2$`.
- A literal dollar sign is `\\$`. Keep the peso sign `₱` **outside** math (KaTeX cannot draw it).
- Text formatting outside math: `**bold**` and `` `code` ``.
- Do not use em dashes (the validator checks).
- Students may **not** use calculators: keep numbers friendly (exact trig angles, perfect squares, simple fractions).

### Figures

Figures are inline SVG strings. Rules the validator enforces:

- Must be well-formed XML and include a `viewBox`. Add an `aria-label` describing the figure for screen readers.
- Allowed tags: `svg g path line rect circle ellipse polygon polyline text tspan title desc` and, for truth tables,
  `table thead tbody tr th td caption b i sub sup span br`.
- No scripts, event handlers, links, or `style` attributes.
- Use `stroke="currentColor"` and `fill="currentColor"` (not fixed colors) so figures work in light and dark mode.

Helper functions in `scripts/figures/` draw consistent circuit parts (ANSI resistors, batteries, lamps, meters),
logic gates, flowchart symbols, and abstract-reasoning shapes. Example that prints a figure string ready to paste:

```bash
node -e "import('./scripts/figures/index.js').then(({ svg, circuits }) => {
  const body = circuits.battery(20, 100, 20, 20, '12 V', { plus: 'end', side: -1 })
    + circuits.wire([20, 20], [120, 20]) + circuits.resistor(120, 20, 120, 100, '4 Ω', -1)
    + circuits.wire([120, 100], [20, 100]);
  console.log(JSON.stringify(svg.svg(170, 120, body, 'A 12 V battery connected to a 4 ohm resistor', { pad: 8 })));
})"
```

Copy the printed text (including its quotes) as the value of `"figure"`.

### After editing

```bash
npm run check
```

Fix every `ERROR`, then open the preview page (`/dev/preview.html`) to look at your question.

---

## What the checks do

**`npm run validate`** (`scripts/validate.js`) checks that:

- every item has the right fields and types, and no unknown fields;
- ids are unique and use the right prefix;
- each item has exactly 4 different choices and `answerIndex` is 0 to 3;
- every domain has at least 50 items and every subtopic has at least one item;
- all math parses in KaTeX (strict mode) and no `$` is left unclosed;
- every SVG/table is well-formed and uses only allowed tags and attributes;
- no em dashes appear in questions or in the site's code;
- explanations never point to a choice by position, and no "of the above" choices exist;
- the mock exam split adds up and fits the bank.

It also prints how many items each subtopic and difficulty level has.

**`npm run verify`** (`scripts/verify/`) re-solves questions independently. Each domain has a checker file, for
example `scripts/verify/physics-circuits.verify.js`, mapping question ids to a small function that computes the answer:

```js
'PC-OHM-007': () => ({ value: 2 * 6 }),            // number: the keyed choice must match, and no other choice may
'ML-BOOL-003': () => ({ index: 2 }),                // index in the file's "choices" list
'TK-PSE-004': () => ({ choice: 'Output: 7' }),      // exact text of the correct choice
```

Existing checkers are wrapped in `withOrder([...], ...)` because they were written before the choices were stored
in their current order; for a new checker you can skip the wrapper and use positions from the JSON file directly.
If you change a question's numbers or choices, update or delete its checker. Questions without a checker
(reading passages, concepts, most abstract figures) are listed as "checked by hand".

Current bank: 470 items, 333 with computed checks.

---

## Project structure

```
index.html              page shell (header, footer, dialog)
src/
  config.js             mock exam split, time limit, passing rate
  main.js               starts the app
  data/                 question bank (JSON) and subtopic list
  lib/                  rendering (KaTeX + figures), shuffling, sessions, timer
  screens/              home, practice, mock exam, and results screens
  styles/main.css       all styles (mobile first, light and dark mode)
scripts/
  validate.js           question bank validator
  verify/               answer checkers
  figures/              SVG drawing helpers for new questions
dev/preview.html        question preview page (dev server only)
vercel.json             Vercel settings
```

## Privacy

The site stores nothing: no accounts, cookies, localStorage, or analytics. Answers live only in the open browser
tab. During a mock exam or an unfinished practice set, the browser asks before leaving the page, because leaving
loses the session.
