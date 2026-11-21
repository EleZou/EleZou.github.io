# PNFSurf project website

Static project page at `https://elezou.github.io/VisPNF/`. No build step, framework, analytics, or third-party runtime requests are required.

Serve the repository root with `python -m http.server 8000` and visit `/VisPNF/`.

## Comparisons

The mesh videos and image sliders cover seven benchmarks. Each offers 2DGS, GOF, PGSR, AmbiSuR, PNFSurf-P, and PNFSurf-A. All six mesh videos for a scene share a camera path and play together. The indoor videos show selected views in short sweeps. The sliders use matched panels from Figures 5 and 6 and the NeRF-Synthetic comparison in the supplement.

| Dataset | Image sliders | Mesh videos |
| --- | --- | --- |
| Replica | office1 | office1 |
| ScanNet++ | 66c98f4a9b | 8b5caf3398 |
| MuSHRoom | kokko | kokko |
| DTU | scan105 | scan105 |
| NeRF-Synthetic | mic | mic |
| Tanks and Temples | Truck | Ignatius |
| Mip-NeRF 360 | garden | bonsai |

The three longer indoor reconstruction videos are available below the mesh comparison player.

## Experimental results

The results section contains the five tables from the paper, including DTU at matched training time. Rank colors and ties follow the manuscript. Tables scroll within their own containers on narrow screens.

The mesh gallery spans seven datasets and includes all 17 indoor scenes. The indoor galleries also contain RGB, normal, and depth comparisons.

## Page layout

The page uses the existing DiffWind-inspired layout and locally hosted Google Sans. The bicycle teaser and abstract precede the method overview, videos, and comparisons.
