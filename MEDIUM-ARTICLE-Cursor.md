# How a Thermal Cloak Steers Heat: Anisotropic Flux, Visualized Frame by Frame

## A code-driven motion explainer of anisotropic thermal conductivity. One HTML file, an analytic 2D model, every number graded, every frame a pure function of its index.

> Image slot 1 (hero): frame 700. Split view, isotherms on the left, flux streamlines on the right, magnified inset at point P showing the flux vector rotated about 54 degrees away from the temperature gradient.
> Alt text: "Thermal cloak explainer, frame 700: isotherms and heat flux plotted in separate panels around a laminated annulus, with a magnified inset showing heat flux q rotated 54 degrees from minus grad T."

**TL;DR**

- A thermal cloak is not invisibility and it does not make the inside cold. It is a ring whose conductivity is a tensor: low across the ring, high around it. Heat flux follows the easy direction and goes around the object.
- In anisotropic media heat flux is not perpendicular to isotherms. Fourier's law with a tensor, q = −κ∇T, rotates the flux toward the high-conductivity axis. At one marked point in the model behind this explainer the deflection is about 54 degrees.
- The explainer runs 34 seconds at 30 fps, 1,020 frames, and is deterministic: `render(f)` depends on nothing but `f`. That makes it scrubbable, capturable to video without timing drift, and reviewable line by line.
- Every number on screen carries an evidence grade: verified, model result, computed, or illustrative. The live demo and source are linked at the end.

---

### Most thermal cloak animations lie a little

You have seen the clip. A glowing object sits in a metal plate, heat "bends" around it like light around a lens, and the inside turns a satisfying blue. It is beautiful, and it teaches three wrong things at once: that the effect is optical, that the object is being cooled, and that the mechanism is some kind of field magic rather than a property you can write down.

I wanted the opposite. A visual that a heat-transfer instructor could pause at any frame and defend. So I built the Anisotropic Thermal Flux Map as code: an analytic steady-state conduction model, a Canvas renderer where the frame index is the only input, and a claims registry that grades every statement the animation makes. This article is the physics, the design decisions, and the safeguards, in that order.

### What a thermal cloak actually is (and is not)

The idea comes from transformation thermodynamics, which borrows a move from transformation optics. Steady heat conduction obeys a Laplace-type equation. If you apply a coordinate transformation that opens a hole in space, the transformed equation looks like ordinary conduction in a material whose conductivity varies in space and differs by direction. Build that material and heat flows as if the hole were not there.

The reference I built on is Zhang, Xu, and Zhang, "Design, implementation, and extension of thermal invisibility cloaks," AIP Advances 5, 053402 (2015), DOI 10.1063/1.4913996. The paper is the basis for the mechanism and for the practical route to it: concentric laminae of alternating high- and low-conductivity materials, which approximate the required anisotropy. It is not the source of any geometry, dimension, material, or number in the explainer. Those are illustrative and labeled that way on every frame.

What a thermal cloak is not:

- Not optical. Nothing in the mechanism concerns light. "Invisibility" in the literature means invisibility to the exterior temperature field.
- Not a refrigerator. In the ideal design the core sits at a uniform intermediate temperature. It is shielded from the gradient, not cooled below the surroundings.
- Not transient. The clean result is a steady-state result. Switch-on behavior is a different problem.
- Not perfect in practice. The ideal profile requires conductivity that diverges at the inner radius. Real builds use finite layers and retain residual exterior disturbance.

### The physics in four lines

**1. Fourier's law with a tensor.** In the local radial and circumferential frame of the ring, q = −κ∇T with κ = diag(κ_r, κ_θ). Radial and circumferential conductivity are allowed to differ. Everything else follows from this.

**2. Why laminae make a tensor.** A radial heat path crosses the laminae one after another: resistances in series, so κ_r is the harmonic mean of the layer conductivities and the poor conductor dominates. A circumferential path runs along the laminae: conductors in parallel, so κ_θ is the arithmetic mean and the good conductor dominates. For equal-thickness layers with a 10:1 material contrast the ratio κ_θ/κ_r comes out near 3; at 100:1 it is about 25. That is textbook effective-medium arithmetic and the explainer treats it qualitatively.

