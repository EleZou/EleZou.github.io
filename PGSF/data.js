window.PGSF_DATA = {
  "datasets": [
    {
      "id": "replica",
      "name": "Replica",
      "scene": "office0",
      "description": "Synthetic indoor scene",
      "images": {
        "mesh": {
          "PGSF": "assets/images/replica/mesh/pgsf.webp",
          "PGSR": "assets/images/replica/mesh/pgsr.webp",
          "2DGS": "assets/images/replica/mesh/2dgs.webp",
          "AmbiSuR": "assets/images/replica/mesh/ambisur.webp",
          "GT": "assets/images/replica/mesh/gt.webp"
        },
        "rgb": {
          "2DGS": "assets/images/replica/rgb/2dgs.webp",
          "PGSR": "assets/images/replica/rgb/pgsr.webp",
          "AmbiSuR": "assets/images/replica/rgb/ambisur.webp",
          "PGSF": "assets/images/replica/rgb/pgsf.webp",
          "GT": "assets/images/replica/rgb/gt.webp"
        },
        "depth": {
          "2DGS": "assets/images/replica/depth/2dgs.webp",
          "PGSR": "assets/images/replica/depth/pgsr.webp",
          "AmbiSuR": "assets/images/replica/depth/ambisur.webp",
          "PGSF": "assets/images/replica/depth/pgsf.webp"
        },
        "normal": {
          "2DGS": "assets/images/replica/normal/2dgs.webp",
          "PGSR": "assets/images/replica/normal/pgsr.webp",
          "AmbiSuR": "assets/images/replica/normal/ambisur.webp",
          "PGSF": "assets/images/replica/normal/pgsf.webp"
        }
      },
      "view": "00080"
    },
    {
      "id": "scannetpp",
      "name": "ScanNet++",
      "scene": "88cf747085",
      "description": "Real indoor capture",
      "images": {
        "mesh": {
          "PGSF": "assets/images/scannetpp/mesh/pgsf.webp",
          "PGSR": "assets/images/scannetpp/mesh/pgsr.webp",
          "2DGS": "assets/images/scannetpp/mesh/2dgs.webp",
          "AmbiSuR": "assets/images/scannetpp/mesh/ambisur.webp",
          "GT": "assets/images/scannetpp/mesh/gt.webp"
        },
        "rgb": {
          "2DGS": "assets/images/scannetpp/rgb/2dgs.webp",
          "PGSR": "assets/images/scannetpp/rgb/pgsr.webp",
          "AmbiSuR": "assets/images/scannetpp/rgb/ambisur.webp",
          "PGSF": "assets/images/scannetpp/rgb/pgsf.webp",
          "GT": "assets/images/scannetpp/rgb/gt.webp"
        },
        "depth": {
          "2DGS": "assets/images/scannetpp/depth/2dgs.webp",
          "PGSR": "assets/images/scannetpp/depth/pgsr.webp",
          "AmbiSuR": "assets/images/scannetpp/depth/ambisur.webp",
          "PGSF": "assets/images/scannetpp/depth/pgsf.webp"
        },
        "normal": {
          "2DGS": "assets/images/scannetpp/normal/2dgs.webp",
          "PGSR": "assets/images/scannetpp/normal/pgsr.webp",
          "AmbiSuR": "assets/images/scannetpp/normal/ambisur.webp",
          "PGSF": "assets/images/scannetpp/normal/pgsf.webp"
        }
      },
      "view": "DSC08813"
    },
    {
      "id": "mushroom",
      "name": "MuSHRoom",
      "scene": "vr_room",
      "description": "Consumer-device indoor capture",
      "images": {
        "mesh": {
          "PGSF": "assets/images/mushroom/mesh/pgsf.webp",
          "PGSR": "assets/images/mushroom/mesh/pgsr.webp",
          "2DGS": "assets/images/mushroom/mesh/2dgs.webp",
          "AmbiSuR": "assets/images/mushroom/mesh/ambisur.webp",
          "GT": "assets/images/mushroom/mesh/gt.webp"
        },
        "rgb": {
          "PGSF": "assets/images/mushroom/rgb/pgsf.webp",
          "PGSR": "assets/images/mushroom/rgb/pgsr.webp",
          "2DGS": "assets/images/mushroom/rgb/2dgs.webp",
          "AmbiSuR": "assets/images/mushroom/rgb/ambisur.webp",
          "GT": "assets/images/mushroom/rgb/gt.webp"
        },
        "depth": {
          "PGSF": "assets/images/mushroom/depth/pgsf.webp",
          "PGSR": "assets/images/mushroom/depth/pgsr.webp",
          "2DGS": "assets/images/mushroom/depth/2dgs.webp",
          "AmbiSuR": "assets/images/mushroom/depth/ambisur.webp",
          "GT": "assets/images/mushroom/depth/gt.webp"
        },
        "normal": {
          "PGSF": "assets/images/mushroom/normal/pgsf.webp",
          "PGSR": "assets/images/mushroom/normal/pgsr.webp",
          "2DGS": "assets/images/mushroom/normal/2dgs.webp",
          "AmbiSuR": "assets/images/mushroom/normal/ambisur.webp",
          "GT": "assets/images/mushroom/normal/gt.webp"
        }
      },
      "view": "frame_00009"
    }
  ],
  "videos": [
    {
      "id": "replica",
      "dataset": "Replica",
      "scene": "office0",
      "src": "assets/videos/replica.mp4",
      "poster": "assets/videos/replica-poster.webp",
      "duration": 45.0
    },
    {
      "id": "scannetpp",
      "dataset": "ScanNet++",
      "scene": "8b5caf3398",
      "src": "assets/videos/scannetpp.mp4",
      "poster": "assets/videos/scannetpp-poster.webp",
      "duration": 45.0
    },
    {
      "id": "mushroom",
      "dataset": "MuSHRoom",
      "scene": "coffee_room",
      "src": "assets/videos/mushroom.mp4",
      "poster": "assets/videos/mushroom-poster.webp",
      "duration": 45.0
    }
  ]
};
