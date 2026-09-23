/*
 * Accordion FAQ Block (category-filterable, paginated)
 *
 * Each authored row is one FAQ item with three cells:
 *   [category] | [question / summary] | [answer / rich text]
 *
 * The block renders category filter pills ("All" + each distinct category)
 * above the accordion. Clicking a pill shows only the matching items. Items are
 * revealed in pages of PAGE_SIZE; a "LOAD MORE" button shows the next page and
 * hides itself once everything in the current filter is shown. Built as native
 * <details>/<summary> for accessibility.
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

const ALL_LABEL = 'All';
const PAGE_SIZE = 4;

export default function decorate(block) {
  const items = [];
  const categories = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    // Three-cell rows carry an explicit category in the first cell; older
    // two-cell rows (category-less) still work and fall under "All" only.
    const hasCategory = cells.length >= 3;
    const categoryEl = hasCategory ? cells[0] : null;
    const labelEl = hasCategory ? cells[1] : cells[0];
    const bodyEl = hasCategory ? cells[2] : cells[1];

    const category = categoryEl ? categoryEl.textContent.trim() : '';
    if (category && !categories.includes(category)) categories.push(category);

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    if (labelEl) summary.append(...labelEl.childNodes);

    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-faq-item';
    if (category) details.dataset.category = category;
    details.append(summary);

    if (bodyEl) {
      bodyEl.className = 'accordion-faq-item-body';
      details.append(bodyEl);
    }

    items.push(details);
    row.replaceWith(details);
  });

  // "Load more" control — appended after the items.
  const loadMore = document.createElement('button');
  loadMore.type = 'button';
  loadMore.className = 'accordion-faq-loadmore';
  loadMore.textContent = 'LOAD MORE';
  block.append(loadMore);

  let currentFilter = ALL_LABEL;
  let shown = PAGE_SIZE;

  // Items matching the active category filter, in document order.
  const matching = () => items.filter(
    (it) => currentFilter === ALL_LABEL || it.dataset.category === currentFilter,
  );

  const render = () => {
    const matched = matching();
    matched.forEach((it, i) => {
      const visible = i < shown;
      it.hidden = !visible;
      if (!visible) it.open = false;
    });
    // Non-matching items are always hidden.
    items.forEach((it) => {
      if (!matched.includes(it)) { it.hidden = true; it.open = false; }
    });
    // Toggle the load-more button.
    loadMore.hidden = shown >= matched.length;
  };

  loadMore.addEventListener('click', () => {
    shown += PAGE_SIZE;
    render();
  });

  // Build the filter pills only when categories are present.
  if (categories.length) {
    const filters = document.createElement('div');
    filters.className = 'accordion-faq-filters';

    const applyFilter = (value) => {
      currentFilter = value;
      shown = PAGE_SIZE; // reset pagination on filter change
      render();
      filters.querySelectorAll('button').forEach((b) => {
        b.classList.toggle('active', b.dataset.filter === value);
        b.setAttribute('aria-pressed', b.dataset.filter === value);
      });
    };

    [ALL_LABEL, ...categories].forEach((label, i) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'accordion-faq-filter';
      pill.dataset.filter = label;
      pill.textContent = label;
      if (i === 0) pill.classList.add('active');
      pill.setAttribute('aria-pressed', i === 0);
      pill.addEventListener('click', () => applyFilter(label));
      filters.append(pill);
    });

    block.prepend(filters);
  }

  // Initial paint (first page shown, rest hidden).
  render();
}
