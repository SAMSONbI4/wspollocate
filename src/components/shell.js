import { site } from '../data/site.js';
import { icon } from './ui.js';
import { escapeHTML as e } from '../lib/format.js';

const links = (mobile) => site.navigation.map((item) => `<a href="#${item.path}" data-nav="${item.path}">${mobile ? icon(item.icon) : ''}<span>${item.label}</span></a>`).join('');
const indicator = '<span class="nav-indicator" aria-hidden="true"></span>';
function positionIndicators() {
  document.querySelectorAll('.desktop-nav, .mobile-nav').forEach((nav) => {
    const pill = nav.querySelector('.nav-indicator');
    const active = nav.querySelector('[aria-current="page"]');
    if (!active || !nav.offsetWidth) { pill.style.opacity = '0'; return; }
    pill.style.width = `${active.offsetWidth}px`;
    pill.style.height = `${active.offsetHeight}px`;
    pill.style.transform = `translate3d(${active.offsetLeft}px, ${active.offsetTop}px, 0)`;
    pill.style.opacity = '1';
  });
}
export function mountShell() {
  document.querySelector('#site-header').innerHTML = `<a class="brand" href="#/" aria-label="${e(site.name)} — strona główna"><img src="./assets/figma/brand.svg" alt="" width="30" height="30"><span>${e(site.name)}</span></a><nav class="desktop-nav" aria-label="Nawigacja główna">${indicator}${links(false)}</nav>`;
  document.querySelector('#mobile-nav').innerHTML = indicator + links(true);
  const navResize = new ResizeObserver(positionIndicators);
  document.querySelectorAll('.desktop-nav, .mobile-nav, [data-nav]').forEach((element) => navResize.observe(element));
  document.querySelector('#site-footer').innerHTML = `<div><p>${e(site.name.toLocaleUpperCase('pl'))} <span aria-hidden="true">/</span> KONCEPCJA INTERFEJSU</p><p>Dane demonstracyjne · Zdjęcia wygenerowane przez AI · Projekt studencki</p></div><button type="button" class="motion-toggle" id="motion-toggle" aria-pressed="false">Wstrzymaj tło</button>`;
  const toggle = document.querySelector('#motion-toggle');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let stored = null;
  try { stored = localStorage.getItem('wspollocate-motion'); } catch { /* Storage can be unavailable. */ }
  let paused = stored === 'paused' || reduced.matches;
  function update() {
    document.documentElement.dataset.motion = paused ? 'paused' : 'running';
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = reduced.matches ? 'Ruch ograniczony' : paused ? 'Włącz ruch tła' : 'Wstrzymaj tło';
    toggle.disabled = reduced.matches;
  }
  update();
  toggle.addEventListener('click', () => { paused = !paused; update(); try { localStorage.setItem('wspollocate-motion', paused ? 'paused' : 'running'); } catch { /* Optional preference. */ } });
  reduced.addEventListener('change', () => { if (reduced.matches) paused = true; update(); });
}

export function updateNavigation(path, animate = true) {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const target = link.dataset.nav;
    const active = target === '/' ? path === '/' : path === target || path.startsWith(`${target}/`);
    const wasActive = link.hasAttribute('aria-current');
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    if (animate && active && !wasActive && !matchMedia('(prefers-reduced-motion: reduce)').matches && link.offsetWidth) {
      const visual = link.querySelector('.nav-icon') ?? link.querySelector('span');
      visual.getAnimations().forEach((animation) => animation.cancel());
      visual.animate([
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(-3px) scale(1.13)', offset: .38 },
        { transform: 'translateY(0) scale(1)' },
      ], { duration: 440, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    }
  });
  positionIndicators();
}
