/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsSolutionsParser from './parsers/cards-solutions.js';
import heroAppPromoParser from './parsers/hero-app-promo.js';
import carouselTipsParser from './parsers/carousel-tips.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsSupportParser from './parsers/cards-support.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/taqa-cleanup.js';
import sectionsTransformer from './transformers/taqa-sections.js';
import regroupAppTipsTransformer from './transformers/taqa-regroup-app-tips.js';
import pruneFaqLeftoversTransformer from './transformers/taqa-prune-faq-leftovers.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-solutions': cardsSolutionsParser,
  'hero-app-promo': heroAppPromoParser,
  'carousel-tips': carouselTipsParser,
  'accordion-faq': accordionFaqParser,
  'cards-support': cardsSupportParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'help-and-support',
  description: 'Help & Support page: page-intro hero, solution link cards, app-promo + energy-tips carousel, FAQ accordion, and customer support cards.',
  urls: [
    'https://taqadistribution.com/addc/en-us/residential/help-and-support/certificates',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['.headerFrame_herosection__gGU27'],
    },
    {
      name: 'cards-solutions',
      instances: ['.customCarousel_carousel__RG2l3', '.findYourSolutionCard_container__RLvzQ'],
    },
    {
      name: 'hero-app-promo',
      instances: ['.solutionsCarousel_appsectioncontainer__WLOtL'],
    },
    {
      name: 'carousel-tips',
      instances: ['.tipsCarousel_carousel__xtuBU', '.solutionsCarousel_tips__w2nPQ'],
    },
    {
      name: 'accordion-faq',
      instances: ['.faqsection_faqContainer__LM9T0'],
    },
    {
      name: 'cards-support',
      instances: ['.customerSupport_subContainer__7YEhA'],
    },
  ],
  sections: [
    {
      id: 'rc2',
      name: 'hero',
      selector: ['.headerFrame_herosection__gGU27'],
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'rc3',
      name: 'find-your-solution',
      selector: ['.customCarousel_container__sxi1j'],
      style: null,
      blocks: ['cards-solutions'],
      defaultContent: [],
    },
    {
      id: 'rc4',
      name: 'app-promo-and-tips',
      selector: ['.solutionsCarousel_appsectioncontainer__WLOtL'],
      style: null,
      blocks: ['hero-app-promo', 'carousel-tips'],
      defaultContent: [],
    },
    {
      id: 'rc5',
      name: 'faq',
      selector: ['.faqPanel_container__Tce5m'],
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: [],
    },
    {
      id: 'rc6',
      name: 'customer-support',
      selector: ['.customerSupport_container__Nzg04'],
      style: 'dark',
      blocks: ['cards-support'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then sections (afterTransform section
// breaks), then regroup app-promo + tips into one 2-column section (must run
// after sections so the block tables and section <hr>s already exist).
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
  regroupAppTipsTransformer,
  pruneFaqLeftoversTransformer,
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        // Avoid double-processing an element already matched by another selector for the same block
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already replaced by a prior parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // adjustImageUrls absolutizes every src against the source origin, including
    // the localized DAM paths repointed in the cleanup transformer. Convert those
    // back to root-relative so they resolve against the AEM site, not the source.
    main.querySelectorAll('img[src*="/content/dam/taqa-ue/"]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      const idx = src.indexOf('/content/dam/taqa-ue/');
      if (idx > -1) img.setAttribute('src', src.slice(idx));
    });

    // 6. Generate sanitized path
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
