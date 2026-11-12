import { button } from '../components/ui.js';
import { listingCard } from '../components/listing-card.js';
import { listings } from '../data/listings.js';

const steps = [
  { title: 'Wybierz swoje miejsce', description: 'Ustaw okolicę, budżet i termin. Znajdź pokój dopasowany do Ciebie.', art: 'map' },
  { title: 'Poznaj swojego człowieka', description: 'Sprawdź profil i zwyczaje. Zobacz, czy dobrze się dogadacie.', art: 'person' },
  { title: 'Porozmawiaj i zamieszkaj', description: 'Napisz do autora, zapytaj o szczegóły i umów się na obejrzenie mieszkania.', art: 'conversation' },
];
function stepArtwork(name) {
  if (name !== 'map') return `<img class="step-art" src="./assets/figma/step-${name}.svg" alt="" width="200" height="110">`;
  return `<div class="step-art map-art" aria-hidden="true">${[0, 1, 2, 3, 4].map((index) => `<img class="map-layer map-layer--${index}" src="./assets/figma/map-${index}.svg" alt="">`).join('')}<span>1500 zł</span></div>`;
}
export function homePage() {
  return `<section class="hero" aria-labelledby="home-title">
    <div class="hero__copy"><h1 id="home-title">Znajdź swoje miejsce.<br>Poznaj swoich ludzi.</h1><p>Znajdź pokój lub osobę do wspólnego wynajmu w Krakowie.</p>
      <div class="actions">${button('Przeglądaj ogłoszenia', { href: '#/ogloszenia' })}${button('Dodaj ogłoszenie', { href: '#/dodaj' })}</div>
    </div>
    <div class="hero-visual"><img class="hero-visual__photo" src="./assets/photos/hero.jpg" alt="Przytulny wspólny salon z roślinami i dużymi oknami" width="500" height="390" fetchpriority="high">
      <span class="hero-badge glass">Kraków · blisko uczelni</span><div class="hero-caption glass"><strong>Więcej niż wolny pokój.</strong><span>Miejsce, w którym czujesz się u siebie.</span></div>
    </div>
  </section>
  <section class="how-it-works" aria-labelledby="steps-title"><h2 id="steps-title" class="section-title">Jak to działa?</h2><ol class="steps">${steps.map((step, index) => `<li class="step-card glass"><div class="step-card__art"><span class="step-number">0${index + 1}</span>${stepArtwork(step.art)}</div><h3>${step.title}</h3><p class="small">${step.description}</p></li>`).join('')}</ol></section>
  <section class="home-listings" aria-labelledby="examples-title"><div class="section-heading"><h2 id="examples-title">Przykładowe ogłoszenia</h2><a class="text-link" href="#/ogloszenia">Wszystkie ogłoszenia <span aria-hidden="true">→</span></a></div><div class="listing-grid">${listings.map(listingCard).join('')}</div></section>`;
}
