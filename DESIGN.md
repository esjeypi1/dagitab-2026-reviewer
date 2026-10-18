---
name: Dagitab 2026 Reviewer
description: A quiet practice board for the Dagitab 2026 exam, where the question is the content and every number is a mono numeral.
colors:
  accent: "#1f4fd8"
  accent-foreground: "#fdfdfd"
  accent-soft: "#e7edfc"
  success: "#12733f"
  success-soft: "#e2f3e9"
  danger: "#b42318"
  danger-soft: "#fdecea"
  flag: "#7a5600"
  flag-soft: "#fbefc8"
  background: "#f6f6f7"
  surface: "#fdfdfd"
  surface-sunken: "#efeff1"
  foreground: "#18181b"
  muted-foreground: "#5c5c66"
  faint-foreground: "#6b6b75"
  border: "#e3e3e7"
  border-strong: "#cfcfd6"
typography:
  display:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.03em"
    fontFeature: "\"ss01\""
  headline:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.025em"
  question:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.2
  meta:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
  numeral:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    fontFeature: "\"tnum\""
  numeral-timer:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
    fontFeature: "\"tnum\""
  numeral-score:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "3.5rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "\"tnum\""
  code:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  tag: "6px"
  control: "8px"
  panel: "12px"
spacing:
  gutter: "16px"
  gutter-wide: "24px"
  stack: "24px"
  review-gap: "32px"
  control-x: "14px"
  touch: "44px"
  touch-primary: "48px"
  choice: "52px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.foreground}"
  button-flag-on:
    backgroundColor: "{colors.flag-soft}"
    textColor: "{colors.flag}"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  chip-on:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
  board-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.panel}"
  board-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    padding: "8px 16px"
    height: "48px"
  mode-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.title}"
    padding: "16px"
    height: "84px"
  question-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.question}"
    rounded: "{rounded.panel}"
    padding: "16px"
  item-number:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.numeral}"
    rounded: "{rounded.control}"
    padding: "0 8px"
    height: "28px"
  choice:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
    height: "52px"
  choice-letter:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.numeral}"
    rounded: "{rounded.control}"
    size: "28px"
  choice-picked:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.foreground}"
  choice-correct:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.foreground}"
  choice-wrong:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.foreground}"
  explanation:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.panel}"
    padding: "16px"
  passage:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "14px 16px"
  code-block:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.foreground}"
    typography: "{typography.code}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
  navigator-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.numeral}"
    rounded: "{rounded.control}"
    height: "44px"
  navigator-chip-answered:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
  navigator-chip-flagged:
    backgroundColor: "{colors.flag-soft}"
    textColor: "{colors.flag}"
  badge-correct:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.meta}"
    rounded: "{rounded.tag}"
    padding: "0 8px"
    height: "24px"
  badge-wrong:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
  badge-skipped:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.muted-foreground}"
  badge-flag:
    backgroundColor: "{colors.flag-soft}"
    textColor: "{colors.flag}"
  pass-fail-pass:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "28px"
  pass-fail-fail:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.panel}"
    padding: "20px"
  toast:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.panel}"
    padding: "12px 16px"
---

# Design System: Dagitab 2026 Reviewer

## Overview

**Creative North Star: "The Quiet Board"**

The reviewer lives in the same world as the teacher's recitation leaderboard (`reci-dev/DESIGN.md`, "The Contest Board"), pinned by the user. It inherits that world whole: Chalk Zinc page, Paper Surface panels, 1px hairlines, one Classroom Cobalt for action and focus, Geist for words and Geist Mono tabular for numbers, 8px controls and 12px containers, shadows only on things that float. What changes is the content. The leaderboard reports ranks; the reviewer presents questions. So the board's rows become mode rows, score rows, and answer choices, and the question card is the one container that is allowed to be generous.

Light is the default and dark follows `prefers-color-scheme` with a full parallel token set. Color stays almost absent. Cobalt marks what the student is about to do or has chosen; Signal Green and Signal Red mark correct and wrong; an amber data tint marks flagged items in the mock exam. Nothing celebrates. The score is a large mono numeral and a pass or fail tag, and the review that follows is the same question card with its choices colored by outcome.

Density is calm rather than high. Controls clear a 44px touch floor, primary buttons and rows sit at 48px, answer choices at 52px. The home screen has no top bar: the H1 already names the site. Motion is the leaderboard's single entrance (board rows rise in order) plus press feedback, a progress bar that eases forward, and a toast; under reduced motion everything renders final.

