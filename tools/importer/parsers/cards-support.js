/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-support. Base: cards.
 * Source: https://taqadistribution.com/addc/en-us/residential/help-and-support/certificates
 * Container block (Cards convention): zero-to-N rows, each row a card with 2 cells (image, text).
 * Card model fields (from _cards-support.json): image (reference, "Icon"), text (richtext).
 * Source card: <a href><div iconContainer><img></div><div supportText><span><h6></span><p desc></div></a>
 *   Col 1: icon image (field:image)
 *   Col 2: text - title (h6), description, card link (field:text)
 */
// Source card icons are inline branded SVGs (not <img>), so they are not
// captured by the scraper. Map each card to a localized DAM SVG recreated in
// the brand teal, keyed by the card's href / title.
const DAM_BASE = '/content/dam/taqa-ue';
function localIconFor(href, title) {
  const h = (href || '').toLowerCase();
  const t = (title || '').toLowerCase();
  if (h.startsWith('tel:') || t.includes('call')) return `${DAM_BASE}/icon-phone.svg`;
  if (h.includes('videochat') || t.includes('video')) return `${DAM_BASE}/icon-video.svg`;
  if (h.includes('locations') || t.includes('location')) return `${DAM_BASE}/icon-location.svg`;
  if (h.includes('contactus') || t.includes('chat')) return `${DAM_BASE}/icon-chat.svg`;
  return `${DAM_BASE}/icon-chat.svg`;
}

export default function parse(element, { document }) {
  // Each card is a support-option anchor (validated: a.supportOption_supportDiv__D_r9X)
  const cards = Array.from(element.querySelectorAll('[class*="supportDiv"]'));

  // Empty-block guard
  if (!cards.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const titleEl = card.querySelector('h6');
    const descEl = Array.from(card.querySelectorAll('[class*="supportText"] p'))
      .find((p) => p.textContent.trim());
    const href = (card.getAttribute('href') || '').trim();
    const title = titleEl ? titleEl.textContent.trim() : '';

    // Col 1: icon image (field:image) — recreated brand-teal SVG from the DAM,
    // since the source icons are inline SVGs the scraper does not localize.
    const icon = document.createElement('img');
    icon.setAttribute('src', localIconFor(href, title));
    icon.setAttribute('alt', title);
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (icon) imageCell.appendChild(icon);

    // Col 2: text (field:text) - title heading, description, and a link
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (titleEl) textCell.appendChild(titleEl);
    if (descEl) textCell.appendChild(descEl);
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = title || href;
      textCell.appendChild(a);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-support', cells });
  element.replaceWith(block);
}
