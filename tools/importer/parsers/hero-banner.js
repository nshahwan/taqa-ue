/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://taqadistribution.com/addc/en-us/residential/help-and-support/certificates
 * Model fields: image (reference), imageAlt (collapsed -> alt), text (richtext)
 * Library convention: 1 column, 3 rows (name row + image row + text row).
 *   Row 1 (after name): background image
 *   Row 2 (after name): text (eyebrow, H1 title, intro paragraph)
 */
export default function parse(element, { document }) {
  // Banner image (validated: img.headerFrame_imagesframe__QG53I)
  const image = element.querySelector('img[class*="imagesframe"], img[class*="hero"], img');

  // Text container (validated: div.headerFrame_textContainer__lF1AM)
  const textContainer = element.querySelector('[class*="textContainer"], [class*="textcontainer"]');

  // Individual text nodes as fallback if no container present
  const eyebrow = element.querySelector('[class*="title"]:not(h1):not(h2)');
  const title = element.querySelector('h1, [class*="subtitle"]');
  const intro = element.querySelector('p[class*="text"]');

  // Empty-block guard
  if (!image && !textContainer && !title && !intro) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: background image (field:image)
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (image) imageCell.appendChild(image);
  cells.push([imageCell]);

  // Row: text (field:text) - richtext holding eyebrow + title + intro
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (textContainer) {
    Array.from(textContainer.childNodes).forEach((n) => textCell.appendChild(n));
  } else {
    if (eyebrow) textCell.appendChild(eyebrow);
    if (title) textCell.appendChild(title);
    if (intro) textCell.appendChild(intro);
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
