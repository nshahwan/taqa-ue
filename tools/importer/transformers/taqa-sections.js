/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: TAQA Distribution section breaks + section metadata.
 * Inserts <hr> before each non-first section and a Section Metadata block for
 * every section that declares a style. Section selectors come from
 * page-templates.json (help-and-support) and are verified in cleaned.html:
 *   rc2 hero                -> .headerFrame_herosection__gGU27       (line 355)
 *   rc3 find-your-solution  -> .customCarousel_container__sxi1j      (line 363)
 *   rc4 app-promo-and-tips  -> .solutionsCarousel_appsectioncontainer__WLOtL (line 399)
 *   rc5 faq                 -> .faqPanel_container__Tce5m            (line 525)
 *   rc6 customer-support    -> .customerSupport_container__Nzg04     (line 726, style: dark)
 *
 * Breaks are inserted in beforeTransform (while every section element still
 * exists) using a marker attribute; metadata is inserted in afterTransform
 * anchored to that marker. See generate-import-transformer.md "Why both hooks".
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

// section.selector is an array of candidate selectors — first match wins.
function querySection(root, selectors) {
  for (const sel of selectors) {
    const el = root.querySelector(sel);
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no leading break, no metadata
      const sectionEl = querySection(element, section.selector);
      if (!sectionEl) continue; // no selector matched on this page — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers may have replaced section elements; anchor metadata to the marker
    // <hr> placed above, or (first section, no marker) the original element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || querySection(element, section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
