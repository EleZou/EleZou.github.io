# PNFSurf project website

Static project page at `https://elezou.github.io/VisPNF/`. No build step, framework, analytics, or third-party runtime requests are required.

Serve the repository root with `python -m http.server 8000` and visit `/VisPNF/`.

## Comparisons

The 360° videos and image sliders use one scene per dataset. Each player offers 2DGS, GOF, PGSR, AmbiSuR, PNFSurf-P, and PNFSurf-A. The six videos for each scene share a camera path and material. Each clip loops after 8 seconds at 800 × 450 and 24 fps. Image sliders use matched views from the paper and supplement.

| Dataset | Scene |
| --- | --- |
| Replica | office1 |
| ScanNet++ | 8b5caf3398 |
| MuSHRoom | kokko |
| DTU | scan37 |
| NeRF-Synthetic | mic |
| Tanks and Temples | Ignatius |
| Mip-NeRF 360 | garden |

The three longer indoor reconstruction videos are available below the 360° player.

## Experimental results

The results section contains the five tables from the paper, including DTU at matched training time. Rank colors and ties follow the manuscript. Tables scroll within their own containers on narrow screens.

The mesh gallery spans seven datasets and includes all 17 indoor scenes. The indoor galleries also contain RGB, normal, and depth comparisons.

## Page layout

The page uses the existing DiffWind-inspired layout and locally hosted Google Sans. The bicycle teaser and abstract precede the method overview, videos, and comparisons.
