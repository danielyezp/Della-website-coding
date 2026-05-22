# Project Context

## Repository

- GitHub: https://github.com/danielyezp/Della-website-coding.git
- Local workspace: `C:\Users\danielyip\Documents\Codex\theme_export__dellahome-com-dellahome-store-live__18MAY2026-1236pm`
- Shopify store: `dellahome-store.myshopify.com`
- Live theme last touched during this session: `dellahome-store/live` (`#188113486112`)

## Current Snapshot

This is a Shopify theme export containing the standard theme directories:

- `assets/`
- `config/`
- `layout/`
- `locales/`
- `sections/`
- `snippets/`
- `templates/`

The workspace also includes local preview artifacts from design/performance review work:

- `mini-split-landing-preview.html`
- `mini-split-landing-preview-desktop.png`
- `mini-split-landing-preview-mobile.png`
- `v0-version-review.png`
- `v0-version-review-full.png`

## Recent Performance Work

Recent theme-level optimization work focused on improving mobile and desktop Lighthouse/PageSpeed performance without changing the visual theme style:

- Added LCP preload helpers for home, collection, and product templates.
- Improved image loading priority so above-the-fold/LCP images are prioritized while offscreen images stay lazy.
- Adjusted product media loading so primary product media is prioritized and secondary media remains lower priority.
- Reduced unconditional product video resources by loading YouTube and Shopify Plyr resources only when relevant product media exists.
- Added lazy video handling for theme videos.
- Reviewed app script delay strategy. The `delay-javascript.liquid` snippet was later cancelled/removed by request and is not part of the current local snapshot.
- Accessibility app/script should not be blocked or delayed because it is treated as compliance-sensitive.

## Live Hotfixes Pushed

Only these two files were pushed to the live Shopify theme during the final z-index hotfix:

- `assets/custom-Blyy9yop.css`
- `snippets/theme-globals.liquid`

The hotfix addressed:

- Homepage mega menu overlapping with Trustpilot review cards.
- Mini cart / modal being covered by the raised header layer.

Final intended stacking order:

- Page content and Trustpilot widgets: low layer.
- Header and mega menu: `1500` / `1501`.
- Mini cart, modal, and slideout drawers: `2300`.

## Important Notes

- Do not blindly push the entire local theme to live if only a hotfix is intended. Use Shopify CLI `--only` for scoped live uploads.
- The live scoped push command used for the z-index hotfix was:

```powershell
shopify.cmd theme push --store dellahome-store.myshopify.com --theme 188113486112 --allow-live --nodelete --only assets/custom-Blyy9yop.css --only snippets/theme-globals.liquid
```

- The `custom.css` asset is mapped through `snippets/vite-tag.liquid` to `assets/custom-Blyy9yop.css`.
- `snippets/theme-globals.liquid` also contains inline z-index CSS so the hotfix is not dependent on stale cached custom CSS.

## Testing Notes

Primary manual checks after the hotfix:

- Homepage mega menu should appear above Trustpilot review cards.
- Mini cart should appear above the header/menu and page overlay.
- Product page cart drawer should not be visually cut through by the menu/header.

