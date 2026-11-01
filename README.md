# Cold Plate Geometry Viewer

Interactive 3D view of the ASME K-16 / ITherm 2026–2027 cold plate assembly: chips, TIM, fin plate, gaskets and manifold, with the water path ("Follow the water").

Open `index.html` through a web server (GitHub Pages works). It will not load if opened directly from disk, because it reads `parts.json` and `geometry.b64.txt` next to it.

Files:
- `index.html`: the page
- `parts.json`: part names and colors
- `geometry.b64.txt`: the mesh data (base64)

## Viewer controls

- Rotate with drag, zoom with the mouse wheel or trackpad, and pan with right-drag.
- Use the view presets to isolate the water path, fins, chip stack, or a section cut.
- **Reset current view** restores the active preset after manual rotation or zooming.
- **Save view as PNG** downloads the current 3D assembly view for notes or reports.
- The light/dark appearance switch is remembered on the current device.

## Accessibility and resilience

- A keyboard skip link moves directly to the 3D assembly section.
- Loading and geometry errors are announced through live status regions.
- The interface follows the operating-system color preference until a visitor chooses a theme.
- Animated water flow respects the browser's reduced-motion preference.

## Troubleshooting

If the model does not appear, confirm that the page is being served over HTTP rather than opened as a local `file://` URL. The viewer also needs access to the pinned Three.js CDN resources and the two geometry data files in this repository.
