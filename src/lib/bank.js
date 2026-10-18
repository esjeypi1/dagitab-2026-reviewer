import meta from '../data/subtopics.json';

export const DOMAINS = meta.domains;
export const domainById = Object.fromEntries(DOMAINS.map((d) => [d.id, d]));

let cache = null;

// Loads all four question files (each is its own small download).
export function loadBank() {
  cache ??= Promise.all([
    import('../data/math-logic.json'),
    import('../data/physics-circuits.json'),
    import('../data/technical-knowledge.json'),
    import('../data/abstract-reasoning.json'),
  ]).then((mods) => mods.flatMap((m) => m.default));
  return cache;
}
