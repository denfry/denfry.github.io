const root = document.documentElement;

function applyLang(lang) {
  document.querySelectorAll('[data-en]').forEach((el) => {
    const text = el.getAttribute('data-' + lang);
    if (text != null) el.textContent = text;
  });
  root.setAttribute('lang', lang);
  root.setAttribute('data-lang', lang);
  try { localStorage.setItem('lang', lang); } catch (e) {}
}

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  try { localStorage.setItem('theme', theme); } catch (e) {}
}

// initialize from what the no-flash head script already set
let lang = root.getAttribute('data-lang') || 'en';
let theme = root.getAttribute('data-theme') || 'light';
applyLang(lang);

const langBtn = document.getElementById('lang-toggle');
const themeBtn = document.getElementById('theme-toggle');

langBtn.addEventListener('click', () => {
  lang = lang === 'en' ? 'ru' : 'en';
  applyLang(lang);
});

themeBtn.addEventListener('click', () => {
  theme = theme === 'light' ? 'dark' : 'light';
  applyTheme(theme);
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
