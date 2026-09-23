/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: regroup app-promo + energy-tips into one 2-column section.
 *
 * In the source, the energy-tips carousel is nested inside the app-promo
 * container, but after parsing they land in different sections (app-promo alone;
 * carousel grouped with the FAQ). The reference design shows them side by side
 * as a single 2-column band (app-promo left, tips right).
 *
 * Runs in afterTransform AFTER taqa-sections.js, so the block tables and the
 * section-break <hr>s already exist. It moves the carousel-tips block table to
 * sit immediately after the hero-app-promo block table (before the <hr> that
 * starts the FAQ section), placing both in the same inter-<hr> segment = same
 * EDS section. The section then carries both `hero-app-promo-container` and
 * `carousel-tips-container` classes, which styles.css lays out as two columns.
 *
 * MUST be registered to run AFTER taqa-sections.js.
 */

// Normalize a block table's header text for matching (strip case, spaces, hyphens).
function blockKey(table) {
  const firstRow = table.querySelector('tr');
  if (!firstRow) return '';
  return (firstRow.textContent || '').toLowerCase().replace(/[\s-]+/g, '');
}

function findBlockTable(element, key) {
  const tables = Array.from(element.querySelectorAll('table'));
  return tables.find((t) => blockKey(t).startsWith(key)) || null;
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const appTable = findBlockTable(element, 'heroapppromo');
  const tipsTable = findBlockTable(element, 'carouseltips');
  if (!appTable || !tipsTable) return; // one is missing — skip, never guess

  // Move the tips block to directly follow the app-promo block. Since the FAQ
  // section-break <hr> sits between them, relocating tips ahead of that <hr>
  // pulls it into the app-promo section.
  appTable.after(tipsTable);
}