**3. A homogeneous anisotropic shell has a closed form.** Put an object of conductivity κ_c inside a shell with constant κ_r and κ_θ, in a background of κ0 under a uniform far-field gradient G. Separation of variables gives T = (A r^m + B r^(−m)) cos θ inside the shell, with m = √(κ_θ/κ_r). Four interface conditions (temperature and radial flux continuous at R1 and R2) fix four unknowns. One of them, the exterior dipole coefficient D, measures how much the object disturbs the outside field. The explainer solves that 4×4 system on every frame as the ratio changes.

**4. The ideal graded shell has a cleaner one.** The transformation design gives κ_r = κ0 (r − R1)/r and κ_θ = κ0 r/(r − R1). The shell temperature is T = G · R2/(R2 − R1) · (r − R1) cos θ. Three things fall out: the exterior equals the undisturbed background exactly (D = 0), the core temperature is uniform, and the radial flux at R1 is zero so nothing enters the object. Note κ_θ → ∞ as r → R1. That divergence is the honest limit of the whole idea.

### Why heat flux is not perpendicular to isotherms

In an isotropic material κ is a scalar, so q is a scaled copy of −∇T and flux crosses isotherms at right angles. Most people carry that picture into every conduction problem. It is wrong the moment κ becomes a tensor.

Write the negative gradient in the local frame as (g_r, g_θ). Then q = (κ_r g_r, κ_θ g_θ). If κ_θ is ten times κ_r, the circumferential component is amplified tenfold relative to the radial one, and q swings toward θ̂. If α is the angle of −∇T from r̂ and β the angle of q, then tan β = (κ_θ/κ_r) tan α. The deflection φ = β − α is zero only when the gradient is aligned with an eigen-direction of κ or when κ is isotropic.

> Image slot 2: frame 700 inset detail (crop). Alt text: "Magnified inset at point P in a graded anisotropic shell: minus grad T drawn normal to the local isotherm, heat flux q rotated toward the circumferential direction, labeled phi approximately 54 degrees, model quantity."

The explainer makes this visible in segment D by refusing to overlay the two fields. Isotherms live in the left panel, flux streamlines in the right, and a magnified inset at a marked point P draws both vectors on top of each other at seven times scale with the magnification stated on screen. At P in the graded model, where the local κ_θ/κ_r is about 10, the model gives φ ≈ 54 degrees. That number is computed from the analytic field, labeled "model quantity, not a measurement," and the isotropic limit (φ = 0) is printed next to it.

Separation is a teaching decision, not a stylistic one. Overlaid, viewers assume orthogonality and never check. Separated, the exception becomes the point.

### Design rule: the frame is the unit of truth

The brief fixed the container: 34 seconds, 30 fps, 1,020 frames indexed 0 to 1019, five segments on fixed frame ranges. I made the code enforce that before it draws anything.

```js
const FPS = 30, DURATION_S = 34, TOTAL = FPS * DURATION_S, LAST = TOTAL - 1;
if (TOTAL !== 1020) throw new Error(`Frame budget violated: ${TOTAL}`);

const SEG = [
  { id: 'A', s: 0,   e: 149,  title: 'Reveal: patterned conduction annulus' },
  { id: 'B', s: 150, e: 299,  title: 'Define: radial and circumferential directions' },
  { id: 'C', s: 300, e: 509,  title: 'Contrast: qualitative conductivity' },
  { id: 'D', s: 510, e: 749,  title: 'Isotherms plotted separately from flux' },
  { id: 'E', s: 750, e: 1019, title: 'Compare: exterior field disturbance' },
];
SEG.reduce((p, s) => { if (s.s !== p) throw new Error('Segment gap at ' + s.id); return s.e + 1; }, 0);
if (SEG[SEG.length - 1].e !== LAST) throw new Error('Segments do not cover the frame budget');
```

Everything downstream is `render(f)`: clamp `f`, pick the segment, compute the camera, draw the scene, draw the HUD and caption. No `Date`, no `performance.now()`, no random numbers inside the renderer. The streamline dash offset that reads as motion is derived from `f`. Segment dissolves are 14 frames long and happen with the camera held still so both scenes register pixel-exactly during the blend.

Determinism sounds like an engineering nicety. It is a content property. It means `?frame=600` in the URL is a citation: anyone can open the same frame you are describing, and a headless browser can capture all 1,020 frames in the right order with no dependence on how fast the machine is.

The five segments, in frame order:

