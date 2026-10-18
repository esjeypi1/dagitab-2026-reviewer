import { escapeHtml } from './render.js';

// Shows a dialog with buttons. Resolves with the value of the button pressed (or null if closed).
export function ask({ title, body = '', buttons = [{ label: 'OK', value: true, primary: true }] }) {
  const dlg = document.getElementById('dialog');
  dlg.innerHTML = `
    <form method="dialog" class="dialog-box">
      <h2>${escapeHtml(title)}</h2>
      <div class="dialog-body">${body}</div>
      <div class="dialog-actions">
        ${buttons.map((b, i) => `<button class="btn ${b.primary ? 'btn-primary' : 'btn-ghost'}" value="${i}">${escapeHtml(b.label)}</button>`).join('')}
      </div>
    </form>`;
  return new Promise((resolve) => {
    const done = () => {
      dlg.removeEventListener('close', done);
      const i = Number(dlg.returnValue);
      resolve(dlg.returnValue === '' || Number.isNaN(i) ? null : buttons[i].value);
    };
    dlg.returnValue = '';
    dlg.addEventListener('close', done);
    dlg.showModal();
    const primary = dlg.querySelector('.btn-primary');
    if (primary) primary.focus();
  });
}

export const confirmLeave = () =>
  ask({
    title: 'Leave this session?',
    body: '<p>Your answers are not saved anywhere. If you leave now, this session will be lost.</p>',
    buttons: [
      { label: 'Stay', value: false },
      { label: 'Leave', value: true, primary: true },
    ],
  });

let toastTimer;
export function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.append(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 4000);
}
