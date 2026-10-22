# Production notes · Anisotropic Thermal Flux Map

Companion to `index.html`. Covers the frame map at beat resolution, the claims registry, parameters, safeguards, the security and supply-chain self-review, and the publish path.

## 1. Frame map (beat resolution)

| Frames | Beat |
|---|---|
| 0–28 | Plate fades in, oblique three-quarter view (shear 0.42, vertical squash 0.58) |
| 18–46 | Hot-side strip (gold overlay) and cold-side strip fade in |
| 30–48 | Callouts: heat input, heat output |
| 40–92 | Twelve laminae reveal outer → inner |
| 48–149 | Camera resolves to plan view while pushing in (zoom 84 → 104 px/unit) |
| 72–90 | Callout: patterned annulus |
| 88–108 | Object region appears (hatched disc) |
| 104–146 | Callouts: object, background plate (lower left), R1, R2 (lower right) |
| 143–157 | Dissolve A → B (camera held static so both scenes register pixel-exactly) |
| 156–176 | Section wedge dims everything outside 22°–72°, r 0.5–2.75 |
| 158–212 | Push to the wedge (zoom 104 → 400) |
| 168–192 | r̂ arrow and label at P |
| 204–228 | θ̂ arrow and label at P |
| 232–262 | R1, R2, laminae, object callouts |
| 254–292 | Tensor card: κ = diag(κ_r, κ_θ); series → low, parallel → high |
| 293–307 | Dissolve B → C (camera held) |
| 308–352 | Pull back to the full plate |
| 318–346 | Streamlines fade in; tracer starts |
| 326–350 | Input arrows (gold), output arrows (neutral) |
| 340–360 | Control card (violet) |
| 374–470 | Anisotropy ratio sweeps 1 → 60 (log) |
| 436–484 | Pathway markers ①②③ |
| 480–496 | Energy-accounting line |
| 503–517 | Dissolve C → D |
| 510–602 | Isotherms sweep left → right; streamlines grow |
| 560–604 | Panel callouts |
| 598–612 | P markers in both panels |
| 604–628 | Inset opens (×7) |
| 622–640 | −∇T arrow |
| 640–658 | q arrow |
| 656–674 | Angle arc and φ readout |
| 743–757 | Dissolve D → E |
| 750–812 | Three panels pull back (zoom 96 → 46) |
| 784–850 | Isotherms, reference isotherms, faint flux reveal |
| 796–896 | Chart card, curve, markers |
| 840–930 | Limits card and its seven lines |
| 850–904 | Panel notes and dipole readouts |
| 940–1019 | Stable overview, last caption held |

## 2. Claims registry

| # | Statement (as shown) | Grade | Basis |
|---|---|---|---|
| 1 | Flux need not be normal to isotherms in anisotropic media | Verified | q = −κ∇T with tensor κ; q ∥ −∇T only when κ is a scalar multiple of identity or ∇T is an eigenvector |
| 2 | Steady state: ∇·q = 0 ⇒ Q_in = Q_out, no storage, no generation | Verified | Energy conservation for steady conduction without sources |
| 3 | κ_r: series across laminae → low; κ_θ: parallel along laminae → high | Verified, qualitative | Effective-medium bounds for layered composites (harmonic vs arithmetic mean) |
| 4 | Graded shell: exterior straight and undisturbed; core at uniform intermediate T; no flux enters the core | Model result | Closed-form transformation solution in 2D steady state; idealized |
| 5 | φ ≈ 54° at P | Computed | acos of the normalized dot product of q and −∇T at P = (1.45 cos 0.95, 1.45 sin 0.95) in the graded model |
| 6 | |D|/(G R1²) = 0.818 (bare), 0.297 (ratio 3), 0 exact (graded) | Computed | 4×4 interface solve; bare value equals (κ0−κ_c)/(κ0+κ_c) |
| 7 | Disturbance curve vs ratio | Computed | 61 log-spaced evaluations of the same solve; axes labeled "mathematical diagram, not measured" |
| 8 | Closed-loop net flux residual ≈ 1e-16 | Computed | Midpoint quadrature over a rectangle in the ratio-3 model; a numerical check, not a physical measurement |
| 9 | Real builds retain residual disturbance and losses | Inferred | Follows from the ideal profile being unrealizable and from unmodeled effects listed on screen; no specific device data cited |
| 10 | Not modeled: contact resistance, finite layer count, 3D leakage, convection, radiation | Verified (scope statement) | These effects are absent from the equations used |
| 11 | Thermal conduction only; no optical invisibility | Verified (scope statement) | Nothing in the model or the reference's mechanism concerns optics |

