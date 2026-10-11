# PGSF project website

Static project page at `https://elezou.github.io/PGSF/`. No build step, framework, analytics, or third-party runtime requests are required.

Serve the repository root with `python -m http.server 8000` and visit `/PGSF/`.

## Content

- `index.html`: title, manuscript abstract, method description, videos, comparisons.
- `style.css`: responsive layout and accessible comparison controls.
- `app.js`: dataset / modality / reference selection, mouse / touch / keyboard sliders, enlarged views, and video selection.
- `data.js`: comparison assets and video metadata. Paths are relative to this folder.
- `assets/`: lossless WebP comparison images, browser-ready H.264 videos, locally hosted OFL fonts.

The three supplied 45-second videos retain 1920 × 1080 resolution and 45 fps. The videos show office0 (Replica), 8b5caf3398 (ScanNet++), and coffee_room (MuSHRoom). Static comparisons show office0, 88cf747085, and vr_room respectively.

## Reference availability

| Dataset | Mesh | RGB | Depth | Normal |
| --- | --- | --- | --- | --- |
| Replica | GT mesh capture | GT image | Method-to-method | Method-to-method |
| ScanNet++ | GT mesh capture | GT image | Method-to-method | Method-to-method |
| MuSHRoom | GT mesh capture | GT image | Captured GT depth | Derived from captured GT depth |

Depth displays are normalized per image and do not represent one shared metric scale. MuSHRoom reference normals are the supplied depth-derived visualizations, not native GT normal measurements. These distinctions are also displayed next to the controls. Image pixels are stored losslessly. Website comparisons are selected examples, not replacements for complete-scene metrics.

Author, paper, and method-code links are omitted until confirmed. Layout is inspired by GenRecon and Nerfies; the implementation is original. Font licenses are included in `assets/fonts/`.
