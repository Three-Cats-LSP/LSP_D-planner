# Changelog

All notable changes to LSP D-Planner are documented here.

---

## v2.10.9 — 2026-06-17  ★ Critical fix

### Fixed
- **GF anchor regression: first stop landing 1-3 steps shallower than correct, deco time silently under-counted** — Found via a full 3-way comparison run against divekit.app's published MultiDeco/DiveKit reference dataset (26 scenarios). The v2.10.7 `gfAt()` fix returned `gfH` (GF High) when `firstStopDepth` was unanchored, intending it as "the liberal, no-stop-yet" test. But per Baker's published gradient-factor algorithm — and DAN's own description of it — **GF Low is what determines the first stop**, not GF High; GF High only bounds the final approach to the surface. Returning `gfH` pre-anchor meant the ascent-and-test loop only required a stop once the *loose* GF-High M-value was itself violated, which happens much deeper into supersaturation than the GF-Low M-value. The result: the GF line anchored 1-3 deco steps shallower than correct, and the intermediate stops above that depth were skipped entirely — along with their deco time.
  - Confirmed via an independent `ceiling()` sweep against a 30m/23min air GF30/70 profile (S1 in the comparison set): `ceiling(tissues, gfLow=0.30) = 11.76m` (correctly rounds to the 12m first stop matching MultiDeco and DiveKit exactly), while `ceiling(tissues, gfHigh=0.70) = 5.44m` was what the regressed `gfAt()` was actually testing against — explaining the spurious anchor at 6m and the missing 12m/9m stops.
  - Fixed: `gfAt()` now returns `gfL` (not `gfH`) when unanchored. The dynamic-anchor mechanism from v2.10.7 (anchoring at the actual depth where `mustStop` first fires, rather than a pre-computed bottom-tissue snapshot) is otherwise unchanged and remains correct — only the pre-anchor test GF was wrong.
  - Re-verified against the full 21-scenario runnable subset of the comparison set: every air/nitrox profile (S1-S4, FS1, FS3, FS4, R1) now matches MultiDeco's and DiveKit's first-stop depth exactly. Trimix profiles (S5, S6, A2, A3, FS5) land shallower than MultiDeco by 1-4 steps, matching DiveKit's own documented "stop distribution" explanation (continuous tissue recompute during ascent lets helium off-gas faster than the diver climbs on deep-helium dives) rather than indicating a remaining bug.
  - Also re-verified this fix does not reintroduce the original v2.10.7 bug (pre-computed-snapshot rounding overshoot): the dynamic anchor still fires at the live, correctly-resolved depth during the ascent loop, not from a single bottom-tissue snapshot.

### Changed
- **Audit** — Added GROUP 30 (1 check): `gfAt()` returns `gfL` (not `gfH`) pre-anchor. Total: 181 checks, 0 failures.
- **`APP_VERSION`** — bumped to `2.10.9`.

---

## v2.10.8 — 2026-06-17

### Fixed
- **Headless CNS/OTU silently omitted descent and bottom-time exposure** — Found via a 3-way LSP/MultiDeco/DiveKit comparison run (divekit.app cross-reference dataset, 26 scenarios). `window._lastPlan.steps` only ever contains ascent/deco segments; descent and bottom time are rendered straight to DOM in the live app and never pushed into `steps`. `ZHLEngine.calculate()`'s headless CNS/OTU fallback summed only `lp.steps`, so every headless-computed CNS%/OTU value silently excluded descent and the full bottom-time exposure — typically the majority of a dive's total O₂ load. A 40m/25min air dive that should read ~10% CNS / ~29 OTU was reporting 0.8% / 2.
  - This was a **test-infrastructure bug only**: the live app's DOM-rendering path (`runDecoSchedule`'s non-headless branch) already accumulates CNS/OTU correctly across the full table, including descent and bottom rows. Divers using the app were never shown wrong numbers.
  - It went undetected because the existing automated suites (`tests-massive.html` etc.) only assert finiteness and relative ordering ("longer dive ≥ CNS", "deeper dive ≥ CNS") — never magnitude against a known-correct reference value, so the systematic ~80-95% under-count never tripped a test.
  - Fixed: added explicit descent (average depth = `level.depth / 2`, duration = `level.depth / descentRate`) and bottom-time (full `level.time` at full depth) exposure terms before summing the ascent/deco steps, refactored into a shared `addExposure()` helper.
  - Verified post-fix against the relative-ordering tests (still pass) and against the 3-way comparison dataset: LSP's recomputed CNS/OTU now land in the same range as MultiDeco's and DiveKit's reported values for equivalent profiles.

