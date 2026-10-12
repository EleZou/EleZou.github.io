# PGSF project website

Static project page at `https://elezou.github.io/PGSF/`. No build step, framework, analytics, or third-party runtime requests are required.

Serve the repository root with `python -m http.server 8000` and visit `/PGSF/`.

## Content

- `index.html`: title, manuscript abstract, method description, videos, comparisons.
- `style.css`: responsive layout and accessible comparison controls.
- `app.js`: dataset / modality / reference selection, mouse / touch / keyboard sliders, enlarged views, and video selection.
- `mesh-videos.js`: synchronized mesh-video comparison selection, playback state, lazy loading, and pause-on-exit.
- `data.js`: comparison assets and video metadata. Paths are relative to this folder.
- `assets/`: lossless WebP comparison images, browser-ready H.264 videos, locally hosted OFL fonts.

The three supplied 45-second videos retain 1920 × 1080 resolution and 45 fps. The videos show office0 (Replica), 8b5caf3398 (ScanNet++), and coffee_room (MuSHRoom). Static comparisons show office0, 66c98f4a9b, and vr_room respectively. ScanNet++ RGB, depth, and normal panels use the matched DSC01979 view (2DGS index 00019); mesh panels use the supplied captures of the same scene.

## Reference availability

| Dataset | Mesh | RGB | Depth | Normal |
| --- | --- | --- | --- | --- |
| Replica | GT mesh capture | GT image | Method-to-method | Method-to-method |
| ScanNet++ | GT mesh capture | GT image | Method-to-method | Method-to-method |
| MuSHRoom | GT mesh capture | GT image | Captured GT depth | Derived from captured GT depth |

Depth displays are normalized per image and do not represent one shared metric scale. MuSHRoom reference normals are the supplied depth-derived visualizations, not native GT normal measurements. These distinctions are also displayed next to the controls. Image pixels are stored losslessly. Website comparisons are selected examples, not replacements for complete-scene metrics.

Author, paper, and method-code links are omitted until confirmed. Layout is inspired by GenRecon and Nerfies; the implementation is original. Font licenses are included in `assets/fonts/`.

## Synchronized mesh videos

The 360-degree mesh comparison section appears immediately before the interactive image comparisons. Each 30-second clip compares a selectable baseline (PGSR, 2DGS, AmbiSuR) or ground truth on the left with PGSF on the right. Dataset selection covers Replica office0, ScanNet++ 88cf747085, and MuSHRoom coffee_room. These scene IDs are independent of the existing image comparisons and PGSF-only teaser videos.

The 15 supplied 1920 x 1080 / 45 fps videos are paired into 12 browser-ready H.264 clips in `assets/videos/mesh-comparisons/`. Both sides use identical 1280 x 720 scaling with the complete source framing and 1,350 frames retained. Each combined video is 2560 x 784, including a 64-pixel method-label strip. A single stream provides exact synchronization through playback, seeking, buffering, looping, and fullscreen. MP4 metadata is at the start for streaming. Only the active pair loads when it approaches the viewport.

Switching the comparator preserves playback position and speed; switching datasets starts the new camera path at zero. Native controls support seeking and fullscreen, with a separate play/pause button, half-speed playback, and a direct-video fallback. Labels remain visible in fullscreen. Keyboard arrow keys switch dataset and method tabs.

Portrait screens up to 600 px use corresponding `-portrait.mp4` clips with the same full views stacked vertically (960 x 1176, 45 fps). PGSF stays below the comparator. Rotating or resizing the screen preserves playback position; only the selected layout is loaded. Desktop and landscape screens retain the larger side-by-side presentation.
