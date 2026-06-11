# LSP D-Planner — Social Media Post

---

**Title:**
LSP D-Planner — free open-source deco planner (Bühlmann ZHL-16C + VPM-B + VPM-B/GFS) dive tools, 446-test regression suite

**Body:**

LSP D-Planner is a free dive planning app by [Three Cats LSP](https://www.instagram.com/threecats_lsp). It runs in any browser and as a native Android APK — completely offline, no account, no ads, no subscription.

**Two modes:**

**Recreational divers:**
- NDL tables with pressure group tracking (PADI RDP-based)
- Multi-dive day planning with residual nitrogen tracking across dives and surface intervals
- Surface Interval calculator — shows tissue loading per compartment in real time
- Average Depth converter — enter your logbook average depth, get a recommended planning depth
- CNS O₂ tracker
- MOD calculator for nitrox

**Decompression divers:**

Algorithms:
- Bühlmann ZHL-16C + Gradient Factors — configurable GF Low/High (presets or custom), water vapour correction, 16 tissue compartments
- VPM-B — Varying Permeability Model with configurable conservatism margin (+0 to +5)
- VPM-B/GFS hybrid — VPM-B bubble mechanics set deep stop depth; GF High applied at shallow and surface stops

Gas management:
- Gas Consumption card in the Deco Schedule — GAS · TOTAL VOL · THIRDS · TURN PRESS · RESERVE · SUFFICIENT
- Rule of Thirds and Half Tank toggle — live update, no recalculation needed
- Travel gas pools with bottom gas automatically if same mix; label shows Air (+Travel) to confirm
- Warning rows for BT limit and tight margin
- SAC-based consumption in litres or cubic feet with correct unit conversion

Trimix / helium:
- Full O₂/He/N₂ entry for bottom gas and all deco gases
- He half-time selector: Bühlmann 2003 (1.51 min) or Baker (1.88 min)
- END column in the deco schedule; trimix-aware (He non-narcotic)
- He-aware ppO₂ checks and MOD calculations throughout both engines

Narcosis tools:
- END Calculator — depth + O₂% + He% → END, narcotic partial pressure, risk level, MOD @ 1.4/1.6 bar; N₂ only vs N₂+O₂ narcotic toggle
- EAD Table — Equivalent Air Depth for common nitrox and trimix mixes
- Gas Table — MOD @ 1.4 / MOD @ 1.6 / MND for all common mixes; live ppO₂ selector

Repetitive diving:
- Multi-dive with surface interval tissue loading (Haldane N₂/He off-gassing)
- Surface Interval calculator — all 16 compartments, controlling compartment, reverse-profile warning, tissue bar chart
- VPM-B bubble state carry between dives: r(t) = r_init + (r_end − r_init) × exp(−t / REGEN_TIME), 14-day regeneration constant

Altitude:
- Presets sea level to 3000 m + custom; acclimatization toggle
- VPM-B altitude-adjusted critical radii: r_alt = r₀ × (P_SL / P_alt)^(1/3)

Export:
- Copy / TXT / PDF — full deco schedule + gas consumption
- Deco Slate — compact waterproof slate format (depth, run time, gas, ppO₂, header, footer)
- Named dive profile presets — save and recall full dive setups (algorithm, GF, all gases, cylinders, altitude, SAC)

Quality:
- Static audit (audit.py) — structural checks across 20+ code groups, run before every commit
- HTML regression suite (tests-massive.html) — 446 tests covering engine correctness, UI/DOM, algorithm switching, VPM-B/GFS GF UI, SAC unit conversion, gas plan, slate output, preset persistence, altitude, trimix
- Knowledge Base of 18 reference PDFs (Baker FORTRAN source, EUBS proceedings, published Bühlmann/VPM comparisons)

**Links:**
- Web version: https://three-cats-lsp.github.io/LSP_D-planner/
- Android APK: https://github.com/Three-Cats-LSP/LSP_D-planner/raw/main/Android%20Apk/LSP_D-planner.apk
- GitHub: https://github.com/Three-Cats-LSP/LSP_D-planner

Free, open source, runs entirely offline. Happy to go deep on algorithm implementation or methodology.
