/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: prune mobile-duplicate leftovers stranded in the FAQ section.
 *
 * The source ships a mobile-only copy of the energy-tips carousel and the
 * "WE ARE HERE TO HELP" panel inside the FAQ column. After parsing, the tips
 * carousel is extracted/moved beside the app-promo, but its "ENERGY SAVING TIPS"
 * eyebrow label and a SECOND "WE ARE HERE TO HELP" list flatten into the FAQ
 * section as stray default content.
 *
 * This runs LAST (after parsers, sections, and regroup) and removes ONLY those
 * specific stray nodes — matched narrowly by content/id — so it can never touch
 * the carousel-tips block table (already extracted) or the first, real
 * "WE ARE HERE TO HELP" panel.
 *
 * MUST be registered to run AFTER taqa-sections.js and taqa-regroup-app-tips.js.
 */

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  // 1. The FAQ column ends up with TWO "WE ARE HERE TO HELP" panels — the real
  //    one plus a mobile duplicate. Ids aren't yet de-duplicated at transform
  //    time, so match by heading text and drop every heading occurrence after
  //    the first.
  const weHelpHeadings = Array.from(element.querySelectorAll('h5'))
    .filter((h) => h.textContent.trim() === 'WE ARE HERE TO HELP');
  weHelpHeadings.slice(1).forEach((h) => h.remove());

  // 1b. Drop duplicate copies of the help link list. The panel's list is
  //     identified by its first link ("What to do in an emergency"); keep the
  //     first such <ul>, remove any further copies (the mobile duplicate).
  const helpLists = Array.from(element.querySelectorAll('ul'))
    .filter((ul) => {
      const firstLink = ul.querySelector('a');
      return firstLink && firstLink.textContent.trim() === 'What to do in an emergency';
    });
  helpLists.slice(1).forEach((ul) => ul.remove());

  // 2. The stray "ENERGY SAVING TIPS" eyebrow label — a bare <p> whose only text
  //    is that label. Match exactly so no other paragraph is affected.
  element.querySelectorAll('p').forEach((p) => {
    if (p.textContent.trim() === 'ENERGY SAVING TIPS' && !p.querySelector('*')) {
      p.remove();
    }
  });

  // 3. The FAQ category-filter labels ("All", "All About Billings and Payments",
  //    "All about your online account") were captured as plain paragraphs of the
  //    "LOOKING FOR ANSWERS" default content. The accordion-faq block now renders
  //    its own interactive filter pills, so drop these redundant bare labels.
  const FILTER_LABELS = new Set([
    'All',
    'All About Billings and Payments',
    'All about your online account',
  ]);
  element.querySelectorAll('p').forEach((p) => {
    if (FILTER_LABELS.has(p.textContent.trim()) && !p.querySelector('*')) {
      p.remove();
    }
  });
}
