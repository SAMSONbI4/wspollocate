import { escapeHTML as e } from '../lib/format.js';

export function button(label, { href, variant = 'primary', attributes = '', type = 'button', className = '' } = {}) {
  const tag = href ? 'a' : 'button';
  return `<${tag} class="button button--${variant} ${className}" ${href ? `href="${e(href)}"` : `type="${type}"`} ${attributes}>${e(label)}</${tag}>`;
}
export const backLink = (href = '#/ogloszenia', label = 'Ogłoszenia') => `<a class="back-link" href="${e(href)}"><span aria-hidden="true">←</span> ${e(label)}</a>`;
export const icon = (name) => `<img class="nav-icon" src="./assets/figma/nav-${e(name)}.svg" alt="" width="24" height="24">`;
export const avatar = (person, large = false) => person.avatar
  ? `<img class="avatar ${large ? 'avatar--large' : ''}" src="${e(person.avatar)}" alt="Zdjęcie profilowe: ${e(person.name)}" width="${large ? 80 : 64}" height="${large ? 80 : 64}">`
  : `<span class="avatar avatar--initial ${large ? 'avatar--large' : ''}" aria-label="Profil: ${e(person.name)}">${e(person.name[0])}</span>`;

export function field({ name, label, type = 'text', required = false, value = '', placeholder = '', options, rows, hint = '', attributes = '' }) {
  const common = `id="${e(name)}" name="${e(name)}" ${required ? 'required' : ''} ${hint ? `aria-describedby="${e(name)}-hint"` : ''} ${attributes}`;
  let input;
  if (options) input = `<select ${common}>${options.map(([val, text]) => `<option value="${e(val)}" ${val === value ? 'selected' : ''}>${e(text)}</option>`).join('')}</select>`;
  else if (rows) input = `<textarea ${common} rows="${rows}" placeholder="${e(placeholder)}">${e(value)}</textarea>`;
  else input = `<input ${common} type="${type}" value="${e(value)}" placeholder="${e(placeholder)}">`;
  return `<div class="field"><label for="${e(name)}">${e(label)}${required ? ' <span aria-hidden="true">*</span>' : ''}</label>${input}${hint ? `<small id="${e(name)}-hint" class="muted">${e(hint)}</small>` : ''}<p class="field-error" id="${e(name)}-error" hidden></p></div>`;
}

export const panel = (heading, content, className = '') => `<section class="glass profile-panel ${className}"><h2>${e(heading)}</h2>${content}</section>`;
