import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorate the hero-app-promo block.
 *
 * A self-contained promotional banner (gradient background) featuring taglines,
 * headings, supporting text, an optional lifestyle image, and app-store CTAs.
 *
 * Expected authored structure (rows -> cells):
 *   row 1: optional promo image
 *   row 2: rich text — taglines, subheading, title, supporting text, and CTA links
 */
export default function decorate(block) {
  const rows = [...block.children];

  const media = document.createElement('div');
  media.className = 'hero-app-promo-media';

  const body = document.createElement('div');
  body.className = 'hero-app-promo-body';

  rows.forEach((row) => {
    const img = row.querySelector('img');
    const hasOnlyImage = img && row.textContent.trim() === '';
    if (hasOnlyImage) {
      const optimized = createOptimizedPicture(
        img.src,
        img.getAttribute('alt') || '',
        false,
        [{ width: '750' }],
      );
      media.append(optimized);
    } else {
      const content = row.querySelector('div') || row;
      while (content.firstChild) body.append(content.firstChild);
    }
  });

  block.textContent = '';
  if (media.querySelector('picture, img')) block.append(media);
  block.append(body);
}