- **A (0 to 149): reveal.** Plate, hot-side input strip in gold, cold-side output strip, twelve laminae revealed outer to inner, object region, callouts for R1 and R2. The camera starts in an oblique three-quarter view and resolves to plan view while pushing in.
- **B (150 to 299): define.** A section wedge isolates one slice of the ring. Local r̂ and θ̂ arrows at P, then the tensor card: κ = diag(κ_r, κ_θ), series gives low, parallel gives high.
- **C (300 to 509): contrast.** Pull back to the full plate. Flux streamlines seeded along the input edge while a violet control readout sweeps κ_θ/κ_r from 1 to 60 on a log scale. Inputs in gold, outputs in neutral, control in violet, a single tracer following one pathway, and an energy-accounting line.
- **D (510 to 749): isotherms apart from flux.** The split view and the inset described above, for the graded shell.
- **E (750 to 1019): compare.** Three panels, a disturbance-versus-ratio chart, a limits card, and a pull-back to a stable overview that holds to the last frame.

> Image slot 3: frame 470. Alt text: "Segment C of the thermal cloak explainer: cyan heat-flux streamlines bending around a laminated annulus while a violet control readout shows the anisotropy ratio sweep, gold input arrows on the hot side."

### The field: marching squares and RK4 on an analytic solution

There is no mesh and no solver in the loop. The temperature field is closed-form and is sampled wherever the renderer needs it. Isotherms come from marching squares on a grid of samples, with contour levels at ±0.25, ±0.75, and so on, offset deliberately so no level sits at T = 0, where the ideal core is flat and a contour would be undefined. Streamlines come from fourth-order Runge-Kutta on the flux direction, seeded along the input boundary.

That seeding produced the one bug worth telling. An odd number of evenly spaced seeds put one seed exactly on the y = 0 symmetry line. A direction-only integration has no idea that the flux magnitude on that line collapses to nearly zero inside the ideal core, so it happily drew a straight path through the one region where the physics says nothing should enter. The fix is boring and permanent: fourteen seeds at half-spacing offsets, so none lies on the axis.

```js
const SEEDS = [];
for (let k = 0; k < 14; k++) SEEDS.push(-2.33 + (k + 0.5) * (4.66 / 14));
```

The page also checks itself at load and prints the result in the footer. Three assertions: with an isotropic shell the solver reproduces the known two-region disc dipole (κ0 − κ_c)/(κ0 + κ_c) · R1²; the ideal model's exterior equals the background field; and the net flux through a closed loop around the ring is at numerical noise, on the order of 1e-16. If any of those fail, the footer says so before anyone trusts a frame.

### Frame-exact capture without Puppeteer

Node 22 ships `fetch` and `WebSocket`. That is enough to drive Chrome over the DevTools protocol directly, with nothing to install and nothing to audit.

The capture tool spawns Chrome headless with `--remote-debugging-port=0`, reads the `DevTools listening on ws://...` line from stderr, opens a target with `PUT /json/new?<url>`, and connects a WebSocket. From there it is two methods: `Page.enable` and `Runtime.evaluate`.

```js
const evalJs = async expr => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
  return r.result.value;
};

for (const n of frames) {
  const dataUrl = await evalJs(
    `(() => { window.__explainer.render(${n}); return document.getElementById('stage').toDataURL('image/png'); })()`
  );
  writeFileSync(`frame-${String(n).padStart(4, '0')}.png`, Buffer.from(dataUrl.split(',')[1], 'base64'));
}
```

Because the page exposes `window.__explainer.render(n)` as a frozen, side-effect-free surface, the capture loop never waits on animation timing. In the build environment all 1,020 frames rendered in 28.6 seconds with zero page exceptions, and `ffmpeg -framerate 30` assembled an MP4 that probes as 1,020 frames at 30 fps, 34.000 seconds. The in-page "Preview render (WebM)" button exists for convenience, but it records through `MediaRecorder` on wall-clock time, so it is labeled a preview and not a master.

### Safeguards, because "it is just an explainer" is how bad science visuals ship

A motion explainer is a claim machine. Every label, arrow, and curve asserts something. The safeguards are what keep those assertions honest and the page safe to embed.

**Claims registry with evidence grades.** Every statement the animation makes is listed with a grade and a basis. Four grades are used:

- Verified: q = −κ∇T and the non-orthogonality of flux and isotherms under a tensor κ; steady-state ∇·q = 0; laminae in series lower κ_r and in parallel raise κ_θ.
- Model result: the graded shell's undisturbed exterior, uniform core, and zero inward flux, in 2D steady state, idealized.
- Computed: φ ≈ 54 degrees at P, the D values, the disturbance curve, the flux residual. Produced by the model at runtime, never measured.
- Illustrative: the radius ratio, the object conductivity, the sweep range, the layer count.

**On-screen scope labels.** The footer of every frame reads "schematic, not to scale, 2D steady-state conduction model, qualitative, dash motion = direction, not speed." The inset announces its magnification. The chart axis says "mathematical diagram, not measured." The last caption, held through the final frame, says "model result, not a measurement; real builds retain residual disturbance and losses."

**Energy accounting.** Steady state with no sources means ∇·q = 0, so the heat entering the hot side equals the heat leaving the cold side. The model checks this numerically and the result is printed on the limits card.

**No invented specifics.** Nothing on screen states a dimension, a material, a temperature, an efficiency, a certification, a vendor detail, or a performance gain. Where implementation detail would be needed, the frame shows a labeled schematic instead.

**Page safety.** Single file, zero network requests. A Content-Security-Policy meta tag blocks external loads, connections, forms, base-URI changes, and objects. The inline script required by the single-file format is the stated trade-off, documented in the production notes with the alternative (split into two files and tighten to `script-src 'self'`).

**Motion and accessibility.** No flashing element anywhere; the fastest cycle is a dash offset drifting about one pixel per frame; dissolves are 14 frames; nothing jitters. With `prefers-reduced-motion: reduce`, autoplay is off and the dashes hold still while scrubbing still works. The canvas carries `role="img"` with a label, the full transcript and frame map sit under the stage as crawlable HTML, and all controls work from the keyboard.

**Input and failure handling.** Every render path clamps to 0 to 1019 and the `?frame=` parameter is coerced before use. If `render(f)` throws, the player stops, writes the frame number and message to an `aria-live` status line, and refuses to leave a frozen or blank stage behind.

### What the comparison actually shows

> Image slot 4: frame 980. Alt text: "Segment E comparison: three panels showing exterior isotherms around a bare object, a homogeneous anisotropic shell, and an ideal graded shell, with a disturbance versus anisotropy ratio chart and a limits card."

Segment E lines up three cases under the same far-field gradient and reports the relative exterior dipole |D|/(G R1²) for each:

- Bare object, κ_c = 0.1 κ0, no shell: 0.818. That is just (κ0 − κ_c)/(κ0 + κ_c) = 0.9/1.1, which is also the first self-check.
- Homogeneous anisotropic shell at ratio 3 with √(κ_r κ_θ) = κ0: 0.297. Visible but reduced bending of the exterior isotherms.
- Ideal graded shell: 0, exactly, by construction. Exterior isotherms straight.

Below them, a curve of disturbance against anisotropy ratio on a log axis from 1 to 100, evaluated at 61 points from the same 4×4 solve. It falls monotonically and has no error bars, because there are no measurements to put bars on. The message is the shape, not the numbers: anisotropy buys reduction, and only the unrealizable graded profile buys zero.

### The limits that stay on screen

The limits card does not fade out. It is part of the stable overview the animation ends on.

- Steady state only. Transient response not shown.
- Core at a uniform intermediate temperature in the ideal design. Not a cold core.
- Thermal conduction only. No optical invisibility.
- The ideal graded κ is not realizable; layered builds leave residual exterior distortion.
- Not modeled: contact resistance, finite layer count, 3D leakage, convection, radiation.
- The plate outline is a drawing window; the model is an infinite 2D plane. Schematic, not to scale.
- Energy: ∇·q = 0; the closed-loop net flux residual is 1e-16 by quadrature, so Q_in = Q_out.

### Reuse it for a different field

The renderer is a frame-indexed pipeline: `camera(frame)` plus `scene(frame)` plus HUD and captions, over a swappable analytic `field()`. The same five segments, the same inset, and the same comparison chart work unchanged for any 2D potential problem with an inclusion: electrostatic shielding, DC conductivity cloaks, Darcy flow around a low-permeability region. Change the tensor and the labels; keep the discipline.

### FAQ

**Is a thermal cloak the same as thermal invisibility?**
Only in the narrow sense used in the literature: the exterior temperature field looks as if the object were not there. It has nothing to do with light or cameras. The explainer avoids the word "invisibility" on screen for exactly that reason.

