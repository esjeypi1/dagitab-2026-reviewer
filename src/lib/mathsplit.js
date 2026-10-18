// Splits text into plain and math parts. $...$ is inline math, $$...$$ is display math, \$ is a literal dollar sign.
// Shared by the app and the validator so both read math the same way.

function findClose(src, from, delim) {
  let i = from;
  while (i < src.length) {
    const j = src.indexOf(delim, i);
    if (j < 0) return -1;
    if (src[j - 1] === '\\') { i = j + 1; continue; }
    if (delim === '$' && src[j + 1] === '$') { i = j + 2; continue; }
    return j;
  }
  return -1;
}

export function splitMath(src) {
  const parts = [];
  let buf = '';
  let i = 0;
  const flush = () => { if (buf) parts.push({ type: 'text', value: buf }); buf = ''; };
  while (i < src.length) {
    const c = src[i];
    if (c === '\\' && src[i + 1] === '$') { buf += '$'; i += 2; continue; }
    if (c === '$') {
      const display = src[i + 1] === '$';
      const delim = display ? '$$' : '$';
      const end = findClose(src, i + delim.length, delim);
      if (end < 0) {
        // Unclosed math: kept as text, and the validator reports it.
        parts.push({ type: 'unclosed', value: src.slice(i) });
        buf = '';
        return parts;
      }
      flush();
      parts.push({ type: 'math', value: src.slice(i + delim.length, end), display });
      i = end + delim.length;
      continue;
    }
    buf += c;
    i++;
  }
  flush();
  return parts;
}
