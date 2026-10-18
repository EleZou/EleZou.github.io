# VisPNF project website

Static project page at `https://elezou.github.io/VisPNF/`. No build step, framework, analytics, or third-party runtime requests are required.

Serve the repository root with `python -m http.server 8000` and visit `/VisPNF/`.

## Content

- `index.html`: title, manuscript abstract, method description, videos, comparisons.
- `style.css`: responsive layout and accessible comparison controls.
- `app.js`: dataset / modality / reference selection, mouse / touch / keyboard sliders, enlarged views, and video selection.
- `mesh-videos.js`: synchronized mesh-video comparison selection, playback state, background preloading, and pause-on-exit.
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

The 360-degree mesh comparison section appears immediately before the interactive image comparisons. Each 30-second clip compares a selectable baseline (PGSR, 2DGS, AmbiSuR) or ground truth on the left with VisPNF on the right. Dataset selection covers Replica office0, ScanNet++ 88cf747085, and MuSHRoom coffee_room. These scene IDs are independent of the existing image comparisons and VisPNF-only teaser videos.

The 15 supplied 1920 x 1080 / 45 fps videos are paired into 12 comparisons in `assets/videos/mesh-comparisons-vispnf/`, with fast and HD versions for each screen layout. A single stream provides exact synchronization through playback, seeking, buffering, looping, and fullscreen. MP4 metadata is at the start for streaming. The selected pair starts loading as soon as the page opens, regardless of scroll position. Once it has buffered, the remaining fast clips preload sequentially at low priority, preferring the current dataset and screen layout before preparing the other layout. Completed downloads use object URLs for immediate switching. Choosing an uncached pair interrupts background fetching to prioritize that selection; preloading resumes when it has buffered. Failed background requests leave direct streaming available.

The default Fast version uses 1600 x 490 at 30 fps on desktop and 640 x 784 on portrait phones. Both methods receive identical scaling and compression, with the complete 30-second camera path and full framing retained. H.264 encoding uses CRF 27, the slow preset, a one-second keyframe interval, and capped bitrates of 1 Mbps (desktop) and 0.7 Mbps (portrait). Fast files end in `-fast.mp4` and reuse the existing posters. The Quality selector explicitly loads HD when needed; switching quality preserves playback position, speed, and playing state.

HD pairs retain all 1,350 source frames at 45 fps. Desktop HD uses identical 1280 x 720 scaling for each view, producing a combined 2560 x 784 frame including method labels. Portrait HD uses 960 x 1176. The method header reads VisPNF; frame count, resolution, and camera timing are preserved.

Switching the comparator preserves playback position and speed; switching datasets starts the new camera path at zero. Native controls support seeking and fullscreen, with a separate play/pause button, half-speed playback, and a direct-video fallback. Labels remain visible in fullscreen. Keyboard arrow keys switch dataset and method tabs.

Portrait screens up to 600 px use corresponding `-portrait-fast.mp4` or `-portrait.mp4` clips with the same full views stacked vertically. VisPNF stays below the comparator. Rotating or resizing the screen preserves playback position. Desktop and landscape screens retain the larger side-by-side presentation. HD clips load only when the reader chooses HD.

The VisPNF-only teaser waits for a play action before downloading video data. Interactive comparison images load when their cards approach the viewport, while enlarged comparisons load immediately on request. This avoids competing with mesh playback for bandwidth. Comparison images remain lossless.

## Experimental results

The `#results` section follows the interactive comparisons and precedes the closing paragraph. It combines the main manuscript's reconstruction and rendering results in one compact table with shared dataset and method columns and two grouped metric headers. All 96 reported values, supplied rank colors, and bold best results (including ties) are preserved. Twelve unreported rendering entries use an en dash. Rankings fill each entire cell. The table fits on desktop; narrow screens scroll horizontally within the table region, with a visible swipe hint and method names kept visible while scrolling.

Figures 3 and 4 are lossless WebP exports from the manuscript PDFs in `assets/images/experiments/`. Figures 3 and 4 share the same display width and retain their original aspect ratios. Every plate links to its full-resolution image. New figure images load near the viewport; the previously requested continuous mesh-video preloading is retained.
