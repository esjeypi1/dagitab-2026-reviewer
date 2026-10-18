// Countdown based on a fixed deadline, so it stays correct even if the phone sleeps or the tab is in the background.
export function startCountdown(deadline, onTick, onDone) {
  let done = false;
  const tick = () => {
    if (done) return;
    const left = Math.max(0, deadline - Date.now());
    onTick(left);
    if (left <= 0) {
      done = true;
      stop();
      onDone();
    }
  };
  const id = setInterval(tick, 250);
  document.addEventListener('visibilitychange', tick);
  function stop() {
    clearInterval(id);
    document.removeEventListener('visibilitychange', tick);
  }
  tick();
  return () => { done = true; stop(); };
}

export function formatTime(ms) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
