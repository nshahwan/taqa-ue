/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: TAQA Distribution site-wide cleanup.
 * Removes non-authorable site chrome (header, primary/mobile navigation, mega-menu
 * dropdowns, footer, cookie consent, custom cursor/reading-line widgets, modals).
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Map of source image URLs (hash-stamped Next.js media + remote CDN) to the
 * localized DAM paths under /content/dam/taqa-ue/. Keyed by the stable filename
 * stem so hash changes on the source don't break the match.
 */
const DAM_BASE = '/content/dam/taqa-ue';
// Keys are the source filename stems (as they appear in the origin URLs);
// targets are the localized DAM paths. DAM paths MUST be lowercase — the Edge
// Delivery pipeline normalizes /content/dam/... paths to lowercase, so mixed-case
// targets would 404 at delivery.
const IMAGE_STEM_MAP = {
  HeaderImageResidential: `${DAM_BASE}/headerimageresidential.webp`,
  AppStoreWhite: `${DAM_BASE}/appstorewhite.png`,
  GooglePlayWhite: `${DAM_BASE}/googleplaywhite.png`,
  airConditioner: `${DAM_BASE}/airconditioner.png`,
  saveElectricity: `${DAM_BASE}/saveelectricity.png`,
  efficientLighting: `${DAM_BASE}/efficientlighting.png`,
  wiseAppliances: `${DAM_BASE}/wiseappliances.png`,
  saveWaterHome: `${DAM_BASE}/savewaterhome.png`,
  saveWaterOutside: `${DAM_BASE}/savewateroutside.png`,
  waterUsage: `${DAM_BASE}/waterusage.png`,
  manPhone: `${DAM_BASE}/manphone.webp`,
};

function localizeImages(element) {
  element.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    // Filename stem is the segment before the first dot after the last slash,
    // e.g. ".../airConditioner.515d46c6.png" -> "airConditioner".
    const file = src.split('/').pop() || '';
    const stem = file.split('.')[0];
    if (stem && IMAGE_STEM_MAP[stem]) {
      img.setAttribute('src', IMAGE_STEM_MAP[stem]);
      img.removeAttribute('srcset');
    }
  });
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / widgets / consent that would otherwise interfere with parsing.
    // Verified in cleaned.html:
    //   #onetrust-consent-sdk (line 896), .ReactModalPortal (881), #modalRoot (7),
    //   .dameg-shadow-root-host (2), next-route-announcer (4),
    //   .damegCursor (883), .damegCursorMv (886/888), .damegReadingLine (890),
    //   .damegReadingLineTriangle (892)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.ReactModalPortal',
      '#modalRoot',
      '.dameg-shadow-root-host',
      'next-route-announcer',
      '.damegCursor',
      '.damegCursorMv',
      '.damegReadingLine',
      '.damegReadingLineTriangle',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome. Verified in cleaned.html:
    //   a.sr-only skip-to-content link (line 10),
    //   header.header_header__9OzUC (11),
    //   .primaryNavigation_container__NM_X7 (48),
    //   .dropdown_dropdown__4_Gn0 mega-menu panels (98, 201, 217),
    //   .primaryNavigationMobile_container__fMcyp (267),
    //   footer.footer_footer__Im9Y3 (783)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'nav',
      'a.sr-only',
      '.primaryNavigation_container__NM_X7',
      '.primaryNavigationMobile_container__fMcyp',
      '.dropdown_dropdown__4_Gn0',
      '.footer_footer__Im9Y3',
      'iframe',
      'link',
      'noscript',
    ]);

    // Repoint remaining images at the localized DAM copies.
    localizeImages(element);
  }
}