### Changed
- **Audit** — Added GROUP 29 (3 checks): `addExposure()` helper present, descent exposure included, bottom-time exposure included. Total: 180 checks, 0 failures.
- **`APP_VERSION`** — bumped to `2.10.8`.

---

## v2.10.7 — 2026-06-17

### Fixed
- **GF first-stop anchor used a pre-computed ceiling instead of the actual first stop** — `firstStopDepth` was computed once from `ceiling(bottom_tissues, gfLow)` *before* ascent began, rounded up to the nearest stop-step. For Air+EAN50-style profiles this pre-computed value could land one step shallower than the depth where a stop is actually required (e.g. rounding to 21m when the real ceiling search finds no stop needed until 18m or shallower), producing a spurious mandatory stop that neither MultiDeco nor a from-scratch Baker/Bühlmann implementation would generate.
  - Fixed: `firstStopDepth` is now a mutable `let`, initialised to `0`. `gfAt()` returns `gfH` (the liberal, pre-anchor ceiling) until the GF line is actually anchored. The anchor is set dynamically, the moment `mustStop` first fires during the real ascent-and-test loop, at the actual depth where a stop is required — matching Baker's published algorithm and MultiDeco's behaviour.
  - `candidateFirstStop` (still `gfLow`-derived) is retained only to build the candidate stop-depth list for the ascent loop to iterate; since `gfLow ≤ gfHigh` always holds, this candidate is always at or deeper than the true first stop, so the loop can never miss it.
  - `minStopZoneDepth` follows the same dynamic-anchor pattern — minimum-stop-time enforcement does not begin until the real first stop is known.
  - `decoZoneStart` footer/export now reports the actual first-stop depth rather than the pre-computed estimate.
- Verified via a live jsdom run against the engine across NDL dives, a flat GF50/50 line, GF30/100 (no surfacing conservatism), and a TMX18/45 trimix profile — all produced clean, spurious-stop-free schedules with correct monotonic runtimes.

### Changed
- **Audit** — Added GROUP 28 (5 checks): `firstStopDepth` mutability, `candidateFirstStop` usage, dynamic anchor assignment, `minStopZoneDepth` mutability and dynamic assignment. Total: 177 checks, 0 failures.

---

## v2.10.6 — 2026-06-16  ★ Milestone

Multideco/DiveKit alignment milestone — unified water pressure factors (ZHL + VPM), O₂-band ppO₂ caps, Baker He HT default, repetitive VPM CNS/OTU carry, `BAR_PER_METRE` consistency, VPM render fixes (altitude ppO₂, imperial switch depth). Audit: 172 checks; regression: 68/68 verify + 50/50 tests.

### Fixed
- **VPM ppO₂ display uses hardcoded sea-level pressure** — All pressure calculations in `renderVPMResults` used `1.013` (sea level) instead of `altSurfaceP`. Altitude dives showed incorrect ppO₂ values in the VPM deco table (gas switch rows, descent, bottom, ascent, and stop rows). Fixed: `surfP = altSurfaceP || 1.01325` declared at function top, used throughout.
- **VPM gas tag switch depth wrong in imperial** — The formula `/ (BAR_PER_METRE * 0.3048) / 3.28084` algebraically cancels to `/ BAR_PER_METRE` (result in metres), but was then rounded to a 10 ft grid — showing e.g. `20 ft` for EAN50 instead of the correct `70 ft`. Fixed to `/ BAR_PER_METRE * 3.28084` (metres → feet) with pure O₂ fixed at 20 ft.

### Changed
- **Audit** — Added check 27.4: VPM gas tag imperial switch depth formula correctness. Total: 172 checks, 0 failures.
- **`APP_VERSION`** — bumped to `2.10.6`.

---

## v2.10.5 — 2026-06-16

### Fixed
- **BAR_PER_METRE init** — After v2.10.4 changed salt to `0.10000 bar/m`, the global init was still `1/10.078 = 0.09923`. Any code that runs before `setWaterDensity()` (startup race, unit tests) used a stale value. Fixed: `BAR_PER_METRE` now initialises directly to `0.10000`.
- **Hardcoded `/ 10.078` in display and calculation code** — 12 instances of the old salt constant remained in VPM result rendering (ppO₂ column, gas switch ppO₂, PrT footer), copy/export PrT, emergency plan PrT, and GF tissue display. All replaced with `BAR_PER_METRE` so fresh/EN13319 dives show correct ppO₂ and PrT values.
- **VPM render imperial branch** — `pAmb` for VPM stops had a dead `seg.depth * 0.0305` imperial branch (VPM depths are always in metres internally). Removed; `BAR_PER_METRE` is now used unconditionally.

