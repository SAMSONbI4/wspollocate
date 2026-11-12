import { escapeHTML as e, money, dateLong } from '../lib/format.js';
import { totalCost } from '../data/listings.js';

export function listingCard(item) {
  return `<a class="listing-card glass" href="#/ogloszenia/${e(item.id)}" aria-label="${e(item.cardTitle)}, ${e(item.district)}, ${money(totalCost(item))} zł">
    <img class="listing-card__photo" src="${e(item.photos[0].src)}" alt="${e(item.photos[0].alt)}" width="640" height="400" loading="lazy" decoding="async">
    <h3>${e(item.cardTitle)}</h3><p class="small">${e(item.district)} · ${item.id === 'podgorze' ? 'mieszkanie ' : ''}${item.area} m²</p>
    <p class="price">${money(totalCost(item))} zł <span>/ ${e(item.priceUnit)}</span></p>
    <p class="small">Z opłatami · od ${dateLong(item.availableFrom)}</p>
    <span class="card-link">Zobacz ogłoszenie <span aria-hidden="true">→</span></span>
  </a>`;
}
