import { backLink, button } from '../components/ui.js';
import { gallery, bindGallery } from '../components/gallery.js';
import { authorCard, bindAuthorCard } from '../components/author-card.js';
import { getListing } from '../data/listings.js';
import { profiles } from '../data/profiles.js';
import { escapeHTML as e, dateShort } from '../lib/format.js';
export function detailsPage(id) {
  const item = getListing(id);
  if (!item) return `<div class="empty-state glass"><h1>Nie znaleziono ogłoszenia</h1><p>Wróć do listy i wybierz dostępne ogłoszenie.</p>${button('Przeglądaj ogłoszenia', { href: '#/ogloszenia' })}</div>`;
  return `${backLink()}<div class="page-heading detail-heading"><h1>Szczegóły ogłoszenia</h1><h2>${e(item.title)}</h2><p>${e(item.city)} · ${e(item.district)} · ${item.area} m² · od ${dateShort(item.availableFrom)}</p></div>
    <div class="detail-layout">${gallery(item.photos)}${authorCard(item, profiles[item.authorId])}</div>
    <div class="listing-description"><section><h2>O mieszkaniu</h2><p>${e(item.description)}</p></section><section><h2>Kogo szukamy?</h2><p>${e(item.expectations)}</p></section></div>`;
}
export function bindDetails(root, id) {
  const item = getListing(id);
  if (!item) return () => {};
  bindAuthorCard(root);
  return bindGallery(root, item.photos);
}