**Key Characteristics:**
- Inherited zinc world from the recitation leaderboard, light default, full dark parity.
- One cobalt accent for action, choice, and focus; green and red for verdicts only; amber for flags only.
- Geist for words, Geist Mono tabular for every item number, choice letter, count, timer, and score.
- KaTeX typesets formulas; a bare number in math falls back to Geist Mono.
- 1px hairlines, flat at rest; shadows only on the dialog, the mock navigator sheet, and the toast.
- Three radii: 6px tags, 8px controls, 12px containers.

## Colors

The leaderboard's near-monochrome zinc palette and cobalt voice, with the medal tints dropped and three status pairs (green, red, amber) added, each a strong text color plus a soft wash.

### Primary
- **Classroom Cobalt** (accent): primary buttons ("Start", "Next", "Submit exam"), the selected count and topic chips, checked checkboxes, the picked choice's border and letter, answered navigator chips, the progress fill, links, the pseudocode guide toggle, the focus outline, and text selection. Inherited.
- **On Cobalt** (accent-foreground): text and icons on any cobalt fill. Inherited.
- **Cobalt Wash** (accent-soft): the fill of a picked but not yet graded choice. New role in this build (the leaderboard used it only for link hovers).

### Status
- **Signal Green / Green Wash** (success, success-soft): the correct choice (border, wash, filled letter, "Correct answer" note), the "Correct" verdict line and review badge, the Pass tag. success-soft is new to this build.
- **Signal Red / Red Wash** (danger, danger-soft): the wrong pick (border, wash, filled letter, "Your answer" note), the "Wrong" verdict and badge, the Fail tag, and the timer in its final minutes. danger-soft is new to this build.
- **Flag Amber / Amber Wash** (flag, flag-soft): flagged mock items. It fills flagged navigator chips (with an amber border), rings an answered and flagged chip in 2px amber, tints the pressed Flag button and the Flagged review badge and legend swatch, and colors the timer as a warning before it turns red. The values are the leaderboard's gold pair, reassigned from medal data to flag data.

Verdict pills (Pass and Fail) carry an inset 1px ring in their own text color at 20% opacity, the leaderboard's medal-chip treatment.

### Neutral
- **Chalk Zinc** (background): the page ground, the top bar, the sticky mock tool row, and the unchecked checkbox well.
- **Paper Surface** (surface): panels, mode rows, question cards, choices, secondary buttons, chips, navigator chips, the dialog, the toast, and the navigator sheet with its sticky footer. Also the letter color on green and red filled letters.
- **Sunken Zinc** (surface-sunken): item-number and choice-letter chips at rest, the explanation block, reading passages, code and pseudocode blocks, inline code, table header cells, row and choice hover fills, the brand mark and mode icons.
- **Ink** (foreground): all primary text and numerals; the 2px outline on the current navigator chip.
- **Graphite** (muted-foreground): facts and meta lines, mode descriptions, notes, the "of" in a score, dimmed choices in review, ghost-button text, chevrons at rest.
- **Faint Graphite** (faint-foreground): declared for parity with the inherited world; no current surface depends on it.
- **Hairline** (border): panel and card outlines, row dividers, the top bar and footer rules, table cell borders, the progress track.
- **Hairline Strong** (border-strong): hover border on controls, checkbox outlines, blank legend swatches, the middle-dot separators, the scrollbar thumb.

### Named Rules
**The One Cobalt Rule.** Cobalt means "this is the action, your choice, or the focus." It is never a panel fill, a heading color, or a decorative stripe. Inherited.

**The Verdict Color Rule.** Green and red appear only after an answer is graded: on choices, verdict lines, review badges, and the pass or fail tag. They never decorate a domain, a topic, or a mode.

