import { escapeHTML as e } from '../lib/format.js';

export function gallery(photos) {
  return `<section class="gallery" aria-label="Zdjęcia mieszkania">
    <button type="button" class="gallery__open" aria-label="Powiększ zdjęcie mieszkania"><img id="gallery-main" src="${e(photos[0].src)}" alt="${e(photos[0].alt)}" width="640" height="400"><span class="gallery__count">1 / ${photos.length} <span aria-hidden="true">↗</span></span></button>
    <div class="gallery__strip"><div class="gallery__thumbs">${photos.map((photo, i) => `<button type="button" class="gallery__thumb" data-photo="${i}" aria-label="Zdjęcie ${i + 1}: ${e(photo.alt)}" aria-pressed="${i === 0}"><img src="${e(photo.src)}" alt="" width="64" height="48" loading="lazy"></button>`).join('')}</div><p class="caption muted">Zdjęcia poglądowe</p></div>
    <dialog class="lightbox" aria-label="Powiększona galeria zdjęć"><div class="lightbox__toolbar"><p class="lightbox__position" aria-live="polite"></p><button type="button" class="button button--secondary" data-close-gallery>Zamknij <span aria-hidden="true">×</span></button></div><img class="lightbox__photo" alt=""><div class="lightbox__actions"><button class="button button--secondary" type="button" data-gallery-prev>← Poprzednie</button><button class="button button--secondary" type="button" data-gallery-next>Następne →</button></div></dialog>
  </section>`;
}

export function bindGallery(root, photos) {
  const section = root.querySelector('.gallery');
  if (!section) return () => {};
  let selected = 0;
  const dialog = section.querySelector('dialog');
  function select(index) {
    selected = (index + photos.length) % photos.length;
    const photo = photos[selected];
    for (const img of section.querySelectorAll('#gallery-main, .lightbox__photo')) { img.src = photo.src; img.alt = photo.alt; }
    section.querySelector('.gallery__count').innerHTML = `${selected + 1} / ${photos.length} <span aria-hidden="true">↗</span>`;
    section.querySelector('.lightbox__position').textContent = `${selected + 1} / ${photos.length} · ${photo.alt}`;
    section.querySelectorAll('[data-photo]').forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.photo) === selected)));
  }
  section.querySelectorAll('[data-photo]').forEach((button) => button.addEventListener('click', () => select(Number(button.dataset.photo))));
  section.querySelector('.gallery__open').addEventListener('click', () => { select(selected); dialog.showModal(); });
  section.querySelector('[data-close-gallery]').addEventListener('click', () => dialog.close());
  section.querySelector('[data-gallery-prev]').addEventListener('click', () => select(selected - 1));
  section.querySelector('[data-gallery-next]').addEventListener('click', () => select(selected + 1));
  dialog.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); select(selected - 1); } if (event.key === 'ArrowRight') { event.preventDefault(); select(selected + 1); } });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  return () => { if (dialog.open) dialog.close(); };
}
