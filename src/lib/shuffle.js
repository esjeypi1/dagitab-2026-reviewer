// Fisher-Yates shuffle using the browser's crypto random numbers when available.
function randomInt(max) {
  if (globalThis.crypto?.getRandomValues) {
    const buf = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / max) * max;
    let x;
    do {
      globalThis.crypto.getRandomValues(buf);
      x = buf[0];
    } while (x >= limit);
    return x % max;
  }
  return Math.floor(Math.random() * max);
}

export function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Picks n items spread as evenly as possible across groups, then across subgroups.
// keys is a list of functions, for example [domain, subtopic]. Result is shuffled.
export function drawSpread(items, n, keys) {
  keys = Array.isArray(keys) ? keys : [keys];
  if (n >= items.length) return shuffle(items);
  if (!keys.length) return shuffle(items).slice(0, n);
  const [key, ...rest] = keys;
  const groups = new Map();
  for (const it of shuffle(items)) {
    const k = key(it);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(it);
  }
  // Give each group an equal share; groups with too few items pass their leftover share on.
  const list = shuffle([...groups.values()]);
  const take = new Map(list.map((g) => [g, 0]));
  let left = n;
  while (left > 0) {
    const open = list.filter((g) => take.get(g) < g.length);
    for (const g of open) {
      if (left === 0) break;
      take.set(g, take.get(g) + 1);
      left--;
    }
  }
  return shuffle(list.flatMap((g) => drawSpread(g, take.get(g), rest)));
}
