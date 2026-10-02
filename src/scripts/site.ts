import { track } from './analytics';
import { initLeadForms } from './forms';

// ---- Text-size control (A / A+ / A++) ----
const SIZE_KEY = 'wm-text-size';

function applySize(size: string) {
  if (size === '0') document.documentElement.removeAttribute('data-text-size');
  else document.documentElement.setAttribute('data-text-size', size);
  document.querySelectorAll<HTMLButtonElement>('button[data-text-size]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.textSize === size));
  });
}

let saved = '0';
try {
  saved = localStorage.getItem(SIZE_KEY) ?? '0';
} catch {
  /* storage unavailable — keep default */
}
applySize(saved);

document.querySelectorAll<HTMLButtonElement>('button[data-text-size]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const size = btn.dataset.textSize ?? '0';
    applySize(size);
    try {
      localStorage.setItem(SIZE_KEY, size);
    } catch {
      /* ignore */
    }
  });
});

// ---- Click tracking: any element with data-track="event_name" ----
document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
  if (el) track(el.dataset.track!, { link_url: el.getAttribute('href') ?? undefined, page: location.pathname });
});

initLeadForms();