Nothing on screen states a dimension, material, temperature, efficiency, certification, vendor detail, or performance gain.

## 3. Parameters (all illustrative)

| Symbol | Value | Role |
|---|---|---|
| R1, R2 | 1, 2 | Object and shell radii, dimensionless |
| κ0, G | 1, 1 | Background conductivity, far-field gradient magnitude |
| κ_c | 0.1 κ0 | Object conductivity |
| √(κ_r κ_θ) | κ0 | Shell geometric-mean conductivity in the homogeneous model |
| Ratio sweep | 1 → 60 | Segment C control |
| Comparison ratio | 3 | Segment E panel 2 |
| Laminae | 12 | Visual pattern only; the homogeneous model uses effective κ_r, κ_θ |
| Isotherm levels | ±0.25, ±0.75, … | Offset so no level sits at T = 0 (ideal core) |

## 4. Safeguards

| Area | Mechanism |
|---|---|
| Frame contract | `TOTAL = 30 × 34 = 1020` asserted; segment table must be contiguous and end at 1019 or the script throws before rendering |
| Determinism | `render(f)` depends only on `f`; dash offset is `f`-derived; no `Date`/`performance` inside the renderer |
| Clamp | Every render path clamps to 0…1019; URL `?frame=` is coerced and clamped |
| Reduced motion | Autoplay off, dash offset frozen, tracer parked |
| Photosensitivity | No flashing element; the fastest cycle is a dash offset drifting ~1.25 px/frame; dissolves are 14 frames; no position jitter |
| Legibility | HUD legibility bands; every callout has a dark backing |
| Content | Claims registry above; model numbers labeled "model"; no operational instructions; no hazard content |
| Numerics | Ideal κ_θ → ∞ never evaluated directly (flux uses the finite closed form); marching squares interpolation clamped; streamline integration stops on |q| < 1e-9 or leaving the window; streamline seeds offset from the y = 0 symmetry line so no direction-only path is drawn through the near-zero-flux core |
| Render failure | `show()` traps exceptions from `render()`, stops playback, and writes the frame number and message to the status line instead of leaving a frozen or blank stage |
| Self-check | Three model assertions run at load and print pass/fail in the footer |
| Page | CSP meta blocks all external loads, connect, forms, base-URI, objects; `referrer: no-referrer`; `rel="noopener noreferrer"` on the two citation links |
| Accessibility | Canvas `role="img"` with label; HTML transcript and frame map under the stage; keyboard controls; `aria-live` status |
| Export | Feature detection for `captureStream`/`MediaRecorder`; failure message instead of a silent no-op |

## 5. Security and supply-chain self-review

The standing `senior-appsec-engineer` and `release-supply-chain-engineer` agents live on the local workstation (`C:\Users\chaus\.cursor\agents`) and are not present in this cloud VM, so this pass was done directly with the same lenses.

Findings:

- Inline script and style under CSP `'unsafe-inline'`. Required by the single-file format. Benign here: the page performs zero network requests and has no inputs that reach `innerHTML` or `eval`. Alternative if the trade-off becomes unacceptable: split into `index.html` + `app.js` and switch to `script-src 'self'`.
- No third-party dependencies at build or run time. Nothing to pin, nothing to audit for typosquats.
- No CI workflow is shipped. Pages serves static files directly from `gh-pages`; there is no build step to compromise. If a workflow is added later, pin actions by SHA.
- No secrets, tokens, hostnames, or deploy scripts in the repository. The publish script uses the operator's own `gh` session and prints what it will do before acting.
- `tools/capture-frames-Cursor.mjs` spawns a local Chrome with `--no-sandbox`. That flag is needed in containerized environments and is benign for a local file you authored; do not point the tool at untrusted URLs.
- Looks alarming but is benign: `--remote-debugging-port=0` binds the DevTools endpoint to a random loopback port for the lifetime of one capture run and is killed at exit.

Pre-deploy gate (`preflight-security`) applies to Hostinger estate deploys. This artifact ships to GitHub Pages only; the equivalent check is that the repo contains exactly the files listed in section 7 and nothing else.

## 6. Asset frame

1. What it is: a frame-indexed Canvas explainer of anisotropic heat-flux steering, with a verifiable analytic model behind every drawn line.
2. Who it is for: metamaterials researchers, instructors, and technical marketers who need an honest mechanism visual rather than a rendered "invisibility" clip.
3. Why it wins: every quantity on screen is computed from stated equations, graded, and reproducible with `?frame=N`; most explainers in this space are keyframed artwork.
4. Structure: five segments mapped to the brief, shared physics kernel, camera per segment, HUD and captions as a global layer.
5. Discovery: GitHub Pages URL, repo About and topics, the HTML transcript is crawlable text.
6. Engagement: autoplay loop, scrub, segment jumps, inset, limits card.
7. Conversion: none built in; this is a content asset. A CTA block can be added under the stage without touching the renderer.
8. Money: indirect (portfolio, teaching, licensing of the renderer pattern to other verticals).
9. Launch: push `gh-pages`, confirm the Pages URL, link from the hub page of the explainer series.
10. Improve after launch: add a transient (time-dependent) mode, a layered-laminae effective-medium solver instead of the homogeneous shell, and PNG → MP4 release assets.

## 7. Files

```
index.html                       the explainer (reserved filename for Pages)
README.md                        overview, run, export, model, evidence grades, reference
PRODUCTION-NOTES-Cursor.md       this file
MEDIUM-ARTICLE-Cursor.md         companion long-form article with Medium SEO package appendix
publish-Cursor.sh                create repo, push main + gh-pages, enable Pages, set About/topics
tools/capture-frames-Cursor.mjs  frame-exact PNG capture over DevTools (Node 22+, Chrome)
.nojekyll                        disables Jekyll processing on Pages
.gitignore                       excludes local render output
```

## 8. Publish path (manual equivalent of `publish-Cursor.sh`)

```bash
gh repo create mizcausevic-dev/anisotropic-thermal-flux-map --public --source=. --remote=origin \
  --description "Code-driven 34 s motion explainer of anisotropic heat-flux steering in a thermal-cloak annulus (metamaterials). Deterministic 1,020-frame Canvas render, analytic 2D model, no dependencies."
git push -u origin main
git push -u origin gh-pages
gh api -X POST repos/mizcausevic-dev/anisotropic-thermal-flux-map/pages -f 'source[branch]=gh-pages' -f 'source[path]=/'
gh repo edit mizcausevic-dev/anisotropic-thermal-flux-map --add-topic metamaterials --add-topic thermal-cloak --add-topic heat-transfer \
  --add-topic anisotropic-conduction --add-topic transformation-thermodynamics --add-topic scientific-visualization \
  --add-topic motion-graphics --add-topic canvas-animation --add-topic explainer --add-topic github-pages
```

Rollback: `gh api -X DELETE repos/mizcausevic-dev/anisotropic-thermal-flux-map/pages` unpublishes the site; the branches stay.
