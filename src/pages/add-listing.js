import { backLink, button, field } from '../components/ui.js';
import { gallery, bindGallery } from '../components/gallery.js';
import { districts } from '../data/listings.js';
import { escapeHTML as e, money, dateShort } from '../lib/format.js';
import { validateListing, validatePhoto } from '../lib/validation.js';

// A draft exists only in this tab. Nothing is uploaded or published.
const draft = { values: { location: 'Kraków', district: '', rent: '', area: '', availableFrom: '', description: '', fees: '', expectations: '', contact: '' }, photos: [], valid: false };
const names = Object.keys(draft.values);
function uploadPanel() {
  return `<section class="photo-upload glass" id="photo-drop" aria-labelledby="upload-title"><h2 id="upload-title">Pokaż, jak się tu mieszka</h2><div class="upload-previews" id="upload-previews"></div><p class="small upload-instruction">Przeciągnij zdjęcia tutaj</p>${button('Wybierz zdjęcia', { attributes: 'id="choose-photos"', className: 'button--wide' })}<input class="visually-hidden" tabindex="-1" type="file" id="photos" name="photos" multiple accept="image/jpeg,image/png" aria-label="Wybierz zdjęcia mieszkania"><p class="caption upload-hint">JPG lub PNG · do 10 MB / zdjęcie<br>Maks. 8 zdjęć. Pierwsze będzie okładką.</p><p id="photo-error" class="field-error" role="alert" hidden></p></section>`;
}
export function addListingPage() {
  const f = (config) => field({ ...config, value: draft.values[config.name] });
  return `${backLink()}<div class="page-heading"><h1>Dodaj ogłoszenie</h1><p>Opowiedz o mieszkaniu i osobie, której szukasz.</p><p class="small">* Pola wymagane. Zdjęcia są opcjonalne. Podaj cenę czynszu i opłaty osobno.</p></div>
    <form id="listing-form" novalidate><div id="form-error-summary" class="error-summary" role="alert" hidden>Sprawdź zaznaczone pola. Twoje dane zostały zachowane.</div><div class="form-columns"><div class="form-column">
    ${f({ name: 'location', label: 'Lokalizacja', required: true, attributes: 'autocomplete="address-level2" maxlength="100"' })}
    ${f({ name: 'district', label: 'Dzielnica', required: true, options: [['', 'Wybierz dzielnicę'], ...districts.map((d) => [d, d])] })}
    ${f({ name: 'rent', label: 'Czynsz bez opłat (zł)', type: 'number', required: true, placeholder: 'np. 1250', attributes: 'min="1" step="1" inputmode="numeric"' })}
    ${f({ name: 'area', label: 'Powierzchnia (m²)', type: 'number', required: true, placeholder: 'np. 14', attributes: 'min="0.1" step="0.1" inputmode="decimal"' })}
    ${f({ name: 'availableFrom', label: 'Dostępne od', type: 'date', required: true })}</div><div class="form-column">
    ${f({ name: 'description', label: 'Opis mieszkania', required: true, rows: 4, placeholder: 'Układ, wyposażenie, okolica…', attributes: 'maxlength="3000"' })}
    ${f({ name: 'fees', label: 'Dodatkowe opłaty (zł, opcjonalnie)', type: 'number', placeholder: 'np. 200', attributes: 'min="0" step="1" inputmode="numeric"' })}
    ${f({ name: 'expectations', label: 'Oczekiwania wobec współlokatora (opcjonalnie)', rows: 4, placeholder: 'Co jest dla Ciebie ważne?', attributes: 'maxlength="2000"' })}
    ${f({ name: 'contact', label: 'Kontakt', required: true, placeholder: 'E-mail lub telefon', attributes: 'maxlength="150"' })}${uploadPanel()}</div></div>
    <div class="form-actions"><p class="small">Sprawdzisz treść w podglądzie. Dane możesz poprawić.</p>${button('Podgląd ogłoszenia', { type: 'submit' })}<button class="text-button" type="button" id="sample-errors">Zobacz przykład błędów formularza</button></div></form>`;
}
export function bindAddListing(root) {
  const form = root.querySelector('#listing-form');
  let disposed = false;
  function capture() { for (const name of names) draft.values[name] = form.elements[name].value; draft.valid = false; }
  function renderPhotos() {
    root.querySelector('#upload-previews').innerHTML = draft.photos.length
      ? draft.photos.map((photo, i) => `<div class="upload-preview"><img src="${photo.src}" alt="Wybrane zdjęcie ${i + 1}"><span class="photo-order">${i === 0 ? 'Okładka' : i + 1}</span><button type="button" data-remove-photo="${i}" aria-label="Usuń zdjęcie ${i + 1}">×</button></div>`).join('')
      : [0, 1, 2].map(() => '<div class="upload-slot"><img src="./assets/figma/upload.svg" alt="" width="24" height="24"></div>').join('');
    root.querySelectorAll('[data-remove-photo]').forEach((button) => button.addEventListener('click', () => {
      const [removed] = draft.photos.splice(Number(button.dataset.removePhoto), 1); URL.revokeObjectURL(removed.src); renderPhotos();
    }));
  }
  function showErrors(errors) {
    root.querySelector('#form-error-summary').hidden = !Object.keys(errors).length;
    for (const name of names) {
      const input = form.elements[name], message = root.querySelector(`#${name}-error`);
      message.textContent = errors[name] ?? ''; message.hidden = !errors[name];
      if (errors[name]) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', `${name}-error`); }
      else { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
    }
    const first = Object.keys(errors)[0];
    if (first) form.elements[first].focus();
  }
  async function addPhotos(files) {
    const problems = [];
    for (const file of files) {
      if (disposed) break;
      if (draft.photos.length >= 8) { problems.push('Możesz dodać maksymalnie 8 zdjęć.'); break; }
      const error = validatePhoto(file);
      if (error) { problems.push(`${file.name}: ${error}`); continue; }
      const key = `${file.name}/${file.size}/${file.lastModified}`;
      if (draft.photos.some((photo) => photo.key === key)) continue;
      const src = URL.createObjectURL(file);
      const image = new Image(); image.src = src;
      try { await image.decode(); } catch { URL.revokeObjectURL(src); problems.push(`${file.name}: nie można odczytać zdjęcia.`); continue; }
      if (disposed) { URL.revokeObjectURL(src); break; }
      if (draft.photos.some((photo) => photo.key === key)) { URL.revokeObjectURL(src); continue; }
      if (draft.photos.length >= 8) { URL.revokeObjectURL(src); problems.push('Możesz dodać maksymalnie 8 zdjęć.'); break; }
      draft.photos.push({ src, key, alt: `Zdjęcie mieszkania: ${file.name}` });
    }
    if (disposed) return;
    const feedback = root.querySelector('#photo-error'); feedback.textContent = problems.join(' '); feedback.hidden = !problems.length; renderPhotos();
  }
  form.addEventListener('input', capture);
  form.addEventListener('change', capture);
  form.addEventListener('submit', (event) => { event.preventDefault(); capture(); const errors = validateListing(draft.values); showErrors(errors); if (!Object.keys(errors).length) { draft.valid = true; location.hash = '/dodaj/podglad'; } });
  root.querySelector('#sample-errors').addEventListener('click', () => { form.elements.rent.value = '0'; form.elements.contact.value = 'anna@'; capture(); showErrors(validateListing(draft.values)); });
  root.querySelector('#choose-photos').addEventListener('click', () => root.querySelector('#photos').click());
  root.querySelector('#photos').addEventListener('change', (event) => { void addPhotos([...event.target.files]); event.target.value = ''; });
  const drop = root.querySelector('#photo-drop');
  drop.addEventListener('dragover', (event) => { event.preventDefault(); drop.classList.add('is-dragging'); });
  drop.addEventListener('dragleave', (event) => { if (!drop.contains(event.relatedTarget)) drop.classList.remove('is-dragging'); });
  drop.addEventListener('drop', (event) => { event.preventDefault(); drop.classList.remove('is-dragging'); void addPhotos([...event.dataTransfer.files]); });
  renderPhotos();
  return () => { disposed = true; capture(); };
}
export function previewPage() {
  if (Object.keys(validateListing(draft.values)).length) return `<div class="empty-state glass"><h1>Najpierw uzupełnij ogłoszenie</h1><p>Wypełnij formularz, aby zobaczyć podgląd.</p>${button('Przejdź do formularza', { href: '#/dodaj' })}</div>`;
  const v = draft.values;
  return `${backLink('#/dodaj', 'Wróć do edycji')}<div class="page-heading"><h1>Podgląd ogłoszenia</h1><p>To podgląd lokalny. Ogłoszenie nie zostało opublikowane.</p><h2>${e(v.location)} · ${e(v.district)}</h2><p>${e(v.area)} m² · od ${dateShort(v.availableFrom)}</p></div><div class="detail-layout">${draft.photos.length ? gallery(draft.photos) : '<div class="photo-empty glass"><img src="./assets/figma/upload.svg" alt="" width="24" height="24"><p>Nie dodano zdjęć</p><a href="#/dodaj">Dodaj zdjęcia w formularzu</a></div>'}<aside class="author-card glass"><h2>${money(Number(v.rent) + Number(v.fees))} zł / miesiąc</h2><p>Czynsz: ${money(v.rent)} zł<br>Opłaty: ${money(v.fees)} zł</p><hr><h3>Kontakt</h3><p class="wrap-text">${e(v.contact)}</p>${button('Wróć do edycji', { href: '#/dodaj' })}</aside></div><div class="listing-description"><section><h2>O mieszkaniu</h2><p class="preserve-lines">${e(v.description)}</p></section>${v.expectations ? `<section><h2>Kogo szukamy?</h2><p class="preserve-lines">${e(v.expectations)}</p></section>` : ''}</div>`;
}
export function bindPreview(root) { return draft.photos.length ? bindGallery(root, draft.photos) : () => {}; }
