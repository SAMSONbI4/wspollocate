import { avatar, backLink, button, panel } from '../components/ui.js';
import { profiles } from '../data/profiles.js';
import { getListing } from '../data/listings.js';
import { escapeHTML as e, money } from '../lib/format.js';
export function profilePage(kind = 'self', listingId = 'krowodrza') {
  const person = kind === 'applicant' ? profiles.michal : profiles.anna;
  const title = kind === 'self' ? 'Mój profil' : kind === 'author' ? 'Profil autora' : 'Profil osoby zainteresowanej';
  const item = getListing(listingId) ?? getListing('krowodrza');
  return `${backLink(kind === 'self' ? '#/' : `#/ogloszenia/${item.id}`, kind === 'self' ? 'Start' : 'Ogłoszenie')}<h1>${title}</h1>
    <section class="profile-overview glass" aria-label="Podstawowe informacje">${avatar(kind === 'self' ? { ...person, avatar: null } : person, true)}<div><h2>${kind === 'self' ? 'Twój profil' : e(person.name)}</h2><p>${person.age} lata · ${e(person.occupation)} · ${e(person.city)}</p><p class="facebook-status">Facebook · demo</p></div></section>
    <div class="profile-sections">
    ${panel('O mnie', `<p>${e(person.about)}</p>`)}
    ${panel('Jak mieszkam', `<ul class="habits">${person.habits.map((habit) => `<li>${e(habit)}</li>`).join('')}</ul>`)}
    ${panel('Preferencje mieszkaniowe', `<p>Budżet: do ${money(person.budget)} zł / miesiąc<br>Okolica: ${e(person.districts)}<br>Przeprowadzka: ${e(person.moveIn)}</p>`)}
    ${kind === 'self' ? panel('Moje ogłoszenie', button('Pokój blisko uczelni', { href: '#/ogloszenia/krowodrza' })) + panel('Osoby zainteresowane · podgląd autora', `<div class="applicant"><p><strong>Michał</strong> · student<br>„Cześć! Szukam pokoju od grudnia.”</p>${button('Zobacz profil Michała', { href: '#/profil/kandydat' })}</div>`) : ''}
    </div>${kind === 'author' ? button('Zobacz ogłoszenie Anny', { href: `#/ogloszenia/${item.id}` }) : ''}`;
}
