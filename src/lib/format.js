export const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
export const money = (value) => new Intl.NumberFormat('pl-PL').format(Number(value));
export const dateLong = (value) => new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long' }).format(new Date(`${value}T12:00:00`));
export const dateShort = (value) => new Intl.DateTimeFormat('pl-PL').format(new Date(`${value}T12:00:00`));