### Changed
- **Audit** — Added GROUP 27 (3 new checks): `BAR_PER_METRE` init value, no hardcoded `/ 10.078` in live code, VPM render uses `BAR_PER_METRE`. Total: 171 checks, 0 failures.
- **`APP_VERSION`** — bumped to `2.10.5`.

---

## v2.10.4 — 2026-06-16

### Fixed
- **ZHL ↔ VPM salt factor mismatch** — ZHL used `WATER_DENSITY.salt = 0.10020` (9.980 m/bar) while VPM used `SLP_SW_M = 10.078`. Both now use **10.000 m/bar** (`0.10000 bar/m`), matching MultiDeco/DiveKit/ApexDeco.
- **VPM EN13319 water type ignored** — `en13319` was silently mapped to salt (`waterType=0`). Now maps to `waterType=2`; `getSLP()` returns `SLP_EN_M = 10.080` / `SLP_EN_F = 33.071`.

### Changed
- **WATER_DENSITY** — salt `0.10000`, EN13319 `0.09921` (10.080 m/bar); VPM fresh factors aligned (`SLP_FW_M = 10.330`).
- **Audit** — Added GROUP 26 (8 checks): SLP constants, EN13319 `waterType===2`, `getSLP()` usage. Total: 168 checks, 0 failures.
- **`APP_VERSION`** — bumped to `2.10.4`.

---

## v2.10.3 — 2026-06-16

### Fixed
- **He HT default → Baker 1.88 (root fix)** — v2.10.2 corrected the HTML attribute order but left `buhl2003` as the selected value. The actual default was still Bühlmann 2003 (1.51 min) at runtime. Now the `<select>` has `selected=""` on the Baker option, `ZHL16C_HE_HT` is initialised from `ZHL16C_HE_HT_BAKER`, the factory preset is `'baker'`, and all four `|| 'buhl2003'` fallbacks in `updateHeHalfTime`, export, and PDF code are changed to `|| 'baker'`. The engine now starts with Baker 1.88 min by default, matching VPM-B canonical (Baker FORTRAN 1998), ApexDeco, and MultiDeco.
- **Repetitive dive CNS/OTU carry** — When VPM repetitive mode is active, CNS and OTU were always re-initialized to 0 for the second dive, ignoring the oxygen exposure from the first. Fixed: `_lastVPMResult` now stores `finalCNS` and `finalOTU`; on the next dive, `settings._preCNS` is injected with the first-dive CNS decayed on a 90-minute half-life (Baker/NOAA standard), and `settings._preOTU` carries OTU as a daily accumulator (no decay within the same day). `calculate()` initialises `totalCNS` and `totalOTU` from these pre-dive values instead of zero.

### Changed
- **Audit** — Added GROUP 25 (6 new checks): `_lastVPMResult` stores `finalCNS`/`finalOTU`, `_preCNS` decay formula present, `_preOTU` injection present, `calculate()` initialises from `_preCNS`/`_preOTU`. Total: 160 checks, 0 failures.
- **`APP_VERSION`** — bumped to `2.10.3`.

---

## v2.10.2 — 2026-06-16

### Fixed
- **ppO2 mid-band limit** — `ppo2Mid` in `runDecoSchedule` was incorrectly set to `ppo2Bottom` (1.4 bar). Gases with 28–44% O₂ (e.g. EAN32, EAN36) now correctly use 1.5 bar, producing the right MOD and switch depth. Previously EAN32 switch depth was 3 m too shallow.
- **O₂-band boundary conditions** — inner engine `getPPO2Limit` used `<=28` and `<=45` thresholds. Fixed to `<28` and `<45`: exactly 28% O₂ is now correctly treated as mid-band (1.5 bar), and exactly 45% O₂ as rich (1.6 bar). Aligns with ApexDeco / DiveKit spec.
- **He HT HTML attribute order** — `selected` attribute on the `heHalfTimeMode` select was `selected="" value="buhl2003"` (wrong order), causing the audit to fail detection. Corrected to `value="buhl2003" selected=""`.
- **`updateHeHalfTime` logic** — condition was inverted: `mode === 'buhl2003'` selected the Bühlmann array and anything else selected Baker. Corrected to `mode === 'baker'` selects Baker, fallback is Bühlmann 2003.
- **Fallback mode strings** — export and PDF code used `|| 'buhlmann2003'` (non-existent key) as fallback; normalized to `|| 'buhl2003'`.

