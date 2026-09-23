/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-tips. Base: carousel.
 * Source: https://taqadistribution.com/addc/en-us/residential/help-and-support/certificates
 * Container block (Carousel convention): name row + one row per slide.
 * Slide model fields (from _carousel-tips.json): image (reference), imageAlt (collapsed), text (richtext).
 * Each source tip card = one row with 2 columns (image, text).
 * Source card: <div tipCard><img><div textContainer><title p><desc p></div><a learnMore></div>
 *   Col 1: illustration image (field:image; alt collapses into imageAlt)
 *   Col 2: text - title, description, LEARN MORE CTA (field:text)
 */
export default function parse(element, { document }) {
  // Each slide is a tip card (validated: div.tipsCarousel_tipCard__7Oe9b)
  const slides = Array.from(element.querySelectorAll('[class*="tipCard"]'));

  // Empty-block guard
  if (!slides.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  slides.forEach((slide) => {
    const image = slide.querySelector('img');
    const textContainer = slide.querySelector('[class*="textContainer"]');
    const cta = slide.querySelector('a[href]');

    // Col 1: image (field:image)
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (image) imageCell.appendChild(image);

    // Col 2: text (field:text) - title + description + LEARN MORE link
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (textContainer) {
      Array.from(textContainer.childNodes).forEach((n) => textCell.appendChild(n));
    }
    if (cta) {
      const a = document.createElement('a');
      a.href = (cta.getAttribute('href') || '').trim();
      a.textContent = cta.textContent.trim();
      textCell.appendChild(a);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-tips', cells });
  element.replaceWith(block);
}
