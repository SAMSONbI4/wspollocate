import { backLink, button, field } from '../components/ui.js';
import { listingCard } from '../components/listing-card.js';
import { districts, listings, filterListings } from '../data/listings.js';
const filterState = { district: '', maxPrice: '', availableBy: '' };
export function listingsPage() {
  return `${backLink('#/', 'Start')}<div class="page-heading"><h1 class="display">Znajdź swoje miejsce w Krakowie</h1><p>Znajdź miejsce dopasowane do Twojego życia.</p></div>
    <button type="button" class="button button--secondary mobile-filter-trigger" id="show-filters">Filtry <span id="filter-count"></span></button>
    <div class="search-layout"><aside class="filter-sidebar"><form id="filters" class="filter-panel glass"><div class="filter-heading"><h2 id="filters-title">Filtry</h2><button class="text-button filter-close" type="button" id="hide-filters">Zamknij ×</button></div>
      ${field({ name: 'district', label: 'Dzielnica', value: filterState.district, options: [['', 'Wszystkie dzielnice'], ...districts.map((name) => [name, name])] })}
      ${field({ name: 'maxPrice', label: 'Cena do / miesiąc (zł)', type: 'number', value: filterState.maxPrice, placeholder: 'np. 1800', attributes: 'min="1" inputmode="numeric"' })}
      ${field({ name: 'availableBy', label: 'Chcę zamieszkać od', type: 'date', value: filterState.availableBy, hint: 'Pokoje dostępne najpóźniej w tym dniu.' })}
      ${button('Pokaż wyniki', { type: 'submit', className: 'button--wide' })}<button type="button" class="text-button" id="reset-filters">Wyczyść filtry</button>
    </form></aside><section class="search-results" aria-label="Wyniki wyszukiwania"><p class="small results-count" role="status" id="results-count"></p><div class="listing-grid" id="listing-results"></div></section></div>
    <dialog class="filters-dialog" aria-label="Filtry ogłoszeń"></dialog>`;
}
export function bindListings(root) {
  const form = root.querySelector('#filters'), sidebar = root.querySelector('.filter-sidebar'), dialog = root.querySelector('.filters-dialog');
  function refresh() {
    const results = filterListings(listings, filterState);
    root.querySelector('#results-count').textContent = `${results.length} ${results.length === 1 ? 'ogłoszenie' : results.length === 0 ? 'ogłoszeń' : 'ogłoszenia'} w Krakowie · ceny z opłatami`;
    root.querySelector('#listing-results').innerHTML = results.length ? results.map(listingCard).join('') : `<div class="empty-state glass"><h2>Jeszcze nic nie pasuje</h2><p>Spróbuj zwiększyć budżet lub wybrać inną dzielnicę.</p>${button('Wyczyść filtry', { attributes: 'data-reset-results' })}</div>`;
    root.querySelector('[data-reset-results]')?.addEventListener('click', reset);
    const active = Object.values(filterState).filter(Boolean).length;
    root.querySelector('#filter-count').textContent = active ? `(${active})` : '';
  }
  function reset() { Object.keys(filterState).forEach((key) => { filterState[key] = ''; form.elements[key].value = ''; }); refresh(); }
  function close() { dialog.close(); }
  form.addEventListener('submit', (event) => { event.preventDefault(); if (!form.reportValidity()) return; for (const key of Object.keys(filterState)) filterState[key] = form.elements[key].value; refresh(); if (dialog.open) close(); });
  root.querySelector('#reset-filters').addEventListener('click', reset);
  root.querySelector('#show-filters').addEventListener('click', () => { dialog.appendChild(form); dialog.showModal(); });
  root.querySelector('#hide-filters').addEventListener('click', close);
  dialog.addEventListener('close', () => { sidebar.appendChild(form); root.querySelector('#show-filters')?.focus(); });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
  const desktop = matchMedia('(min-width: 761px)');
  const onResize = () => { if (desktop.matches && dialog.open) close(); };
  desktop.addEventListener('change', onResize);
  refresh();
  return () => { desktop.removeEventListener('change', onResize); if (dialog.open) close(); };
}