### Changed
- **Audit** — added GROUP 24 (3 new checks): `ppo2Mid = 1.5` correctness, `<28` O₂ boundary, `<45` O₂ boundary. Total: 154 checks, 0 failures.
- **`APP_VERSION`** — bumped to `2.10.2`.

---

## v2.10.1 — 2026-06-15

### Changed
- **`APP_VERSION`** — bumped to `2.10.1`; `build.gradle` `versionCode` updated to `21001`

---

## v2.10.0 — 2026-06-13  ★ Milestone

### Added
- **@capacitor/status-bar plugin** — native Android status bar control; transparent/edge-to-edge layout with `WindowCompat.setDecorFitsSystemWindows`
- **Status bar icon color sync** — dark icons in light theme, white icons in dark theme; theme preference written to `document.cookie` on every toggle and startup so native Java reads the correct value on cold launch via `CookieManager`
- **Collapsible ENV settings group** — environment settings (altitude, water type, acclimatization) collapse/expand; state persisted in `localStorage`
- **Collapsible Advanced Settings group** — advanced algorithm settings collapse/expand; state persisted in `localStorage`
- **Dive profile presets** — quick-select common dive profiles (depth + bottom time combinations); applied to both Rec and Tec modes
- **Advanced config presets** — quick-select common algorithm/GF configurations; one-tap apply
- **Water type tooltip** — inline `?` explanation of density values and effect on deco obligation per water type
- **Per-algorithm tooltips** — inline `?` on algorithm selector explains ZHL-16C+GF, VPM-B, and VPM-B/GFS; includes conservatism note
- **Planning Aid Only banner** — prominent banner displayed when a non-default conservatism or GF is in use

### Changed
- **`APP_VERSION`** — bumped to `2.10.0`; `build.gradle` `versionCode` updated to `21000`
- **`windowLightStatusBar`** — set to `true` in `styles.xml` (dark icons as safe XML default); Java flips to white icons at startup if dark theme cookie is present
- **`windowTranslucentStatus`** — removed from `styles.xml`; edge-to-edge now handled exclusively by `WindowCompat.setDecorFitsSystemWindows(false)` in `MainActivity`
- **CI workflow** — added `git reset --hard HEAD` before `git pull --rebase` to clear unstaged `cap sync` changes that were causing the APK commit step to fail

### Fixed
- **Status bar bg color** — `#f0f4ff` → `#ffffff` in `StatusBar.setBackgroundColor` for light theme (was creamy off-white)
- **`.algo-label` in light theme** — `#00d9ff` (invisible cyan on white) → `#0055aa` (dark blue, matches `--padi-accent` token)
- **`onResume` access modifier** — changed from `protected` to `public` to correctly override `BridgeActivity.onResume()`; was causing compile error
- **Removed broken `applyStatusBarStyle()`** — was reading `diveTheme` from `CapacitorStorage` SharedPreferences which is never populated by `localStorage.setItem()`; JS `loadThemePreference()` now owns all status bar styling

---

## v2.9.1 — 2026-06-12

