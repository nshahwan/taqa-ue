/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-app-promo. Base: hero.
 * Source: https://taqadistribution.com/addc/en-us/residential/help-and-support/certificates
 * Model fields: image (reference), imageAlt (collapsed), text (richtext).
 * Library convention (Hero): 1 column, up to 3 rows (name + image + text). Never more than 3 rows.
 * NOTE: the instance selector also wraps the energy-tips carousel (carousel-tips block).
 * This parser scopes strictly to the app-promo content and ignores the tips subtree.
 *   Row: background/lifestyle image (none here -> empty cell)
 *   Row: text - taglines, subheading (h6), title (h5), supporting text, app-store CTA links
 */
export default function parse(element, { document }) {
  // Scope to the app content, excluding the tips carousel (solutionsCarousel_tips)
  const appContent = element.querySelector('[class*="appcontent"], [class*="parentAppContent"], [class*="appSectionContainer"]')
    || element;

  // Optional lifestyle image directly inside the app content (exclude app-store badge imgs in links)
  const lifestyleImg = appContent.querySelector(':scope > img, :scope > * > img:not(a img)');

  // Collect text/heading blocks from the app content, skipping the app-store button container
  const taglines = appContent.querySelector('[class*="tagline"]:not([class*="midtagline"])');
  const heading6 = appContent.querySelector('h6');
  const heading5 = appContent.querySelector('h5');
  const appLinks = Array.from(appContent.querySelectorAll('[class*="applinks"] a[href], a[class*="applink"][href]'))
    .filter((a) => a.getAttribute('href'));

  // Supporting text: paragraphs not inside tagline/applinks groups and not in tip cards
  const supportingParas = Array.from(appContent.querySelectorAll('p'))
    .filter((p) => !p.closest('[class*="tagline"]')
      && !p.closest('[class*="applinks"]')
      && !p.closest('[class*="tipCard"]'));

  // Empty-block guard
  if (!heading5 && !heading6 && !taglines && !supportingParas.length && !appLinks.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Image row. The source lifestyle photo (the man-with-phone visual with the
  // purple rings) is loaded responsively/lazily and is not present as an <img>
  // in the scraped DOM, so fall back to the localized DAM copy. The cleanup
  // transformer's image-localization keys off the "manPhone" filename stem.
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (lifestyleImg) {
    imageCell.appendChild(lifestyleImg);
  } else {
    const img = document.createElement('img');
    img.setAttribute('src', 'https://taqadistribution.com/_next/static/media/manPhone.cb541850.webp');
    img.setAttribute('alt', 'Take control of your TAQA Distribution account');
    imageCell.appendChild(img);
  }
  cells.push([imageCell]);

  // Text row
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (taglines) textCell.appendChild(taglines);
  if (heading6) textCell.appendChild(heading6);
  if (heading5) textCell.appendChild(heading5);
  supportingParas.forEach((p) => textCell.appendChild(p));
  // App-store CTAs as TEXT links (label from the badge img's alt), not images.
  // A standalone hero block's `text` maps to a single richtext field; an image
  // nested inside that richtext (image-in-link) breaks md2jcr's simple-mode
  // field mapping, so emit plain-text links instead.
  appLinks.forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    const img = a.querySelector('img');
    const label = (img && img.getAttribute('alt')) || a.textContent.trim() || href;
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = label;
    const p = document.createElement('p');
    p.appendChild(link);
    textCell.appendChild(p);
  });
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-app-promo', cells });
  element.replaceWith(block);
}
