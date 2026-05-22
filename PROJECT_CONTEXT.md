# Project Context

Last updated: 2026-05-21

## Repository

- GitHub: https://github.com/danielyezp/Della-website-coding.git
- Local workspace: `C:\Users\danielyip\Documents\Codex\theme_export__dellahome-com-dellahome-store-live__18MAY2026-1236pm`
- Shopify store: `dellahome-store.myshopify.com`
- Live theme ID: `188113486112`
- Development theme ID: `188639084832`
- Development theme name: `Development (c049eb-MARKETPLACEMGR)`
- Development preview URL: `https://dellahome-store.myshopify.com?preview_theme_id=188639084832`

Important operating rule:

- Do not push future changes to the Shopify live theme unless Daniel explicitly asks for a live/production push.
- Default to local files, GitHub sync, or the development/preview theme.

## Current Snapshot

This is a Shopify theme export containing:

- `assets/`
- `config/`
- `layout/`
- `locales/`
- `sections/`
- `snippets/`
- `templates/`

The workspace also includes local preview artifacts:

- `mini-split-landing-preview.html`
- `mini-split-landing-preview-desktop.png`
- `mini-split-landing-preview-mobile.png`
- `v0-version-review.png`
- `v0-version-review-full.png`

Additional planning context:

- `docs/PROJECT_CONTEXT.md` covers the mini split landing page prototype, Della catalog/source references, series grouping, and v0 review feedback.

## Shopify CLI Notes

- Use `shopify.cmd` on this Windows machine. `shopify.ps1` may be blocked by PowerShell execution policy.
- Local `127.0.0.1:9292` Shopify preview was unreliable during debugging because it hit verification/403 behavior.
- Prefer the Shopify preview theme URL for manual testing.
- Weglot/Shopify caching can serve stale HTML. Adding a fresh query parameter or using an alternate view helped verify fresh renders during debugging.

## Bundle / Multizone Cart Context

Problem investigated:

- On multizone bundle products, customers choose line set accessories together with the main HVAC SKU.
- Free accessory combinations were removed correctly when the main SKU was removed.
- Paid accessory combinations could remain in cart after removing the main SKU.

Root cause:

- Bundle cleanup used sequential `/cart/change.js` style removal by line key.
- Paid line set items could cause discounts/cart line recalculation, making later stale line keys invalid.

Current fix:

- Bundle lines share a `bundle_id` property.
- Main product line also carries `main_bundle: "true"`.
- When the main line is removed, cleanup fetches the current cart and sends one atomic `/cart/update.js` request setting every line in that bundle to `0`.
- This is implemented for both quick cart and cart page behavior.

Key active assets:

- `assets/theme-aacee141.js`
- `assets/product-44e9e671.js`
- `assets/quick-cart-89b41421.js`
- `assets/bundle-cart-422a0b7b.js`
- `assets/cart-89b3e123.js`

References:

- `snippets/vite-tag.liquid` loads `assets/theme-aacee141.js`.
- `assets/manifest.json` points to the current cache-busted assets above.
- Some older generated assets remain in `assets/`. Do not delete old hashed files unless all Liquid/manifest references have been checked.

## Add To Cart / Quick Cart Context

Recent behavior fixed:

- Add to cart initially had a delay before the shopping cart drawer showed the product.
- A later version made the header cart count update only after refreshing the page.

Current intended behavior:

- `assets/product-44e9e671.js` updates the cart state and header count immediately after add to cart.
- `assets/quick-cart-89b41421.js` waits for the quick cart refresh before opening so the drawer does not show stale/empty content.

## Server-Side Enforcement Note

Frontend restrictions are not enough for Shopify carts because a customer or script can add a variant directly by product/variant ID.

Recommended hardening path:

- Add Shopify Cart / Checkout Validation Function in a custom Shopify app.
- Enforce bundle rules server-side so orphan line set/accessory items cannot proceed to checkout without their matching main product bundle.
- This is app/function work, not just theme code.

## Delay App Removal

The previously tested "delay app startup" work was removed by request.

Current local state:

- `snippets/delay-javascript.liquid` has been removed.
- `layout/theme.liquid` no longer renders the delay snippet.
- `layout/theme.pagefly.liquid` no longer renders the delay snippet.
- Delay-related theme setting schema was removed from `config/settings_schema.json`.
- Delay-related locale/schema text was removed from `locales/en.default.schema.json`.

Accessibility/compliance-related app scripts should not be blocked or delayed.

## Chat And Call Page Context

Recent issue:

- On `/pages/chat`, the Live Chat and Call buttons stopped responding.

Current fix:

- `layout/theme.liquid` contains a global click handler for page links with visible labels like `Chat Now` and `Call Now`.
- Chat waits briefly for the Willdesk launcher to become available, then opens it.
- Call links normalize to `tel:+18008634143`.
- `templates/page.chat.json` and `templates/page.our-reviews.json` include the normalized call link.

## Liquid Error Context

Recent error:

```text
Liquid error (layout/theme line 12): Could not find asset snippets/homepage-lcp-preload.liquid
Liquid error (layout/theme line 13): Could not find asset snippets/collection-lcp-preload.liquid
Liquid error (layout/theme line 14): Could not find asset snippets/product-lcp-preload.liquid
```

Resolution:

- The render references for those LCP preload snippets were removed from `layout/theme.liquid`.
- The current local `layout/theme.liquid` should not depend on those snippets.
- Verification after the fix showed no visible/source Liquid error on homepage or `/pages/chat`.

Related structured data fix:

- `snippets/structured-data.liquid` uses safer logo fallback variables.
- It avoids producing `https://https://...` when `shop.url` already contains a scheme.

## Production History Note

Some live theme pushes happened earlier in the debugging session to resolve urgent customer-facing issues. After Daniel's instruction, future work should not be pushed to live automatically.

If a live push is explicitly requested later, use scoped Shopify CLI uploads with `--only` where possible, for example:

```powershell
shopify.cmd theme push --store dellahome-store.myshopify.com --theme 188113486112 --allow-live --nodelete --only path/to/file
```

## Validation Reminders

Before pushing code changes anywhere:

- Run `git status -sb`.
- Check Liquid references when changing/removing snippets.
- Verify cart bundle behavior with both free and paid line set options.
- Verify quick cart opens with the latest cart contents.
- Verify header cart count updates without page refresh.
- Verify `/pages/chat` chat/call buttons still respond.

For Shopify live deployment:

- Stop and get explicit confirmation first.