### Fixed
- ZHL CNS renderer: `bottomFO2` used instead of `(1-bottomFN2)` for trimix ppO₂ on descent/bottom rows
- Custom bottom gas cap raised 40% → 100%; MOD display now updates live on O₂% input
- `segCNSfrac`, `rowCNS`, ZHLEngine headless `hCNSfrac`: ppO₂ > 1.6 now clamps to 45-min NOAA limit instead of returning 100% per segment
- Gas switch flags on dive graph: colour changed to yellow/green (#FFD700 / #007A33) to match deco table switch row style; same fix applied to PDF deco table (3 locations)
- Dive graph card tooltip added — explains all visual elements (profile line, Bühlmann ceiling, gas switch flags, stop dots, ppO₂ halos, interaction)
- Multi TXT export (`mode=multi`) rewired from orphaned `#multiCards`/`#multiWarnings` to live `#unifiedDivePlan` renderer
- Static inline-SVG favicon replaces dynamically injected one (was broken after `initPWA` removal)

### Changed
- Dead code cleanup: 14 unused functions removed (`ftToM`, `setNDLUnits`, `setMultiUnits`, `updateGF`, `floorPPO2`, `depthFromPressure`, `getEl`, `switchMultiMode`, `runMulti`, `buildBuhRef`, `initPWA`, `calcMaxDepth`, `exportContingencyTXT`, `buildPdfGasCards`); archived to `dev/legacy.js`
- 12 dead CSS classes and 22 utility CSS rules removed
- Whitespace and separator comment cleanup (-5.7 KB)

### Added
- Proper PWA: `manifest.json` + `sw.js` (cache-first, offline-capable); Android Chrome install banner; iOS Safari Add-to-Home-Screen instructions
- `CHANGELOG.md` — full version history from v2.7
- `dev/legacy.js` — archive of removed functions for reference

---

## v2.9.0 — 2026-06-09

### Added
- **PDF Export section picker** — dialog before export lets you choose which sections to include (Dive Plan PDF and Emergency Plan PDF)
- **Emergency Plan PDF** — full PDF export for contingency plans: emergency gas consumption, ascent schedule, dive profile, GF curve, tissue saturation, emergency slate
- **DejaVu Sans Unicode font** — all PDFs now use a single DejaVu Sans (regular + bold) font; correct rendering of ✓ ✗ ⚠ ↑ ↓ and all Unicode symbols
- **Copy preview modal** — copy button opens a preview modal showing the full formatted plan text before copying to clipboard (Deco Plan and Emergency Plan)
- **Timestamps on all exports** — `YYYY/DD/MM HH:MM` date/time stamp added to all copy, slate, and TXT exports
- **CNS/OTU/PrT footer line** — second footer line added to all deco and emergency slates and copy exports
- **Math Verification Suite** (`tests-verify.html`) — ZHL-16C Bühlmann + VPM-B cross-check against Baker/FORTRAN reference; 68 tests across sections A–H
- **Tissue saturation chart** — per-compartment saturation bars in a dedicated collapsible card
- **Contingency shortcut buttons** — quick links to contingency scenarios from the results area

### Changed
- Collapsible result cards — Gas Consumption, Contingency Plans, Dive Graph, Tissue Saturation, GF Curve
- Card order reordered: Dive Profile → Gas Consumption → Contingency Plans → Dive Graph → Tissue Saturation → GF Curve
- Slate footer: TBT → TRT (Total Run Time); `TRT: MM'SS" | DECO: MM'SS"`
- Copy footer split into two lines
- Export headers: `DECO PLAN` / `EMERGENCY PLAN` title lines added
- END column in PDF deco table — all 9 columns exported

### Fixed
- ZHL CNS renderer trimix ppO₂ fix
- Custom bottom gas cap raised 40% → 100%
- Test harness: `gfs:hi` double-division fix, `WATER_VAPOR` NaN-safe re-sync

---

## v2.8.9 — 2026-06-09

### Added
- **Gas Consumption card** — rule-of-thirds table integrated into deco schedule results
- **Gas Rule toggle** — Rule of Thirds / Half Tank; updates live
- **Travel gas pooling** — pools with bottom gas when same mix
- **Warning row colours** — SHORT / TIGHT rows highlighted
- **Best Mix tab (Tec)** — trimix optimizer
- **END Calculator** — Tools tab: depth + O₂/He% → END and narcotic ppO₂
- **EAD Table** — MOD and MND reference for common mixes
- **Gas Table** — MOD @ 1.4 / MOD @ 1.6 / MND columns
- **PayPal donate button** — footer and Ref modal

### Changed
- Tec mode default on startup
- Main tab order: Deco > Gas Plan > Surf Int > Dive Planner > Multi Dive > CNS > NDL

### Fixed
- `calcSurfInt` tolTension: uses surface pAmb (not Dive 2 depth)
- Preset button placement
- Gas Plan cross-checks and max BT suggestion

---

## v2.8.0 — 2026-06-09

### Added
- **Gas Table** — MOD reference table for common mixes in Tools tab
- **Surface Interval Calculator** — full tissue-model SI calculation
- **Deco Slate** — compact waterproof-slate format export
- **Named Presets** — save and recall up to 20 full dive setups
- **END column toggle** — Equivalent Narcotic Depth in deco table

---

## v2.7.6 — 2026-06-09

### Added
- **Min Deco Profile** — enforce minimum stop times at 9 m and 6 m

---

## v2.7.4 — 2026-06-09

- Android APK: external links open in system browser
- `APP_VERSION` propagated to Android `versionName`/`versionCode` at build time
- Custom Android UA string: `LSPDPlanner/Android`

---

## v2.7 — 2026-06-08

Milestone release. See git log for earlier history.

---
