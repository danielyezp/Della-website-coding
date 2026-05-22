# Project Context

## Workspace

Local project path:

```text
C:\Users\danielyip\Documents\Codex\theme_export__dellahome-com-dellahome-store-live__18MAY2026-1236pm
```

Target GitHub repository:

```text
https://github.com/danielyezp/Della-website-coding.git
```

## Source Materials Used

- Della Shopify theme export in this workspace
- Della Catalog V9 PDF from local downloads:

```text
C:\Users\danielyip\Downloads\Della Catalog V9 2.pdf
```

- Della website references:
  - `https://dellahome.com/`
  - `https://dellahome.com/collections/mini-split-single-zone`
  - `https://dellahome.com/collections/mini-split-multi-zone`
  - `https://dellahome.com/collections/ultra-heat`
  - `https://dellahome.com/collections/ultra-hyper-heat-22-f`

## Mini Split Page Goal

Create a collection landing page for the Mini Split product line. The page should quickly tell shoppers which series Della offers and guide them into the right collection.

The page should not feel like a long educational article. It should be brand-forward, product-led, and easy to scan.

## Product Grouping

Single zone series:

- Econo
- Motto
- Umbra
- Vario
- Serena
- Optima
- Optima Pro

Multi zone series and formats:

- Vario
- Optima
- Serena
- Cassette
- Concealed Duct
- Flexible Floor-Ceiling

Project / commercial-style indoor formats:

- Cassette
- Concealed Duct
- Flexible Floor-Ceiling

These project formats may deserve a separate landing page later.

## Comfort Level Grouping

Base model:

- Econo

Efficiency:

- Motto
- Umbra

High Efficiency:

- Vario
- Serena

Ultra Heat:

- Optima
- Cassette
- Concealed Duct
- Flexible Floor-Ceiling

Ultra Hyper Heat:

- Optima Pro

## Series Data For Prototype

| Series | Level | Zone fit | Refrigerant | Heating | BTU |
| --- | --- | --- | --- | --- | --- |
| Econo | Base model | Single zone | R32 | to 4F | 11K / 17K / 23K |
| Motto | Efficiency | Single zone | R32 | to 19F | 9K-24K |
| Umbra | Efficiency | Single zone | R32 | to 19F | 12K / 18K |
| Vario | High Efficiency | Single + Multi zone | R454B | to -13F | 9K-36K |
| Serena | High Efficiency | Single + Multi zone | R32 | to -13F multi-zone | 7K-36K |
| Optima | Ultra Heat | Single + Multi zone | R454B | to -13F | 9K-24K |
| Optima Pro | Ultra Hyper Heat | Single zone | R454B | to -22F | 12K |
| Cassette | Project unit / Ultra Heat | Single + Multi + Project | R454B | to -13F | 9K-24K |
| Concealed Duct | Project unit / Ultra Heat | Multi + Project | R454B | to -13F | 9K-24K |
| Flexible Floor-Ceiling | Project unit / Ultra Heat | Multi + Project | R454B | to -13F | 18K / 24K |

## Prototype Decisions

Current local prototype file:

```text
mini-split-landing-preview.html
```

Current design direction:

- Keep the page closer to Della's Shopify theme than a generic AI landing page
- Use real Della CDN product images where possible
- Avoid generated product imagery
- Keep the hero clean and product/brand-led
- Treat comfort levels as parallel collection groups, not numbered steps
- Keep series cards simple:
  - large product image
  - level badge and refrigerant badge on image
  - series name
  - heating range
  - BTU range
  - CTA

Removed from earlier versions:

- Long explanations
- Best-for fields
- Refrigerant as a spec row
- Floating hero cards
- Large FAQ and comparison table modules

## v0 Context

The user created a v0 version at:

```text
https://v0.app/chat/della-mini-split-series-eeAnjdvUNkO
```

Main feedback for v0:

- It initially did not match the Della theme closely enough
- It used generated or generic product images
- The hero looked too generic and did not show Della mini split products clearly
- The "Choose by comfort level" section should not look like steps, education cards, or numbered levels
- The comfort section should feel like a collection navigation module

Useful v0 correction prompt summary:

```text
Do not redesign Della. Adapt this page into Della's existing Shopify theme.
Make it feel like a Della Shopify collection landing page, not a generic v0 landing page.
Use real Della product images only.
Treat comfort levels as parallel collection groups, not steps.
```

## Next Implementation Step

After visual approval, convert the local static prototype into Shopify-compatible structure:

1. Decide whether this should become a new page template, a section, or a PageFly layout
2. Replace static data with Shopify collection/product links where needed
3. Use theme-native section settings where possible
4. Preserve Della theme styling and avoid adding unnecessary frontend dependencies
