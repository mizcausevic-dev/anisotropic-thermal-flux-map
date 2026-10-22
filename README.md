# Anisotropic Thermal Flux Map

Code-driven, anatomy-style motion explainer of how an anisotropic conduction annulus steers heat flux around an object. Vertical: metamaterials. One HTML file, no dependencies, no network requests.

- Duration 34 s, 30 fps, 1,020 frames indexed 0–1019. Every frame is a pure function of its index.
- Physics: 2D steady-state analytic conduction (core, anisotropic shell, background). Qualitative and labeled as such on every frame.
- Live page: [mizcausevic-dev.github.io/anisotropic-thermal-flux-map](https://mizcausevic-dev.github.io/anisotropic-thermal-flux-map/), served from the `gh-pages` branch (see Publish).
- Companion article: `MEDIUM-ARTICLE-Cursor.md` (physics, design decisions, safeguards, and a Medium SEO package in the appendix).

## Run

Open `index.html` in a browser. It autoplays and loops. Controls: Space play/pause, arrow keys step (Shift for 10), Home/End, keys 1–5 jump to segments A–E.

URL parameters:

| Param | Effect |
|---|---|
| `?frame=N` | Render frame N and hold. Headless capture hook. |
| `?autoplay=0` | Load paused. |
| `?loop=0` | Stop at frame 1019. |

With `prefers-reduced-motion: reduce`, autoplay is off and the streamline dash offset stays fixed. Scrubbing still works.

## Segments

| Seg | Frames | Time | Beat | Camera |
|---|---|---|---|---|
| A | 0–149 | 0–5 s | Reveal: plate, hot-side input, cold-side output, patterned annulus, object | Three-quarter oblique view resolves to plan view while pushing in |
| B | 150–299 | 5–10 s | Section wedge; local frame r̂ and θ̂ at P; R1, R2; tensor κ = diag(κ_r, κ_θ) | Close-up on the wedge |
| C | 300–509 | 10–17 s | Flux streamlines while κ_θ/κ_r sweeps 1 → 60; inputs gold, outputs neutral, control violet; tracer on one pathway | Pull back to the full plate |
| D | 510–749 | 17–25 s | Graded shell: isotherms (left) and flux (right) in separate panels; inset at P shows q not parallel to −∇T | Split view, inset ×7 (labeled) |
| E | 750–1019 | 25–34 s | Bare object vs homogeneous anisotropic shell vs graded shell; disturbance chart; limits, losses, energy check | Pull back to a stable overview, held to the last frame |

## Frame-exact export

`tools/capture-frames-Cursor.mjs` drives one headless Chrome over DevTools, calls `window.__explainer.render(n)` for each frame, and saves the canvas as PNG. Node 22+ (built-in `WebSocket` and `fetch`), Chrome or Chromium on PATH, no npm packages.

```bash
node tools/capture-frames-Cursor.mjs --frames 0,149,300,510,750,1019 --out out/frames
node tools/capture-frames-Cursor.mjs --all --out out/frames
ffmpeg -framerate 30 -i out/frames/frame-%04d.png -c:v libx264 -pix_fmt yuv420p -crf 16 anisotropic-thermal-flux-map.mp4
```

Verified in the build environment before publishing (Chrome headless, Node 22): all 1,020 frames rendered in 28.6 s with no page exceptions; the assembled MP4 probes as 1020 frames, 30/1 fps, 34.000 s.

The in-page "Preview render (WebM)" button records the canvas through `MediaRecorder` while stepping frames. Its timing is wall-clock, so treat that file as a preview, not a frame-exact master.

## Model

Dimensionless 2D steady conduction on an infinite plane with a uniform far-field gradient (hot side at x < 0). Background κ0 = 1. Object r < R1 with κ_c. Shell R1 < r < R2.

- Homogeneous anisotropic shell: constant κ_r, κ_θ. T = f(r) cos θ with f = A r^m + B r^−m, m = √(κ_θ/κ_r). Four interface conditions solved exactly per frame. The exterior dipole coefficient D measures disturbance.
- Graded transformation shell: κ_r = κ0 (r−R1)/r, κ_θ = κ0 r/(r−R1). Shell field T = G R2/(R2−R1) · (r−R1) cos θ. Exterior undisturbed, core uniform, q_r = 0 at R1.
- Flux q = −κ∇T with κ a tensor in the (r̂, θ̂) frame, so q is not parallel to −∇T when κ_r ≠ κ_θ. Isotherms come from marching squares on the analytic field; streamlines from RK4 on the flux direction. Streamline seeds sit at half-spacing offsets so none lies on the y = 0 symmetry line, where a direction-only integration would draw a path through the near-zero-flux core.

Illustrative parameters, not from the reference: R2/R1 = 2, κ_c = 0.1 κ0, √(κ_r κ_θ) = κ0, 12 laminae, ratio sweep 1 → 60, comparison ratio 3.

Self-check at load (footer): isotropic shell reproduces the two-region disc dipole (κ0−κ_c)/(κ0+κ_c)·R1²; the ideal model's exterior equals the background field; the closed-loop net flux residual is at numerical noise.

## Evidence grades

| On-screen statement | Grade |
|---|---|
| q = −κ∇T; flux not normal to isotherms when κ is anisotropic | Verified (textbook) |
| ∇·q = 0 in steady state without sources | Verified |
| Laminae in series lower κ_r, in parallel raise κ_θ | Verified (effective-medium picture, qualitative) |
| Graded shell: exterior undisturbed, core uniform, no flux into core | Model result, 2D steady, idealized |
| φ ≈ 54° at P, D values, disturbance curve, flux residual | Computed from the model at runtime, not measured |
| Radii ratio, κ_c, sweep range, layer count | Illustrative |

Limits kept on screen in segment E: steady state only; core at uniform intermediate temperature, not cold; conduction only, no optical invisibility; ideal graded profile not realizable; contact resistance, finite layers, 3D leakage, convection, radiation not modeled; plate outline is a drawing window.

## Mechanism reference

Youming Zhang, Hongyi Xu, Baile Zhang, "Design, implementation, and extension of thermal invisibility cloaks," *AIP Advances* 5, 053402 (2015). [Article](https://pubs.aip.org/aip/adv/article/5/5/053402/977809/Design-implementation-and-extension-of-thermal) · [DOI 10.1063/1.4913996](https://doi.org/10.1063/1.4913996). Bibliographic metadata verified against Crossref. The reference supports the mechanism; camera, palette, cutaways, timing, and all numbers here are original illustrative choices. This is not a certified design, a device simulation, or a claim about any commercial implementation.

## Publish

`main` carries the source; `gh-pages` mirrors it and is the Pages source (root, with `.nojekyll`). To republish after edits from a machine with an authenticated `gh`:

```bash
bash publish-Cursor.sh         # idempotent: pushes main + gh-pages, enables or updates Pages, sets About and topics
```

If Pages is not yet enabled on the repository, the script's `gh api -X POST repos/<owner>/<repo>/pages` step does it; the manual equivalent is Settings → Pages → Source: Deploy from a branch → `gh-pages` / `/ (root)`. Manual steps and safeguards are listed in `PRODUCTION-NOTES-Cursor.md`.

## Repurposing

The renderer is a frame-indexed Canvas pipeline: `camera(frame)` + `scene(frame)` + HUD + captions, with a swappable analytic field. Replace `field()` with another 2D potential problem (electrostatic shielding, DC conductivity cloaks, Darcy flow around an inclusion) and the segments, inset, and comparison chart carry over unchanged.
