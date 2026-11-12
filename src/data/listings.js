// Demonstration content only. Replace this module with an API in a later stage.
const photo = (name, alt) => ({ src: `./assets/photos/${name}.jpg`, alt });

export const listings = [
  {
    id: 'krowodrza', title: 'Pokój blisko uczelni', cardTitle: 'Pokój blisko uczelni',
    district: 'Krowodrza', city: 'Kraków', area: 14, rent: 1250, fees: 200, deposit: 1250,
    priceUnit: 'miesiąc', availableFrom: '2026-12-01', authorId: 'anna',
    description: 'Jasny pokój w mieszkaniu dzielonym z dwiema osobami. Wspólna kuchnia, łazienka i miejsce do nauki. Biurko przy oknie, dużo zieleni i wygodny dojazd do uczelni.',
    expectations: 'Osoby, która ceni porządek, spokojne wieczory i otwartą komunikację.',
    photos: [
      photo('krowodrza-room', 'Jasny pokój z zieloną pościelą i biurkiem przy oknie'),
      photo('krowodrza-kitchen', 'Wspólna kuchnia z szałwiowymi szafkami i drewnianym stołem'),
      photo('krowodrza-study', 'Kącik do nauki z biurkiem i regałem na książki'),
    ],
  },
  {
    id: 'podgorze', title: 'Mieszkanie do wspólnego wynajmu', cardTitle: 'Szukam osoby do wynajmu',
    district: 'Podgórze', city: 'Kraków', area: 48, rent: 1500, fees: 200, deposit: 1500,
    priceUnit: 'osobę', availableFrom: '2026-12-01', authorId: 'anna',
    description: 'Dwupokojowe mieszkanie do wynajęcia wspólnie. Osobne pokoje, wyposażona kuchnia i dobry dojazd do uczelni. Drewniana podłoga, balkon i miejsce na wspólne śniadanie.',
    expectations: 'Osoby, która ceni porządek, spokojne wieczory i otwartą komunikację.',
    photos: [
      photo('podgorze-room', 'Salon z koniakową sofą, parkietem i wyjściem na balkon'),
      photo('podgorze-kitchen', 'Jasna kuchnia z drewnianymi szafkami i stolikiem śniadaniowym'),
      photo('podgorze-bedroom', 'Osobna sypialnia z pościelą w kolorze terakoty'),
    ],
  },
];

export const districts = ['Krowodrza', 'Podgórze', 'Stare Miasto', 'Grzegórzki', 'Bronowice', 'Nowa Huta'];
export const getListing = (id) => listings.find((item) => item.id === id);
export const totalCost = (listing) => Number(listing.rent) + Number(listing.fees);

export function filterListings(items, { district = '', maxPrice = '', availableBy = '' } = {}) {
  return items.filter((item) => (!district || item.district === district)
    && (!maxPrice || totalCost(item) <= Number(maxPrice))
    && (!availableBy || item.availableFrom <= availableBy));
}
