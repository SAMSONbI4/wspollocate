export function validateListing(values) {
  const errors = {};
  if (!values.location?.trim()) errors.location = 'Podaj miasto lub lokalizację.';
  if (!values.district) errors.district = 'Wybierz dzielnicę.';
  if (!values.rent || !Number.isFinite(Number(values.rent)) || Number(values.rent) <= 0) errors.rent = 'Podaj czynsz większy od 0 zł.';
  if (!values.area || !Number.isFinite(Number(values.area)) || Number(values.area) <= 0) errors.area = 'Podaj powierzchnię większą od 0 m².';
  const date = values.availableFrom ?? '';
  const parsedDate = Date.parse(date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate) || new Date(parsedDate).toISOString().slice(0, 10) !== date) errors.availableFrom = 'Wybierz poprawny termin dostępności.';
  if (!values.description?.trim()) errors.description = 'Opisz mieszkanie i jego wyposażenie.';
  if (values.fees && (!Number.isFinite(Number(values.fees)) || Number(values.fees) < 0)) errors.fees = 'Opłaty nie mogą być ujemne.';
  const contact = values.contact?.trim() ?? '';
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const phone = /^\+?[\d\s()-]+$/.test(contact) && contact.replace(/\D/g, '').length >= 9 && contact.replace(/\D/g, '').length <= 15;
  if (!email && !phone) errors.contact = 'Podaj pełny adres e-mail lub numer telefonu.';
  return errors;
}

export function validatePhoto(file) {
  if (!['image/jpeg', 'image/png'].includes(file.type)) return 'Wybierz plik JPG lub PNG.';
  if (file.size > 10 * 1024 * 1024) return 'Zdjęcie może mieć maksymalnie 10 MB.';
  if (!file.size) return 'Ten plik jest pusty.';
  return '';
}
