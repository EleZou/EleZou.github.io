# Anonymous PNFSurf project page

This static project page contains the PNFSurf method overview, reconstruction videos, interactive comparisons, and experimental results.

All media, fonts, styles, and scripts are hosted alongside this page. Replica examples use rendered views of real scanned interiors; the reported Replica metrics cover eight scenes.

Open `index.html` through a static web server. No build step is required.

Font licenses remain in `assets/fonts/`. Layout credits are retained in the page footer.

## Experimental results

The results section contains the five tables from the paper, including DTU at matched training time. The mesh gallery covers seven datasets and includes all 17 indoor scenes.

The mesh videos and image sliders each show one scene per dataset. All six mesh videos for a scene share a camera path and play together at 30 fps. The indoor videos complete one panoramic rotation in 16 seconds.
The sliders use matched panels from Figures 5 and 6 and the NeRF-Synthetic comparison in the supplement.

The mesh player switches between shaded meshes, depth from the meshes, and camera-space surface normals at the same playback position. A shared stream keeps all six methods synchronized. Each method links to its full-resolution clip. Depth colors share a fixed range across all frames and methods for each scene. For scan105 and bonsai, all three views use the same camera path fitted to the supplied clips.

## Page layout

The page uses the existing DiffWind-inspired layout and locally hosted Google Sans. Gallery images open at full web resolution. Tables scroll within their containers on narrow screens.
