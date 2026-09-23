/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-solutions. Base: cards.
 * Source: https://taqadistribution.com/addc/en-us/residential/help-and-support/certificates
 * Container block (Cards convention): zero-to-N rows, each row a card.
 * Card model fields: image (reference), text (richtext). Each row = 2 cells (image, text).
 * Source cards are link cards: <li><a href><span container><title></span></a>.
 * The corner icon is a decorative inline SVG data-uri (not a content image) -> image cell empty.
 * Note: empty image cell is still included (per convention), with no field comment (Rule 2/4).
 */
export default function parse(element, { document }) {
  // Each card is a list item (validated: ul.slidesContainer > li > a)
  const cards = Array.from(element.querySelectorAll('ul li'));

  // Empty-block guard
  if (!cards.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((li) => {
    const link = li.querySelector('a[href]');
    const titleEl = li.querySelector('[class*="title"]');
    const title = titleEl ? titleEl.textContent.trim() : (link ? link.textContent.trim() : '');

    // Image column: decorative arrow icon only -> empty cell (still included, no field comment)
    const imageCell = '';

    // Text column: linked title (field:text)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (link && title) {
      const a = document.createElement('a');
      a.href = (link.getAttribute('href') || '').trim();
      a.textContent = title;
      textCell.appendChild(a);
    } else if (title) {
      const p = document.createElement('p');
      p.textContent = title;
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-solutions', cells });
  element.replaceWith(block);
}
