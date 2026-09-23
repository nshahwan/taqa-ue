/* eslint-disable no-console */
/*
 * Convert a migrated page to JCR XML for AEM Universal Editor (xwalk).
 *
 * Pipeline (all in Node, using the content-import toolchain):
 *   source snapshot --project import bundle--> block-table markdown
 *                   --md2jcr(models, definition, filters)--> JCR XML
 *
 * Runs the same import transform that produced the .plain.html (so the block
 * tables + field hints are identical), then converts that markdown to JCR with
 * the project's aggregate UE component models. Writes <out>.
 *
 * Usage:
 *   node tools/importer/convert-to-jcr.mjs <sourceUrl> <snapshotHtml> <bundle.js> <xmlOut>
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const CID = '/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts';
// The DM/UE toolchain (playwright, helix-md2jcr) lives in the marketplace's
// content-import scripts, resolved at runtime — hence the dynamic requires.
/* eslint-disable import/no-dynamic-require, global-require */
const { chromium } = require(`${CID}/node_modules/playwright`);
const { md2jcr } = require(`${CID}/node_modules/@adobe/helix-md2jcr`);
/* eslint-enable import/no-dynamic-require, global-require */

const [, , sourceUrl, snapshotPath, bundlePath, xmlOut] = process.argv;
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const importerSrc = readFileSync(`${CID}/static/inject/helix-importer.js`, 'utf-8');
const bundleSrc = readFileSync(join(repoRoot, bundlePath), 'utf-8');
const snap = readFileSync(join(repoRoot, snapshotPath), 'utf-8');
const models = JSON.parse(readFileSync(join(repoRoot, 'component-models.json'), 'utf-8'));
const definition = JSON.parse(readFileSync(join(repoRoot, 'component-definition.json'), 'utf-8'));
const filters = JSON.parse(readFileSync(join(repoRoot, 'component-filters.json'), 'utf-8'));

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setContent(snap, { waitUntil: 'domcontentloaded' });
await page.addScriptTag({ content: importerSrc });
await page.addScriptTag({ content: bundleSrc });

const md = await page.evaluate(async (u) => {
  const cfg = window.CustomImportScript?.default;
  if (typeof cfg?.onLoad === 'function') await cfg.onLoad({ document });
  const res = await window.WebImporter.html2md(u, document, cfg, {
    toDocx: false, toMd: true, originalURL: u,
  });
  return res.md;
}, sourceUrl);

await browser.close();

const jcr = await md2jcr(md, { models, definition, filters });
writeFileSync(join(repoRoot, xmlOut), jcr, 'utf-8');
const blocks = (jcr.match(/v1\/block"/g) || []).length;
const items = (jcr.match(/v1\/block\/item/g) || []).length;
console.log(JSON.stringify({
  ok: true, xmlOut, jcrBytes: jcr.length, blocks, items,
}));
