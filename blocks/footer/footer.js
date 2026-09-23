import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const DAM_BASE = '/content/dam/taqa-ue';

// App-download badges (top band).
const APPS = [
  { alt: 'App Store', img: `${DAM_BASE}/appstoreblack.png`, href: 'https://apps.apple.com/in/app/addc/id1045166599' },
  { alt: 'Play Store', img: `${DAM_BASE}/googleplayblack.png`, href: 'https://play.google.com/store/apps/details?id=com.ADDC.addcApp' },
];

// Brand logos (middle band). The band is full-bleed: the teal "A TAQA GROUP
// COMPANY" mark sits on white at the left, and the white "TAQA Distribution"
// wordmark sits on a green→teal gradient panel that fills the rest.
const LOGO_GROUP = { alt: 'A TAQA Group Company', img: `${DAM_BASE}/footerlogo.png` };
const LOGO_WORDMARK = { alt: 'TAQA Distribution', img: `${DAM_BASE}/logowhite.png` };

// Social channels — teal circle icons. Each SVG is inlined so it inherits the
// brand teal via `fill` and needs no extra network request.
const SOCIAL = [
  { label: 'Facebook', href: 'https://www.facebook.com/TAQADistribution', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#0AB3A1"/><path fill="#fff" d="m21.8 21.48.72-4.48h-4.24v-3.12c0-1.28.48-2.24 2.4-2.24h2.08V7.56c-1.12-.16-2.4-.32-3.52-.32-3.68 0-6.24 2.24-6.24 6.24V17h-4v4.48h4v11.28q1.32.24 2.64.24t2.64-.24V21.48z"/></svg>' },
  { label: 'Instagram', href: 'https://www.instagram.com/taqadistribution/', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#0AB3A1"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.496 7h9.009a4.495 4.495 0 0 1 4.495 4.496v9.009A4.495 4.495 0 0 1 20.504 25h-9.008a4.495 4.495 0 0 1-4.496-4.496v-9.008A4.495 4.495 0 0 1 11.496 7" clip-rule="evenodd"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.949 10.713a.338.338 0 1 0 .002.674.338.338 0 0 0-.002-.674M18.546 13.454a3.6 3.6 0 1 1-5.091 5.092 3.6 3.6 0 0 1 5.091-5.092"/></svg>' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/taqa-distribution/', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#0AB3A1"/><path fill="#fff" d="M24 24h-3.328v-5.13c0-1.223-.022-2.796-1.73-2.796-1.731 0-1.995 1.332-1.995 2.709V24h-3.325V13.451h3.19v1.443h.046c.444-.83 1.53-1.705 3.15-1.705 3.37 0 3.992 2.185 3.992 5.025zM9.947 11.892A1.946 1.946 0 1 1 9.944 8a1.946 1.946 0 0 1 .003 3.892M11.892 24h-3.46V13.19h3.46z"/></svg>' },
  { label: 'Twitter', href: 'https://x.com/TAQADist', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#0AB3A1"/><path fill="#fff" d="m24 23.651-6.257-9.121.01.008L23.396 8H21.51l-4.596 5.322L13.264 8H8.32l5.842 8.517-.001-.001L8 23.65h1.885l5.11-5.92 4.06 5.92zM12.518 9.423l8.779 12.806h-1.494L11.017 9.423z"/></svg>' },
  { label: 'YouTube', href: 'https://www.youtube.com/@TAQADistribution', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#0AB3A1"/><path fill="#fff" d="M14.711 18.5v-4.921l4.473 2.469zm9.443-7.599c-.646-.684-1.37-.687-1.703-.727C20.072 10 16.504 10 16.504 10c-.008 0-3.576 0-5.955.174-.333.04-1.057.043-1.704.727-.51.521-.675 1.705-.675 1.705s-.17 1.39-.17 2.779v1.303c0 1.39.17 2.78.17 2.78s.166 1.183.675 1.704c.647.684 1.497.663 1.875.734 1.36.132 5.78.173 5.78.173s3.572-.005 5.951-.18c.332-.04 1.057-.043 1.703-.727.51-.521.676-1.704.676-1.704s.17-1.39.17-2.78v-1.303c0-1.39-.17-2.78-.17-2.78s-.166-1.183-.676-1.704"/></svg>' },
];

// Legal / utility links (bottom row).
const LEGAL = [
  { text: 'Contact Us', href: 'https://www.addc.ae/en-US/Home/Pages/ContactUs.aspx' },
  { text: 'Sitemap', href: '/addc/en-us/sitemap' },
  { text: 'Privacy Policy', href: '/addc/en-us/privacy-policy' },
  { text: 'Terms of Use', href: '/addc/en-us/terms-of-use' },
  { text: 'Ethics & Compliance', href: 'https://www.taqa.com/ethics-compliance/' },
];

const COPYRIGHT = '© TAQA Distribution - All rights reserved.';

function imageLink({ href, img, alt }) {
  const a = document.createElement('a');
  a.href = href;
  a.setAttribute('aria-label', alt);
  a.rel = 'noopener';
  a.target = '_blank';
  const image = document.createElement('img');
  image.src = img;
  image.alt = alt;
  image.loading = 'lazy';
  a.append(image);
  return a;
}

function buildFooter() {
  const footer = document.createElement('div');

  // Band 1 — download our apps
  const apps = document.createElement('div');
  apps.className = 'footer-apps';
  const appsLabel = document.createElement('p');
  appsLabel.className = 'footer-heading';
  appsLabel.textContent = 'Download our apps';
  const appsRow = document.createElement('div');
  appsRow.className = 'footer-badges';
  APPS.forEach((a) => appsRow.append(imageLink(a)));
  apps.append(appsLabel, appsRow);

  // Band 2 — brand logos (full-bleed: white zone + gradient zone)
  const logos = document.createElement('div');
  logos.className = 'footer-logos';

  const groupZone = document.createElement('div');
  groupZone.className = 'footer-logo-group';
  const groupImg = document.createElement('img');
  groupImg.src = LOGO_GROUP.img;
  groupImg.alt = LOGO_GROUP.alt;
  groupImg.loading = 'lazy';
  groupZone.append(groupImg);

  const wordZone = document.createElement('div');
  wordZone.className = 'footer-logo-wordmark';
  const wordImg = document.createElement('img');
  wordImg.src = LOGO_WORDMARK.img;
  wordImg.alt = LOGO_WORDMARK.alt;
  wordImg.loading = 'lazy';
  wordZone.append(wordImg);

  logos.append(groupZone, wordZone);

  // Band 3 — follow us + legal + copyright
  const content = document.createElement('div');
  content.className = 'footer-content';

  const social = document.createElement('div');
  social.className = 'footer-social';
  const socialLabel = document.createElement('p');
  socialLabel.className = 'footer-heading';
  socialLabel.textContent = 'Follow us';
  const socialRow = document.createElement('div');
  socialRow.className = 'footer-social-icons';
  SOCIAL.forEach((s) => {
    const a = document.createElement('a');
    a.href = s.href;
    a.setAttribute('aria-label', s.label);
    a.rel = 'noopener';
    a.target = '_blank';
    a.innerHTML = s.svg;
    socialRow.append(a);
  });
  social.append(socialLabel, socialRow);

  const legal = document.createElement('div');
  legal.className = 'footer-legal';
  const legalLinks = document.createElement('nav');
  legalLinks.className = 'footer-legal-links';
  LEGAL.forEach((l) => {
    const a = document.createElement('a');
    a.href = l.href;
    a.textContent = l.text;
    if (l.href.startsWith('http')) { a.rel = 'noopener'; a.target = '_blank'; }
    legalLinks.append(a);
  });
  const copy = document.createElement('p');
  copy.className = 'footer-copyright';
  copy.textContent = COPYRIGHT;
  legal.append(legalLinks, copy);

  content.append(social, legal);
  footer.append(apps, logos, content);
  return footer;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.textContent = '';

  // Prefer an authored footer fragment if one exists; otherwise render the
  // built-in TAQA footer chrome (identical on every page).
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  let fragment = null;
  try {
    fragment = await loadFragment(footerPath);
  } catch (e) {
    fragment = null;
  }

  if (fragment && fragment.firstElementChild) {
    const footer = document.createElement('div');
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
    block.append(footer);
    return;
  }

  block.append(buildFooter());
}
