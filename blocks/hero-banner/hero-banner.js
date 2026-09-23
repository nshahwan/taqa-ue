import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorate the hero-banner block.
 *
 * Expected authored structure (rows -> cells):
 *   row 1: banner image (+ optional alt text cell)
 *   row 2: rich text — eyebrow, H1 title, and intro paragraph
 *
 * Renders a full-width banner photograph above a page-intro text region.
 */
export default function decorate(block) {
  const rows = [...block.children];

  // First row holds the banner image.
  const imageRow = rows[0];
  const textRow = rows[1];

  const media = document.createElement('div');
  media.className = 'hero-banner-media';

  if (imageRow) {
    const img = imageRow.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(
        img.src,
        img.getAttribute('alt') || '',
        true,
        [{ width: '2000' }],
      );
      media.append(optimized);
    }
    imageRow.remove();
  }

  const body = document.createElement('div');
  body.className = 'hero-banner-body';
  if (textRow) {
    const content = textRow.querySelector('div') || textRow;
    while (content.firstChild) {
      body.append(content.firstChild);
    }
    textRow.remove();
  }

  block.textContent = '';
  if (media.querySelector('picture, img')) block.append(media);
  block.append(body);
}
