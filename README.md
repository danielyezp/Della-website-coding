# Della Website Coding

Shopify theme snapshot and working codebase for Della Home.

This repository contains the exported Shopify theme files plus local context for recent cart, bundle, chat/call, and performance/debugging work.

Start with [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md). It records the store/theme IDs, local workflow notes, important recent fixes, and the rule that future work must not be pushed to the live Shopify theme unless that is explicitly requested.

Additional planning context for the mini split landing page prototype is in [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md).

Additional Mini Split landing page planning context is in [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md).

## Structure

- `assets/` - compiled CSS/JS, images, and theme assets
- `config/` - Shopify theme settings
- `layout/` - theme layouts
- `locales/` - locale/schema text
- `sections/` - Shopify sections
- `snippets/` - reusable Liquid snippets
- `templates/` - Shopify JSON/Liquid templates

## GitHub Sync

Remote repository:

```text
https://github.com/danielyezp/Della-website-coding.git
```

This repo is intended as a source snapshot and collaboration backup. Treat Shopify live theme deployment as a separate manual step that requires explicit approval.
