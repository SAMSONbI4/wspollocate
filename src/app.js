import { homePage } from './pages/home.js';
import { listingsPage, bindListings } from './pages/listings.js';
import { detailsPage, bindDetails } from './pages/details.js';
import { addListingPage, bindAddListing, previewPage, bindPreview } from './pages/add-listing.js';
import { profilePage } from './pages/profile.js';
import { mountShell, updateNavigation } from './components/shell.js';
import { button } from './components/ui.js';
import { site } from './data/site.js';
import { createPageTransition } from './lib/page-transition.js';

const main = document.querySelector('#main');
let cleanup = () => {};
const transition = createPageTransition(main);
mountShell();
const routes = {
  '/': { title: 'Start', render: homePage },
  '/ogloszenia': { title: 'Ogłoszenia', render: listingsPage, bind: bindListings },
  '/dodaj': { title: 'Dodaj ogłoszenie', render: addListingPage, bind: bindAddListing },
  '/dodaj/podglad': { title: 'Podgląd ogłoszenia', render: previewPage, bind: bindPreview },
  '/profil': { title: 'Mój profil', render: () => profilePage('self') },
  '/profil/autor': { title: 'Profil autora', render: (params) => profilePage('author', params.get('ogloszenie')) },
  '/profil/kandydat': { title: 'Profil osoby zainteresowanej', render: () => profilePage('applicant') },
};
function renderPage(hash, moveFocus = false) {
  cleanup();
  const [path, search = ''] = (hash || '/').split('?');
  const params = new URLSearchParams(search);
  let route = routes[path];
  const match = /^\/ogloszenia\/([^/]+)$/.exec(path);
  if (match) {
    const id = match[1] === 'przyklad' ? 'krowodrza' : match[1];
    route = { title: 'Szczegóły ogłoszenia', render: () => detailsPage(id), bind: (root) => bindDetails(root, id) };
  }
  main.innerHTML = route ? route.render(params) : `<div class="empty-state glass"><h1>Nie znaleziono strony</h1><p>Ten adres nie prowadzi do żadnej strony.</p>${button('Wróć na start', { href: '#/' })}</div>`;
  cleanup = route?.bind?.(main) ?? (() => {});
  document.title = `${route?.title ?? 'Nie znaleziono strony'} · ${site.name}`;
  document.body.dataset.page = path === '/' ? 'home' : path.split('/')[1];
  document.querySelector('#route-status').textContent = route?.title ?? 'Nie znaleziono strony';
  if (moveFocus) { main.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
}
function navigate(initial = false) {
  const hash = location.hash.slice(1) || '/';
  updateNavigation(hash.split('?')[0], !initial);
  void transition(() => renderPage(hash, !initial), { initial });
}
window.addEventListener('hashchange', () => navigate());
// Keep the skip link out of hash routing.
document.querySelector('.skip-link').addEventListener('click', (event) => { event.preventDefault(); main.focus(); main.scrollIntoView(); });
navigate(true);
