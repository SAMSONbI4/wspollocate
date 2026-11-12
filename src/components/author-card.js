import { avatar, button } from './ui.js';
import { escapeHTML as e, money } from '../lib/format.js';
import { totalCost } from '../data/listings.js';

export function authorCard(item, person) {
  return `<aside class="author-card glass" aria-label="Koszty i kontakt z autorem">
    <h2 class="price">${money(totalCost(item))} zł / ${e(item.priceUnit)}</h2>
    <p>Czynsz: ${money(item.rent)} zł + opłaty: ${money(item.fees)} zł<br>Kaucja jednorazowa: ${money(item.deposit)} zł</p>
    <hr><div class="author-summary">${avatar(person)}<div><p class="caption">Autor ogłoszenia</p><h3>${e(person.name)}</h3><p class="small">${e(person.occupation[0].toUpperCase() + person.occupation.slice(1))} · ${e(person.city)}</p></div></div>
    ${button('Otwórz profil autora', { href: `#/profil/autor?ogloszenie=${e(item.id)}`, className: 'button--wide' })}
    <div class="contact-controls">${contactControl('email', 'Pokaż e-mail', person.email)}${contactControl('phone', 'Pokaż numer telefonu', person.phone)}<p class="caption muted">Dane demonstracyjne</p></div>
  </aside>`;
}
function contactControl(kind, label, value) {
  return `<button type="button" class="contact-reveal" data-contact="${kind}" data-value="${e(value)}" data-label="${e(label)}" aria-expanded="false"><span class="contact-value">${e(label)}</span><span class="contact-hint" aria-hidden="true">+</span></button>`;
}
export function bindAuthorCard(root) {
  root.querySelectorAll('[data-contact]').forEach((control) => control.addEventListener('click', () => {
    const expanded = control.getAttribute('aria-expanded') !== 'true';
    control.setAttribute('aria-expanded', String(expanded));
    control.querySelector('.contact-value').textContent = expanded ? control.dataset.value : control.dataset.label;
    control.querySelector('.contact-hint').textContent = expanded ? 'Ukryj' : '+';
  }));
}
