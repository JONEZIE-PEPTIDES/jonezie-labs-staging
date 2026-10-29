# Compact Product Card Framing

Approved-label homepage and catalog cards use `.product-card-media`, capped at
270px high on desktop and 240px at widths up to 620px. The frame can shrink further
on narrow phones to preserve the original square photo without distortion.

The original hero image is still the visible product image. Its central 60% is
fully opaque; only the outside background fades into the studio plate. All
approved vials, caps, and labels fit safely within that center. No product pixels
were regenerated, replaced, stretched, or cropped. Image alt text and links are
unchanged, and the decorative background has no screen-reader content.

The image-generation preview subtly altered the label, so it is NOT used as a
product image. Instead, only its empty studio background is used behind the
original artwork. A CSS gradient continues the scene at unusually wide tablet
card sizes without hard edges. The shared background adds 17,728 bytes once,
rather than 33 additional landscape product downloads.

## Background Asset

- Project asset: `assets/products/card-studio-background.webp` (960 x 703).
- Generated with the built-in image-generation tool, then resized and encoded to
  WebP at quality 86. No CLI image-generation fallback was used.
- Selected source: `exec-b743a7b2-5a7b-4ccd-87d3-f140feb1a013.png` from the task's
  generated-images directory. The first panoramic candidate was discarded.
- Edit target: the user-approved landscape GLP-3(RT) preview,
  `exec-7f6f62f8-2922-4d80-99fb-5413a33c353e.png`.

Final generation prompt:

> Precise-object-edit. Remove ONLY the vial (red cap, metal, glass, label) from this
> image to create an EMPTY studio pedestal photograph. Fill its former area with
> the existing light gray studio background and stone pedestal top. KEEP EXACTLY
> the same output aspect ratio and composition. Do not resize, reposition or
> reshape the pedestal. Its back rim stays at approximately 78% image height and
> front rim at 93%. Keep all background gradients, illumination and stone texture
> outside the removed vial unchanged. No new objects, no products, no label or
> text. This is a background plate for overlaying the original unmodified product
> photo, so preserve the existing geometry.

## Scope

Only approved-label listing cards get the studio treatment. Old-label cards retain
their existing gradient treatment. Do not replace any hero or thumbnail assets.
`new-labels.js`, `new-labels.css`, `new-label-products.js`, announcement markup,
product detail pages, and `assets/products/label-reveal/` remain untouched.

Future approved photos using the same studio composition inherit this treatment
automatically. Check the original vial lies inside the central 60% and the
pedestal aligns before approving artwork with a different composition.
