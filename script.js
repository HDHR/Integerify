(function() {
  try {
    const saved = localStorage.getItem('cleanint-theme');
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (_) {}
})();

const $ = (sel) => document.querySelector(sel);
const rawInput = $('#rawInput');
const cleanOutput = $('#cleanOutput');
const lenBadge = $('#lenBadge');
const copyBtn = $('#copyBtn');
const clearBtn = $('#clearBtn');
const toast = $('#toast');
const statusText = $('#statusText');

function sanitizeInteger(str) {
  if (typeof str !== 'string') str = String(str ?? '');
  const trimmed = str.trim();
  const isNeg = /^\s*-/.test(trimmed);
  const digits = trimmed.replace(/\D+/g, '');
  if (!digits) return isNeg ? '-' : '';
  const normalized = digits.replace(/^0+(?!$)/, '');
  return isNeg ? '-' + normalized : normalized;
}

function setOutput(value) {
  cleanOutput.value = value;
  const count = value.replace(/^-/, '').length;
  lenBadge.textContent = count + (count === 1 ? ' digit' : ' digits');
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast.tid);
  showToast.tid = setTimeout(() => toast.classList.remove('show'), 1200);
}

rawInput.addEventListener('input', () => {
  const clean = sanitizeInteger(rawInput.value);
  setOutput(clean);
});

clearBtn.addEventListener('click', () => {
  rawInput.value = '';
  setOutput('');
  rawInput.focus();
});

copyBtn.addEventListener('click', async () => {
  const val = cleanOutput.value;
  if (!val) return;
  try {
    await navigator.clipboard.writeText(val);
    showToast('Copied!');
  } catch (_) {
    cleanOutput.select();
    document.execCommand('copy');
    showToast('Copied!');
  }
});

const themeToggle = $('#themeToggle');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('cleanint-theme', theme); } catch (_) {}
  const mc = theme === 'dark' ? '#0b0f14' : '#f6f7fb';
  const meta = document.getElementById('metaThemeColor');
  if (meta) meta.setAttribute('content', mc);
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  themeToggle.animate([
    { transform: 'rotate(0deg) scale(1)' },
    { transform: 'rotate(14deg) scale(1.06)' },
    { transform: 'rotate(0deg) scale(1)' }
  ], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' });
});

setOutput('');