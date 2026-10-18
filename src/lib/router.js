// Tiny screen switcher. Each screen is a function (root, ...args) that may return a cleanup function.
const root = () => document.getElementById('app');
let cleanup = null;
let guardOn = false;

export function go(screen, ...args) {
  if (cleanup) cleanup();
  cleanup = null;
  setTopbar('');
  const el = root();
  el.innerHTML = '';
  window.scrollTo(0, 0);
  const res = screen(el, ...args);
  if (typeof res === 'function') cleanup = res;
  el.focus({ preventScroll: true });
}

// Content shown on the right side of the top bar (timer, progress).
export function setTopbar(html) {
  document.getElementById('topbar-slot').innerHTML = html;
}

// When on, the browser asks before the page is closed or reloaded. Nothing is stored.
export function setGuard(on) {
  guardOn = on;
}
export const isGuarded = () => guardOn;

window.addEventListener('beforeunload', (e) => {
  if (!guardOn) return;
  e.preventDefault();
  e.returnValue = '';
});