**The Flag-As-Data Rule.** Amber marks a flagged item and nothing else (plus the timer's warning step). It replaces the leaderboard's medal tints; there are no medals here.

**The Two-Theme Parity Rule.** Every color token has a light and a dark value in `:root`; components consume tokens only. The favicon uses light values as literals because it cannot follow a media query. Inherited.

## Typography

**Display Font:** Geist Variable (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Geist Variable
**Label/Mono Font:** Geist Mono Variable (with ui-monospace) for numerals, choice letters, and code
**Math:** KaTeX's own math face, scaled to 1.08em of the surrounding text

**Character:** One neutral grotesk carries every word, tightened at display size, with stylistic set `ss01` on globally. The mono with tabular figures turns every number and letter label into a fixed-width mark. Typeset mathematics is the one place a third face appears.

### Hierarchy
- **Display** (600, 2.25rem on phones rising to 3rem from 768px, 1.2, -0.03em): the home H1 "Dagitab 2026 Reviewer" only. Other screen H1s use 2rem rising to 2.5rem. The line beneath sits at 1.0625rem, weight 500, Graphite.
- **Headline** (600, 1.25rem, -0.025em): the "Review" section heading.
- **Title** (600, 1.125rem, -0.025em): mode row titles and the dialog title. Panel and navigator headings step down to 1rem.
- **Question** (400, 1rem rising to 1.0625rem from 768px, 1.65): question stems and choices. Passages sit at 0.9375rem and cap at 70ch.
- **Body** (400, 15px, 1.625): descriptions, explanations, notes.
- **Label** (500, 0.875rem): buttons, chips, form labels, the pseudocode toggle; primary buttons and form labels at 600.
- **Meta** (500, 0.8125rem, Graphite): the domain and subtopic line on each question, badges (600), the legend.
- **Numeral** (Geist Mono 600, tabular): item numbers, choice letters, chip counts, navigator chips, facts line numbers, score fractions and percents.
- **Numeral Timer** (Geist Mono 600, 1.125rem): the mock timer in the top bar.
- **Numeral Score** (Geist Mono 600, 3.5rem, line-height 1, -0.02em): the results score, with "of N" at 1.5rem in Graphite.
- **Code** (Geist Mono 400, 0.875rem, 1.6): item code blocks and the pseudocode guide (0.8125rem), preserving whitespace with tab size 4.

### Named Rules
**The Mono Numerals Rule.** Every item number, choice letter, count, score, percent, and time is Geist Mono, weight 600, tabular. Words are never set in the mono. Inherited, extended to choice letters.

**The Typeset Math Exception.** A full formula is typeset by KaTeX, and the numerals inside it stay in KaTeX's math face because they are mathematics, not interface numbers. A bare number written as math (`$12$`, `$-2.5$`) is not a formula and renders in Geist Mono at 0.95em, tabular, like every other number on the site. Mixed numeral faces between a formula and a nearby bare number are expected and correct.

**The Short Ramp Rule.** Hierarchy comes from size steps within one family, weight 600 versus 400 or 500, and Ink versus Graphite. No uppercase labels, no letterspaced overlines, no eyebrows above headings. Inherited.

## Layout

A single centered column capped at 760px with 16px gutters (24px from 768px); main padding is 24px top and 48px bottom, rising to 40px and 64px. The top bar is sticky, 56px tall, on the page ground with a bottom hairline, holding the brand button on the left and a right-aligned slot for the timer or counts. On home the top bar is hidden: the H1 names the site, then one board panel holds the two mode rows, then one Graphite note.

Practice and the mock exam stack a 2px progress bar, the question card, and the action row with 16px gaps. Answer choices are a single column with 8px gaps; when choices are figures they become a two-column grid with the letter pinned to the top left corner (6px gaps under 420px). The mock exam widens to 1100px from 980px and splits into the question column and a 300px sticky item navigator. Below 980px the navigator becomes a bottom sheet, and the tool row ("N of 50 answered", "All items") sticks under the top bar.

Rhythm: panels and sections stack at 24px; review items at 32px; fields at 24px. Panel headers use 14px by 16px padding; panel bodies 16px (20px from 768px); question cards 16px (24px from 768px). Results begin with the score line, then breakdown panels whose rows enter in order. A footer rule closes every page with the unofficial disclaimer.

### Named Rules
**The Touch Floor Rule.** Every interactive control is at least 44px tall; primary buttons and board rows are 48px, choices 52px, mode rows 84px (92px from 768px). Inherited and extended.

**The No Bar On Home Rule.** The home screen shows no top bar; every other screen shows it with the brand and its slot.

## Elevation & Depth

Flat by default, as in the inherited world. Depth comes from the tonal step from Chalk Zinc to Paper Surface, the Sunken Zinc wells inside cards (explanation, passage, code), and 1px hairlines. Shadows appear only on elements that float: the dialog, the mock navigator sheet, and the toast. All are tinted by a shared `--shadow-color` HSL triplet, never pure black.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 -12px 40px -12px hsl(var(--shadow-color) / 0.35)`): the mock navigator as a bottom sheet below 980px.
- **Float lift** (`box-shadow: 0 10px 30px -10px hsl(var(--shadow-color) / 0.35)`): the dialog and the toast.
- **Scrim** (`background: hsl(var(--shadow-color) / 0.45)`): behind the sheet and the dialog. No backdrop blur.

### Named Rules
**The Overlay-Only Shadow Rule.** Panels, rows, cards, choices, chips, and buttons have no shadow at rest or on hover. If it sits in the page flow, it is bordered, not lifted. Inherited.

## Shapes

Three radii by role. 8px on everything you tap or scan as a token: buttons, chips, choices, choice letters, item numbers, navigator chips, the pass or fail tag, passages and code blocks, the brand mark and mode icons. 12px on everything that contains: panels, question cards, the explanation block, the checkbox list, the navigator, the dialog, the toast, and the sheet's top corners. 6px on the small inline marks: review badges, checkbox squares, and inline code. Borders are always 1px, except the 2px amber ring on an answered and flagged navigator chip and the 2px focus and current-item outlines. Rows in a panel are full-bleed and divided by hairlines, never individually rounded. Icons are 24px-grid strokes at 2px, drawn at 20px; the favicon is a cobalt 8px-radius tile with a light bolt.

## Components

### Buttons
Calm, outlined, and tactile; they press in rather than lift. Inherited.
- **Shape:** gently rounded (8px).
- **Primary:** Classroom Cobalt fill, light text, weight 600, 48px tall, 20px side padding. Hover brightens the fill by 8%.
- **Secondary:** Paper Surface, 1px Hairline, Ink text, weight 500, 44px tall; border shifts to Hairline Strong on hover.
- **Ghost:** transparent, Graphite text; hover fills Sunken Zinc and darkens text to Ink. Used for Flag, Clear, and Close.
- **Flag on:** the pressed Flag button takes the Amber Wash with Flag Amber text and no border.
- **Text link:** cobalt, no underline box, 44px tall where it stands alone.
- **Press / Disabled / Focus:** scale 0.98 on active; disabled at 40% opacity; the global 2px cobalt outline at 2px offset.

### Chips
- **Choice chips:** 44px, Paper Surface, 1px Hairline, label weight 500, an optional mono count in Graphite. Selected fills cobalt with light text (the count inherits). Used for question count, review filters ("All", "Wrong", "Skipped", "Correct", "Flagged" with counts).
- **Count chips** stretch to share a row and center their value in the mono.

### Cards / Containers
- **Board panel:** 12px, Paper Surface on Chalk Zinc, 1px Hairline, a hairline under the panel header, rows of at least 48px with 16px side padding and hairline dividers. Breakdown rows end with a mono fraction and a right-aligned mono percent.
- **Question card:** 12px, Paper Surface, 1px Hairline, 16px padding (24px from 768px). A head row holds the item number chip and the meta line; below it the passage, stem, code, figure, and choices.
- **Explanation:** a Sunken Zinc well with 12px radius below the card, headed by a small Graphite "Explanation" title in sentence case.
- **Shadow Strategy:** none (see Elevation & Depth).

### Inputs / Fields
- **Checkbox list:** a 12px bordered list of 48px rows; each row has a 20px square (6px radius, Hairline Strong outline on Chalk Zinc) that fills cobalt with a light check when on, and a mono item count in Graphite. Rows hover to Sunken Zinc. The native input is visually hidden and its focus ring draws on the square.
- **Radio chips:** native radios hidden under choice chips; focus draws the cobalt outline on the chip.

### Navigation
- **Top bar:** sticky, Chalk Zinc, bottom Hairline, brand button (28px Sunken Zinc mark with the bolt, "Dagitab 2026" in Ink and "Reviewer" in Graphite, the latter hidden under 420px) and a right slot for the timer or counts. Hidden on home.
- **Mode rows:** the home board's two tall rows. A 40px Sunken Zinc icon tile, a Title and a Graphite one-line description, a Graphite chevron that turns cobalt on hover. The row hovers to Sunken Zinc and its title presses to 0.98.

### Answer Choice (signature)
A full-width 52px row: a 28px mono letter chip, the choice content (text, KaTeX, or figure, scrolling horizontally if wide), and an optional 0.75rem weight 600 note at the end. States, in order of the flow: rest (Paper Surface, Hairline), hover (Hairline Strong, Sunken Zinc), picked (cobalt border, Cobalt Wash, cobalt letter), correct (green border, Green Wash, green letter, "Correct answer" note in green), wrong (red border, Red Wash, red letter, "Your answer" note in red), dimmed (Graphite text). Figures inside choices repaint their opaque backing faces in the same wash so stacked shapes stay legible. Figure choices form a two-column grid with the letter in the top left corner.

### Mock Navigator (signature)
A 12px Paper Surface panel titled "Items" with a legend (12px swatches at 4px radius: Answered, Flagged, Blank) and a grid of 44px mono chips filling at least 44px columns with 6px gaps. Chip states: blank (Paper Surface, Hairline, Graphite number), answered (cobalt fill, light number), flagged (Amber Wash, amber border and number), answered and flagged (cobalt fill with a 2px amber border), current (2px Ink outline at 2px offset). From 980px it sits sticky beside the question at 300px. Below 980px it opens as a bottom sheet (12px top corners, top hairline only, max 80vh, sheet lift, scrim) whose "Submit exam" footer is sticky to the sheet bottom on Paper Surface with a top hairline and safe-area padding.

### Pseudocode Guide
A disclosure under any item with code: a cobalt 44px summary line "How to read this pseudocode" with no marker, opening a Sunken Zinc mono block at 0.8125rem that lists the notation with plain glosses.

### Timer, Score, and Verdicts
- **Timer:** Numeral Timer in Ink; turns Flag Amber in the last 10 minutes and Signal Red in the last 5.
- **Score:** Numeral Score with "of N" and a mono percent in Graphite, then a 28px pass or fail tag (8px radius, status wash and text, inset 20% ring).
- **Verdict line:** a 1rem weight 600 line with a 20px stroke check or cross in green or red.
- **Review badges:** 24px tall, 6px radius, weight 600 at 0.8125rem: Correct (green), Wrong (red), Skipped (Sunken Zinc and Graphite), Flagged (amber).

### Dialog and Toast
- **Dialog:** native `<dialog>`, 12px, Paper Surface, Hairline, max 420px, 20px padding, float lift and scrim. Body in Graphite with counts bolded in the mono; actions right-aligned.
- **Toast:** bottom center, max 384px, 12px, Paper Surface, Hairline, label weight 500; fades and rises 12px over 300ms on the expo curve. Taps pass through.

### Motion
One curve, `cubic-bezier(0.16, 1, 0.3, 1)`. Board rows (mode rows, breakdown rows) rise 6px with a fade over 520ms, staggered 28ms after 80ms and capped at the ninth row. The progress fill eases over 600ms. Buttons and choices press to 0.98 and 0.99. Under reduced motion all transitions and animations are off.

## Do's and Don'ts

### Do:
- **Do** set every item number, choice letter, count, score, percent, and time in Geist Mono 600 with tabular figures.
- **Do** let KaTeX typeset full formulas in its math face, and render a bare math number like `$12$` in Geist Mono at 0.95em.
- **Do** keep cobalt for action, choice, and focus; green and red for graded outcomes; amber for flagged items and the timer warning.
- **Do** pair each status color with its soft wash, never a raw tint of the strong color.
- **Do** separate panels with 1px Hairline borders on Paper Surface over Chalk Zinc, and divide rows with 1px rules.
- **Do** keep every control at least 44px tall; primary buttons 48px, choices 52px.
- **Do** ship a dark value for every new color token and consume tokens, never literals, in components.
- **Do** gate every movement behind `prefers-reduced-motion: no-preference`.

### Don't:
- **Don't** add hero banners, colorful topic cards, tip lists, or eyebrows above headings; the question is the content.
- **Don't** show the top bar on home; the H1 names the site.
- **Don't** use UP or Radio Guild logos or colors; the name appears in text only.
- **Don't** color a domain, topic, or mode; status colors belong to outcomes and flags.
- **Don't** put shadows on in-flow panels, cards, choices, chips, or buttons; shadows belong to the dialog, the navigator sheet, and the toast.
- **Don't** add backdrop blur to overlays.
- **Don't** introduce new radii; tags are 6px, controls 8px, containers 12px.
- **Don't** set words in Geist Mono or interface numerals in proportional Geist.
