# AEM Author — Edge Delivery `franklin.delivery` servlet returns empty markup for `/content/taqa-ue/en/*`

**Date raised:** 2026-09-23
**Project / site:** `nshahwan` / `taqa-ue` (branch `main`)
**Author instance:** `https://author-p208666-e2179906.adobeaemcloud.com`
**Severity:** Blocking — no page under `/content/taqa-ue/en/` can be delivered (preview or live)

---

## Summary

The AEM Edge Delivery integration on the author instance (`franklin.delivery` servlet)
returns an **empty document** for pages under `/content/taqa-ue/en/`, even though the
pages exist and render correctly through the standard page renderer. Because the EDS
publish pipeline (`admin.hlx.page`) pulls page markup from this servlet, it generates
**0-byte markdown**, so preview and live both serve an empty page (`<div></div>`).

This affects the **entire `en/` subtree**, not a single page — confirmed on both
`.../en/help-and-support/certificates` and `.../en/help-and-support/transfer`.

---

## The core symptom (two servlets, different results)

For the same page, on the **same author instance**:

| Request | Result |
|---|---|
| `GET /content/taqa-ue/en/help-and-support/certificates.html` (standard page renderer) | ✅ **Full content** — all blocks render (verified visually in browser) |
| `GET /bin/franklin.delivery/nshahwan/taqa-ue/main/help-and-support/certificates.html` (EDS delivery servlet) | ❌ **Empty** — no block content returned |

The EDS pipeline uses the **second** URL (the `franklin.delivery` mount defined in
`fstab.yaml`). That servlet returning empty is the root cause.

---

## Evidence chain (all reproducible)

1. **Content exists in author and renders.**
   Opening `…/content/taqa-ue/en/help-and-support/certificates.html` in a browser shows
   the full page (HELP & SUPPORT hero, CERTIFICATES, FIND YOUR SOLUTION, solution links,
   app-promo, energy tips, FAQ, support cards). Raw/unstyled — expected for the EDS render.

2. **The page node is correct.**
   Installed via FileVault package. Node: `/content/taqa-ue/en/help-and-support/certificates`
   with `jcr:primaryType="cq:Page"`, `jcr:content` `cq:template="/libs/core/franklin/templates/page"`,
   `sling:resourceType="core/franklin/components/page/v1/page"`, and the
   `root` → `section` → `block` (core/franklin components) hierarchy.

3. **The EDS delivery pull produces empty markdown.**
   - `POST https://admin.hlx.page/preview/nshahwan/taqa-ue/main/help-and-support/certificates`
     → `status: 200`, `error: null`, but…
   - `GET https://main--taqa-ue--nshahwan.aem.page/help-and-support/certificates.md` → **0 bytes**
   - `GET https://main--taqa-ue--nshahwan.aem.page/help-and-support/certificates.plain.html`
     → **13 bytes** = `\n<div></div>`

4. **`sourceLastModified` is stuck / does not reflect content.**
   The preview API reports `sourceLastModified` values (e.g. `15:40:48`, later `16:10:50`)
   that do not correspond to the actual page content being present, and republishing does
   not make the markdown non-empty.

5. **Branch-wide, not page-specific.**
   `/content/taqa-ue/en/help-and-support/transfer` shows the **same** behavior: preview
   `.md` = 0 bytes, `.plain.html` = 13 bytes. (Its `.aem.live` briefly served an older
   cached copy of 1898 bytes, which has since aged to 404 — confirming there is no current
   working delivery for the `en/` branch.)

6. **Everything on the EDS *code* side is correct and deployed** (ruled out):
   - `paths.json` mapping present and correct on the live pipeline:
     `/content/taqa-ue/en/help-and-support/certificates:/help-and-support/certificates`
   - Block CSS/JS all serve HTTP 200 (`/styles/styles.css`, `/styles/brand.css`,
     `/blocks/*/**.css`).
   - The publish pipeline itself is healthy (admin API returns 200 throughout).

---

## Relevant configuration

- **fstab.yaml mount (what the pipeline pulls):**
  `https://author-p208666-e2179906.adobeaemcloud.com/bin/franklin.delivery/nshahwan/taqa-ue/main`
- **Admin site config `content.source.url`:**
  `https://author-p208666-e2179906.adobeaemcloud.com/ui#/aem/sites.html/content`
- **paths.json root mappings:** `/content/taqa-ue/language-masters/en:/` (+ fr/es/ja/de),
  plus specific `/content/taqa-ue/en/help-and-support/{transfer,certificates}` entries.

Note the asymmetry: most mappings point at `…/language-masters/en`, but the actual authored
pages (transfer, certificates) live under `…/en` (no `language-masters`). The
`franklin.delivery` servlet may only be configured/enabled for the `language-masters` tree.

---

## What we need investigated (author-side — not accessible to the EDS/code team)

The `franklin.delivery` servlet is behind Basic auth (`WWW-Authenticate: Basic realm="Sling (Development)"`, HTTP 401), so it cannot be inspected or fixed from the EDS/repo side. Please check on the author instance:

1. **Why `GET /bin/franklin.delivery/nshahwan/taqa-ue/main/help-and-support/certificates.html`
   returns empty** while the standard `.html` renderer returns full content for the same node.
   (Compare the two responses directly while authenticated.)

2. **Whether the Edge Delivery / `franklin.delivery` configuration covers the `/content/taqa-ue/en`
   subtree** the same way it covers `/content/taqa-ue/language-masters`. If EDS delivery was only
   onboarded for `language-masters`, pages authored under `en/` won't be emitted.

3. **Whether the `en/` pages require the franklin/EDS content configuration** (e.g. the site's
   EDS onboarding, a `.helix/config`, or a content-fragment/model registration) that currently
   only exists for the `language-masters` branch.

4. **Whether the intended content root is `…/en` or `…/language-masters/en`.** If the site should
   deliver from `language-masters/en`, the content needs to live there (and the specific
   `paths.json` entries removed); if it should deliver from `en`, the `franklin.delivery` config
   needs to include that subtree.

---

## Quick verification once fixed

After the author-side change, this should return non-empty:

```
GET https://main--taqa-ue--nshahwan.aem.page/help-and-support/certificates.md
```

At that point the EDS/code side can re-run preview + publish and the page will render live
with full styling (all CSS is already deployed).
