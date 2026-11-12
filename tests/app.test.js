import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { listings, totalCost, filterListings } from '../src/data/listings.js';
import { validateListing, validatePhoto } from '../src/lib/validation.js';
import { escapeHTML } from '../src/lib/format.js';
import { homePage } from '../src/pages/home.js';
import { detailsPage } from '../src/pages/details.js';

const valid = { location: 'Kraków', district: 'Krowodrza', rent: '1250', area: '14', availableFrom: '2026-12-01', description: 'Pokój z biurkiem.', fees: '200', contact: 'demo@example.com' };
test('budget includes fees and its exact boundary', () => {
  assert.equal(totalCost(listings[0]), 1450);
  assert.equal(filterListings(listings, { maxPrice: '1449' }).length, 0);
  assert.deepEqual(filterListings(listings, { maxPrice: '1450' }).map(x => x.id), ['krowodrza']);
});
test('district, budget and availability work together', () => {
  assert.equal(filterListings(listings, { district: 'Podgórze', maxPrice: '1700', availableBy: '2026-12-01' }).length, 1);
  assert.equal(filterListings(listings, { district: 'Podgórze', maxPrice: '1699' }).length, 0);
  assert.equal(filterListings(listings, { availableBy: '2026-11-30' }).length, 0);
  assert.equal(filterListings(listings).length, 2);
});
test('valid contacts and optional zero fees', () => {
  for (const contact of ['demo@example.com', '+48 123 456 789', '123-456-789']) {
    assert.deepEqual(validateListing({ ...valid, contact, fees: '' }), {});
    assert.deepEqual(validateListing({ ...valid, contact, fees: '0' }), {});
  }
});
test('invalid numbers, missing fields and incomplete contact have field errors', () => {
  const errors = validateListing({ ...valid, location: ' ', rent: '0', area: '-1', fees: '-10', contact: 'anna@', description: '' });
  for (const key of ['location', 'rent', 'area', 'fees', 'contact', 'description']) assert.ok(errors[key]);
  assert.ok(validateListing({ ...valid, contact: '123' }).contact);
});
test('invalid calendar dates are rejected without rejecting leap days', () => {
  for (const availableFrom of ['', '2026-02-30', '2026-13-01', 'not-a-date']) assert.ok(validateListing({ ...valid, availableFrom }).availableFrom);
  assert.equal(validateListing({ ...valid, availableFrom: '2028-02-29' }).availableFrom, undefined);
});
test('photo type, size and empty-file boundaries', () => {
  assert.equal(validatePhoto({ type: 'image/png', size: 10 * 1024 * 1024 }), '');
  assert.ok(validatePhoto({ type: 'image/png', size: 10 * 1024 * 1024 + 1 }));
  assert.ok(validatePhoto({ type: 'image/svg+xml', size: 100 }));
  assert.ok(validatePhoto({ type: 'image/jpeg', size: 0 }));
});
test('entered text cannot become markup', () => {
  assert.equal(escapeHTML('<img src="x" onerror=\'alert(1)\'> &'), '&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt; &amp;');
});
test('each listing has three distinct local images; every rendered image resolves', () => {
  const paths = listings.flatMap(item => item.photos.map(photo => photo.src));
  assert.equal(new Set(paths).size, 6);
  const html = homePage() + listings.map(item => detailsPage(item.id)).join('');
  for (const match of html.matchAll(/(?:src|href)="(\.\/assets\/[^"#]+)"/g)) {
    assert.ok(existsSync(new URL('../' + match[1], import.meta.url)), match[1]);
  }
});
