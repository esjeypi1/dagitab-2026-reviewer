import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import 'katex/dist/katex.min.css';
import './styles/main.css';
import { go, isGuarded, setGuard } from './lib/router.js';
import { confirmLeave } from './lib/ui.js';
import { home } from './screens/home.js';

document.getElementById('brand').addEventListener('click', async () => {
  if (isGuarded() && !(await confirmLeave())) return;
  setGuard(false);
  go(home);
});

go(home);
