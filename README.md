# Cold Plate Geometry Viewer

Interactive 3D view of the ASME K-16 / ITherm 2026–2027 cold plate assembly: chips, TIM, fin plate, gaskets and manifold, with the water path ("Follow the water").

Open `index.html` through a web server (GitHub Pages works). It will not load if opened directly from disk, because it reads `parts.json` and `geometry.b64.txt` next to it.

Files:
- `index.html`: the page
- `parts.json`: part names and colors
- `geometry.b64.txt`: the mesh data (base64)
