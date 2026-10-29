# New-label announcement

Approved for production release on 2026-10-27. Inserted between the research standards strip and the intact
featured-products/countdown section. CTA now opens the separate `catalog.html` page.

The shared 33-item approved inventory is in `new-label-products.js`. It drives
the featured grid and animation; `scripts/test-featured-catalog.cjs` checks parity.
The old `tirzepatide.webp` is excluded; `tirzepatide-20261027.webp` is included.
All sources are full square photos in `assets/products/20261022/`, not cutouts.
320px WebP derivatives in `assets/products/label-reveal/` preserve the entire
composition; the full set totals 342,986 bytes, including Wolverine.

Uses existing Sora/Manrope typography, paper/pink/background/radius tokens and a
native blue-black backdrop with a subtle cyan/teal glow. No global CSS rules or animation libraries added.
The 440px desktop panel adapts naturally on mobile. Cards move on CSS transforms
with negative delays; each new image is selected only at an offscreen loop boundary.
The center text never animates. Decorative cards are inert and hidden from assistive
technology. Observers defer image requests, pause offscreen, and track panel height.
Reduced motion keeps the distributed cards static. The visible pause/play button
was removed at the user's request; offscreen and hidden-tab pausing remain.

Run `node scripts/test-new-labels.cjs` for asset, lifecycle and integration checks.
Browser review covers desktop/mobile placement, photo composition,
catalog activation, offscreen pausing, no horizontal overflow and live countdown.