**Does the object inside a thermal cloak get cold?**
No. In the ideal steady-state design the core sits at a uniform temperature between the hot and cold sides. It is shielded from the gradient, which protects it from a heat flux, but it is not cooled below its surroundings.

**Why is heat flux not perpendicular to isotherms in anisotropic materials?**
Because q = −κ∇T with a tensor κ scales the gradient's components differently along different axes. The flux rotates toward the high-conductivity direction. Orthogonality is a special case that holds for isotropic materials or when the gradient already points along a principal axis.

**Can you build a thermal cloak from ordinary materials?**
Approximately. Alternating concentric layers of a good and a poor conductor give low radial and high circumferential effective conductivity, which is the required anisotropy. The exact graded profile needs circumferential conductivity that diverges at the inner radius, so any real build is an approximation with residual disturbance.

**How do you make an animation deterministic enough for frame-exact video export?**
Make the frame index the only input. No clocks, no randomness, no dependence on previous frames inside the renderer. Expose a `render(n)` function, drive it from a headless browser, and read the canvas back as PNG. Assemble with a fixed frame rate.

### Links

- Live explainer (GitHub Pages): https://mizcausevic-dev.github.io/anisotropic-thermal-flux-map/
- Source, production notes, capture tool, claims registry: https://github.com/mizcausevic-dev/anisotropic-thermal-flux-map
- Mechanism reference: Zhang, Xu, Zhang, AIP Advances 5, 053402 (2015), https://doi.org/10.1063/1.4913996

Open the live page with `?frame=700` and you are looking at the inset from this article, pixel for pixel. That is the whole point.

---

*This article describes a code-driven, qualitative 2D steady-state conduction model built for teaching. It is not a certified design, a device simulation, or a claim about any commercial implementation. The reference supports the mechanism; geometry, numbers, palette, camera, and timing are original illustrative choices.*

---

## Appendix for the author: Medium SEO package (not part of the article body)

**SEO title (56 characters, limit 60):**
Thermal Cloak Physics: Anisotropic Heat Flux, Visualized

**SEO description (136 characters, limit 140):**
How a laminated annulus steers heat around an object: tensor conductivity, flux vs isotherms, and a deterministic 1,020-frame explainer.

**Medium tags (5):**
Metamaterials · Heat Transfer · Physics · Scientific Visualization · JavaScript

**Suggested slug:**
thermal-cloak-anisotropic-heat-flux-visualized

**Kicker (optional, above the title):**
Metamaterials, explained in code

**Primary keyword:** thermal cloak
**Secondary keywords:** anisotropic thermal conductivity, heat flux vs isotherms, transformation thermodynamics, thermal metamaterials, Fourier's law tensor, deterministic Canvas animation, headless Chrome frame capture, scientific visualization

**Keyword placement check:** primary keyword in title, subtitle, first 100 words, two H2 headings, FAQ questions, and image alt text. Secondary keywords each appear in at least one heading or FAQ question.

**Images (capture with the repo tool, then upload to Medium; each alt text is given in the body at its slot):**

```bash
node tools/capture-frames-Cursor.mjs --frames 149,260,470,600,700,980 --out out/stills
```

- Hero: frame-0700.png (split view with inset)
- Slot 2: crop of frame-0700.png to the inset circle
- Slot 3: frame-0470.png (segment C flux sweep)
- Slot 4: frame-0980.png (segment E comparison)
- Optional: frame-0149.png (end of reveal) and frame-0260.png (tensor card) for a mid-article break

**Canonical URL:** publish on Medium first and leave canonical at the Medium default. If the article is later mirrored to a personal site, set the mirror's canonical to the Medium URL.

**Reading time:** about 14 minutes at Medium's estimate (roughly 3,300 words of body text once the slot notes are removed, plus four images).

**Equations:** written in plain Unicode (κ, ∇, θ, √) so they survive Medium's editor. No LaTeX is needed.

**Code blocks:** paste as Medium code blocks (type three backticks on an empty line in the editor). Three blocks total.

**Publishing path:** draft in Medium's editor by pasting section by section from this file, or use Medium's "Import a story" on the rendered GitHub view of this file and then fix headings and code blocks. Add the four images at their slots, delete the slot notes, and remove this appendix before publishing.

**Internal links to add once they exist:** the series hub page, and any later explainer in the metamaterials vertical.

**No em dashes anywhere in this file; the editor style here uses colons, commas, and parentheses.**
