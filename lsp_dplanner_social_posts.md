# LSP D-Planner — Social Media Posts

---

## Reddit — r/scuba

**Title:**
I built a free dive planner that runs in your browser and on Android — no account, no subscription, NDL tables + real deco planning + gas management tools

**Body:**

Hey r/scuba — sharing something we've been building and maintaining for a while. Wanted to get it in front of more divers.

**LSP D-Planner** is a free dive planning app by [Three Cats LSP](https://github.com/Three-Cats-LSP/LSP_D-planner). It runs in any browser and as a native Android APK — completely offline, no account, no ads, no subscription.

**Two modes:**

- **Rec** — PADI-based NDL tables with pressure group tracking, surface interval calculator, multi-dive planning, CNS O₂ tracking, average depth calculator, and NDL reference tables
- **Tec** — Full decompression planning with Bühlmann ZHL-16C + Gradient Factors, VPM-B, and VPM-B/GFS hybrid. Trimix support, multiple deco gases, travel gas, altitude diving

**Gas management:**
- Gas Consumption card in the Deco Schedule: total volume, turn pressure, reserve, Rule of Thirds or Half Tank toggle
- Color-coded sufficiency per gas (OK / TIGHT / SHORT)
- Travel gas auto-pools with bottom gas if same mix

**Tools:**
- Best Mix, MOD calculator, END Calculator, EAD Table, Gas Table, Unit Converter, Knowledge Base (18 reference PDFs)

**Export:**
- Deco Slate (compact waterproof format), Copy, TXT, PDF — all include gas consumption

**Try it now:** https://three-cats-lsp.github.io/LSP_D-planner/
**Android APK:** https://github.com/Three-Cats-LSP/LSP_D-planner/raw/main/Android%20Apk/LSP_D-planner.apk
**Source:** https://github.com/Three-Cats-LSP/LSP_D-planner

Open source and completely free. Happy to answer questions about how any of it works.

---

## Reddit — r/diving

**Title:**
Free dive planner for Android and browser — offline, no sign-up, NDL tables + deco + gas planning + narcosis tools

**Body:**

Sharing something we've been building for a while.

**LSP D-Planner** is a free Android app and browser-based web app for dive planning. No account, no subscription, works fully offline once installed.

**Recreational divers:**
- NDL tables with pressure group tracking (PADI RDP-based)
- Multi-dive day planning with residual nitrogen tracking across dives and surface intervals
- Surface Interval calculator — shows tissue loading per compartment in real time
- Average Depth converter — enter your logbook average depth, get a recommended planning depth
- CNS O₂ tracker
- MOD calculator for nitrox

**Decompression divers:**
- Bühlmann ZHL-16C with configurable Gradient Factors (GF Low/High)
- VPM-B and VPM-B/GFS hybrid
- Full trimix support (O₂/He/N₂) for bottom gas and all deco gases
- Gas Consumption card — turn pressure, Rule of Thirds or Half Tank, sufficiency check per gas
- END and EAD calculators with narcosis toggle

**Tools section:**
Best Mix, MOD, END Calc, EAD Table, Gas Table, Unit Converter, Knowledge Base

**Export:**
Deco Slate (waterproof slate format), Copy, TXT, PDF

The web version runs in any browser — no install needed:
👉 https://three-cats-lsp.github.io/LSP_D-planner/

Android APK: https://github.com/Three-Cats-LSP/LSP_D-planner/raw/main/Android%20Apk/LSP_D-planner.apk

Open source: https://github.com/Three-Cats-LSP/LSP_D-planner

Built because we wanted a planning tool we actually trusted. Would love feedback from anyone who tries it.

---

## Reddit — r/techscuba

**Title:**
LSP D-Planner — free open-source deco planner, Bühlmann ZHL-16C + VPM-B + VPM-B/GFS, full trimix, integrated gas management, END/EAD/MOD tools, 446-test regression suite

**Body:**

Sharing a project we're proud of: **LSP D-Planner**, a free open-source technical dive planner — native Android APK and browser-based web app, runs completely offline.

**Algorithms:**

- **Bühlmann ZHL-16C + Gradient Factors** — configurable GF Low/High (presets or custom), water vapour correction, 16 tissue compartments
- **VPM-B** — Varying Permeability Model with configurable conservatism margin (+0 to +5)
- **VPM-B/GFS hybrid** — VPM-B bubble mechanics set deep stop depth; GF High applied at shallow and surface stops

**Trimix / helium:**

- Full O₂/He/N₂ entry for bottom gas and all deco gases
- He half-time selector: **Bühlmann 2003 (1.51 min)** or **Baker (1.88 min)**
- END column in the deco schedule; trimix-aware (He non-narcotic)
- He-aware ppO₂ checks and MOD calculations throughout both engines

**Gas management:**

- Gas Consumption card in the Deco Schedule — GAS · TOTAL VOL · THIRDS · TURN PRESS · RESERVE · SUFFICIENT
- Rule of Thirds and Half Tank toggle — live update, no recalculation needed
- Travel gas pools with bottom gas automatically if same mix; label shows `Air (+Travel)` to confirm
- Warning rows for BT limit and tight margin
- SAC-based consumption in litres or cubic feet with correct unit conversion

**Narcosis tools:**

- **END Calculator** — depth + O₂% + He% → END, narcotic partial pressure, risk level, MOD @ 1.4/1.6 bar; N₂ only vs N₂+O₂ narcotic toggle
- **EAD Table** — Equivalent Air Depth for common nitrox and trimix mixes
- **Gas Table** — MOD @ 1.4 / MOD @ 1.6 / MND for all common mixes; live ppO₂ selector

**Repetitive diving:**

- Multi-dive with surface interval tissue loading (Haldane N₂/He off-gassing)
- Surface Interval calculator — all 16 compartments, controlling compartment, reverse-profile warning, tissue bar chart
- VPM-B bubble state carry between dives: `r(t) = r_init + (r_end − r_init) × exp(−t / REGEN_TIME)`, 14-day regeneration constant

**Altitude:**

- Presets sea level to 3000 m + custom; acclimatization toggle
- VPM-B altitude-adjusted critical radii: `r_alt = r₀ × (P_SL / P_alt)^(1/3)`

**Export:**

- Copy / TXT / PDF — full deco schedule + gas consumption
- Deco Slate — compact waterproof slate format (depth, run time, gas, ppO₂, header, footer)
- Named dive profile presets — save and recall full dive setups (algorithm, GF, all gases, cylinders, altitude, SAC)

**Quality:**

- Static audit (`audit.py`) — structural checks across 20+ code groups, run before every commit
- HTML regression suite (`tests-massive.html`) — 446 tests covering engine correctness, UI/DOM, algorithm switching, VPM-B/GFS GF UI, SAC unit conversion, gas plan, slate output, preset persistence, altitude, trimix
- Knowledge Base of 18 reference PDFs (Baker FORTRAN source, EUBS proceedings, published Bühlmann/VPM comparisons)

**Links:**

- Web version: https://three-cats-lsp.github.io/LSP_D-planner/
- Android APK: https://github.com/Three-Cats-LSP/LSP_D-planner/raw/main/Android%20Apk/LSP_D-planner.apk
- GitHub: https://github.com/Three-Cats-LSP/LSP_D-planner

Free, open source, runs entirely offline. Happy to go deep on algorithm implementation or methodology.

---

## Instagram Caption

A proper dive planner. No subscription. No account. Just your dive.

LSP D-Planner — free Android app and web app for real dive planning, built by @threecats_lsp for divers who care about their deco.

─────────────────────

🧮 ALGORITHMS
Bühlmann ZHL-16C + Gradient Factors
VPM-B and VPM-B/GFS hybrid
Full trimix (O₂/He/N₂)
Altitude diving with corrected critical radii

⛽ GAS MANAGEMENT
Gas Consumption card — right in the Deco Schedule
Rule of Thirds / Half Tank toggle
Turn pressure · total volume · reserve · sufficiency
Travel gas auto-pools with bottom gas if same mix

🔬 NARCOSIS & GAS TOOLS
END Calculator — narcotic depth, risk level, toggle N₂ only vs N₂+O₂
EAD Table — equivalent air depth for common mixes
MOD calculator — reference table Air + EAN mixes at 1.4 and 1.6 bar
Gas Table — MOD + MND for all common nitrox and trimix mixes

📊 PLANNING TABS
Rec: Deco Schedule · Dive Planner · Surf Int · Avg Depth · Multi Dive · CNS O₂ · NDL Tables
Tec: Deco Schedule + Best Mix, multi-gas, altitude, repetitive dives

📋 EXPORT
Deco Slate — compact waterproof format
Copy / TXT / PDF — full schedule + gas consumption table
Named presets — save and reload full dive configs

📱 THE APP
Native Android APK — fully offline
Browser version — no install needed
No account · no subscription · open source · always free

─────────────────────

Try it in your browser 👇
🔗 three-cats-lsp.github.io/LSP_D-planner

Android APK on GitHub (link in bio)

Built by divers, for divers. 🤿

─────────────────────

#scuba #diveplanning #technicaldiving #decompression #trimix #deco #scubadiving #techscuba #diver #nitrox #openwater #diverlife #decoplanning #buehlmann #vpmb #narcosis #gasmixture #divecomputer #endcalculator #nitroxplanning

---

## Facebook Post

We built LSP D-Planner because we wanted a dive planning tool we actually trusted — free, offline, no account required. Here's what it does.

**LSP D-Planner** is a free Android app and browser-based web app for recreational and technical dive planning. Everything runs client-side — no server, no subscription, no ads.

**Algorithms**
Bühlmann ZHL-16C + configurable Gradient Factors (GF Low/High), VPM-B with conservatism margin, and a VPM-B/GFS hybrid that uses VPM-B bubble mechanics for deep stops and GF High at the surface. Full trimix support (O₂/He/N₂) throughout both engines.

**Rec mode**
PADI-based NDL tables with pressure group tracking, multi-dive surface interval tracking, average depth calculator, CNS O₂ tracker, and NDL reference tables. Sub-tabs: Deco Schedule · Dive Planner · Surf Int · Avg Depth · Multi Dive · CNS O₂ · NDL Tables.

**Tec mode — decompression**
Full deco schedule with colour-coded table, END column, transit mode (Schreiner or MultiDeco-compatible), configurable rates and stop rounding, altitude diving, and named profile presets.

**Gas management**
A Gas Consumption card lives directly in the Deco Schedule. It shows total volume, turn pressure, reserve, and sufficiency (OK / TIGHT / SHORT) for every gas. Rule of Thirds and Half Tank toggle updates live. Travel gas auto-pools with bottom gas if same mix.

**Tools**
Best Mix, MOD calculator, END Calculator (narcotic depth + risk level + narcosis toggle), EAD Table, Gas Table (MOD + MND for common mixes), Unit Converter, Knowledge Base with 18 reference PDFs.

**Export**
Deco Slate (compact waterproof format), Copy, TXT, and PDF — all include the full gas consumption table. Named presets save the full dive setup and recall with one tap.

Try it in your browser: https://three-cats-lsp.github.io/LSP_D-planner/
Android APK: https://github.com/Three-Cats-LSP/LSP_D-planner/raw/main/Android%20Apk/LSP_D-planner.apk
Source code: https://github.com/Three-Cats-LSP/LSP_D-planner

Free, open source, offline. Always will be.

— Three Cats LSP (@threecats_lsp)
