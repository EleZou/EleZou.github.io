# Anonymous VisPNF project page

This static project page contains reconstruction videos, interactive image comparisons, and experimental results for VisPNF.

All media, fonts, styles, and scripts are hosted alongside this page. Replica examples use rendered views of real scanned interiors; the reported Replica metrics cover eight scenes.

Open `index.html` through a static web server. No build step is required.

Font licenses remain in `assets/fonts/`. Layout credits are retained in the page footer.

## Experimental results

The results section follows the videos and interactive comparisons. One combined table reports all 108 metric values from the current manuscript, with separate reconstruction and rendering headers. Dense ranks preserve ties, and rank colors fill the entire cell. On narrow screens the table scrolls within its container.

Figures 5–8 show mesh comparisons including GOF, surface-error maps, optimized Gaussian kernel close-ups against PGSR, and RGB/normal/depth comparisons including GOF. The method overview matches the current manuscript. All five figures are lossless WebP exports, preserve their aspect ratios, and link to full-resolution images. Video playback and background preloading retain their existing behavior.

## Page layout

Typography and layout follow DiffWind: the same Google Sans title font, 48 px publication title, 32 px section headings, 16 px body text with 1.5 line height, and a centered 768 px content column. The source declares Jost without loading it; the same sans-serif fallback is used for body text. Google Sans is bundled locally with its OFL license. The abstract precedes the video and method overview. Captions are concise, and duplicate analysis is omitted. The table values and media remain unchanged.
