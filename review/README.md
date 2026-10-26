# Anonymous VisPNF project page

This static project page contains reconstruction videos, interactive image comparisons, and experimental results for VisPNF.

All media, fonts, styles, and scripts are hosted alongside this page. Replica examples use rendered views of real scanned interiors; the reported Replica metrics cover eight scenes.

Open `index.html` through a static web server. No build step is required.

Font licenses remain in `assets/fonts/`. Layout credits are retained in the page footer.

## Experimental results

The results section follows the videos and interactive comparisons. One combined table reports all 108 metric values from the current manuscript, with separate reconstruction and rendering headers. Dense ranks preserve ties, and rank colors fill the entire cell. On narrow screens the table scrolls within its container.

Figures 4–7 show mesh comparisons including GOF, surface-error maps with a vertical colorbar, optimized Gaussian kernel close-ups against PGSR, and RGB/normal/depth comparisons including GOF. The method overview also matches the current manuscript. All five figures are lossless WebP exports, preserve their aspect ratios, and link to full-resolution images. Ablation experiments are omitted. Video playback and background preloading retain their existing behavior.
