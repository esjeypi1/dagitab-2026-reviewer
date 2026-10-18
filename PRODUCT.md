# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Senior high school students** in the Philippines preparing for the Dagitab 2026 qualifying exam of the UP Engineering Radio Guild. They mostly open the site on their phones, often from a link shared by their teacher or in group chats, and practice in short sessions or sit a full 60-minute mock exam.
- **The teacher** who made it, who shares the link and maintains the question bank in JSON files.

## Product Purpose

A free, public reviewer that mirrors the real exam: 50 multiple-choice items, 60 minutes, 60% to pass, four domains (Mathematics and Logic, Physics and Circuits, Technical Knowledge, Abstract Reasoning). Practice mode is untimed with instant feedback and worked explanations; Mock Exam mode is timed with results and a full review at the end. Success: a student can start practicing in one tap and learns from every explanation.

## Positioning

An unofficial reviewer, not affiliated with or endorsed by the UP Engineering Radio Guild; the questions are not actual exam items. Every item is solvable without a calculator, and every computable answer is re-checked by a script.

## Operating Context

- Phones first, opened from shared links; also laptops.
- Students work with pen and scratch paper. Calculators are not allowed.
- Nothing is saved: no accounts, cookies, or localStorage. Every visit starts fresh, and leaving the page ends the session (the browser warns first).

## Capabilities and Constraints

- Static site (Vite + vanilla JS), deployed on Vercel from the public GitHub repo esjeypi1/dagitab-2026-reviewer.
- 470 items in `src/data/*.json`, with KaTeX math, inline SVG figures, and HTML truth tables. Question and choice order is shuffled every session.
- Mock split lives in `src/config.js` (default 13/13/12/12).
- Pseudocode uses a generic notation that students need a short guide for.

## Brand Commitments

- Name: "Dagitab 2026 Reviewer". The unofficial disclaimer must stay visible.
- No official UP or Radio Guild logos or colors.
- Visual world: same as the teacher's earlier recitation leaderboard (`~/Documents/KISAY/reci-dev`, live at kisay-reci-leaderboard.vercel.app). The user made this binding.
- Voice: plain and friendly. Short, simple English that speaks to the student. No slang, no emoji, no hype. No em dashes anywhere.
- Straightforward: as little text as possible on every screen.

## Evidence on Hand

- The question bank (470 items) and its counts per domain and subtopic. No testimonials, pass rates, or user numbers exist; do not invent them.

## Product Principles

1. One tap to start practicing.
2. Say less: every screen shows only what the student needs right now.
3. The question is the content; the interface stays out of its way.
4. Honest about being unofficial and about saving nothing.

## Accessibility & Inclusion

- Readable on small, low-end phones; no horizontal scroll at 360px.
- WCAG AA contrast in light and dark. Respect `prefers-reduced-motion`.
- Touch targets at least 44px.
