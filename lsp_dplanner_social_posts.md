# LSP D-Planner — Social Media Posts (v2.8.7)

---

## Reddit — r/scuba

**Title:**
I built a free Android dive planner that works offline — no subscriptions, no account, just real deco planning (Bühlmann + VPM-B)

**Body:**

Hey r/scuba — sharing something we've been building for a while, just pushed a big update and wanted to get it in front of more divers.

**LSP D-Planner** is a free dive planning app made by [Three Cats LSP](https://github.com/Three-Cats-LSP/LSP_D-planner). It runs as a native Android APK and also works in any browser — completely offline, no account required, no subscription, no ads.

**What it does:**

- Recreational NDL tables and full decompression planning with **Bühlmann ZHL-16C + Gradient Factors** (configurable GF Low/High)
- **VPM-B** and **VPM-B/GFS** (hybrid) algorithm support
- Multi-dive day planning — surface interval off-gassing is tracked and available NDL updates for each subsequent dive
- **Surface Interval calculator** — shows tissue saturation state after any surface interval, directly in the planner
- CNS O₂ and OTU tracking throughout the profile
- **Gas consumption planning** — SAC rate, cylinder sizing
- Travel gas support (automatic MOD-based switch depths)
- **Gas Table** — MOD and MND (narcotic depth) for all 9 configured mixes at a glance
- **Deco Slate export** — compact waterproof dive slate format, exportable alongside PDF and TXT
- **Named Presets** — save and reload your dive configurations (up to 20 presets, stored locally)
- Full metric/imperial switching
- Altitude diving support

It's not trying to replace your dive computer — there's a clear disclaimer about that. But as a pre-dive planning tool it's genuinely capable.

**Try it in your browser:** https://three-cats-lsp.github.io/LSP_D-planner/
**Android APK (direct download):** https://raw.githubusercontent.com/Three-Cats-LSP/LSP_D-planner/main/Android%20Apk/LSP_D-planner.apk
**Source code:** https://github.com/Three-Cats-LSP/LSP_D-planner

It's open source and completely free. Happy to answer questions about how any of it works.

---

## Reddit — r/diving

**Title:**
Made a free dive planner app for Android — offline, no sign-up, does deco and NDLs. Here's what's in it.

**Body:**

Hey everyone — sharing something we've been heads-down on for a while.

**LSP D-Planner** is a free Android app (also a browser-based web app) for dive planning. No account, no subscription, works completely offline once installed.

Here's the honest summary of what it covers:

**Recreational divers:**
- No-decompression limit (NDL) tables
- Multi-dive day planning with residual nitrogen tracked across dives and surface intervals
- **Surface Interval calculator** — see your tissue loading drop in real time across any interval
- CNS oxygen toxicity tracker
- MOD calculator for nitrox

**Decompression divers:**
- Bühlmann ZHL-16C with configurable Gradient Factors
- VPM-B and VPM-B/GFS hybrid
- Full trimix support (O₂/He/N₂)
- Travel gas, deco gas, gas consumption (SAC + cylinder sizing)
- **Gas Table** — instant MOD and narcotic depth (MND) for up to 9 mixes
- **Deco Slate** — export your plan as a compact waterproof slate (Copy / SLATE / TXT / PDF)
- **Named Presets** — save your favorite dive configs with a name, reload them instantly
- END (Equivalent Narcotic Depth) column always visible in the deco schedule
- Altitude diving with corrected surface pressure

The web version runs in any browser so you can try it right now without installing anything:
👉 https://three-cats-lsp.github.io/LSP_D-planner/

Android APK download: https://raw.githubusercontent.com/Three-Cats-LSP/LSP_D-planner/main/Android%20Apk/LSP_D-planner.apk

It's open source: https://github.com/Three-Cats-LSP/LSP_D-planner

We built this because we wanted a proper planning tool we actually trusted. Would love feedback from anyone who tries it.

---

## Reddit — r/techscuba

**Title:**
LSP D-Planner v2.8.7 — free open-source Android deco planner, Bühlmann ZHL-16C + VPM-B + full trimix, Gas Table, Deco Slate, Named Presets, 147-check audit suite

**Body:**

Sharing a project we're genuinely proud of: **LSP D-Planner**, a free open-source technical dive planner — native Android APK and browser-based web app.

**Algorithms implemented:**

- **Bühlmann ZHL-16C + Gradient Factors** — industry-standard tissue model with configurable GF Low/High (presets or custom entry), standard 0.0577 bar water vapour correction
- **VPM-B** — full Varying Permeability Model with configurable conservatism margin
- **VPM-B/GFS hybrid** — VPM-B bubble mechanics determine deep stop depth; GF High applies at shallow/surface stops (configurable via presets or custom entry). Switches correctly between full Low+High UI (Bühlmann) and Hi-only mode (VPM-B/GFS)

**Trimix / helium support:**

- Full O₂/He/N₂ entry for bottom gas and all deco gases
- Helium half-time selector: **Bühlmann 2003 (1.51 min)** or **Baker (1.88 min)**
- **END (Equivalent Narcotic Depth)** column always visible throughout the profile
- He-aware ppO₂ checks and MOD calculations wired through both Bühlmann and VPM-B engines

**Repetitive diving:**

- Multi-dive with surface interval tissue loading (Haldane N₂/He off-gassing)
- **Surface Interval calculator** — dedicated sub-tab showing tissue saturation state after any given interval
- VPM-B bubble state carry across dives — critical radii regenerate during surface interval using `r(t) = r_init + (r_end − r_init) × exp(−t / REGEN_TIME)` with a 14-day regeneration constant

**Altitude diving:**

- Altitude presets from sea level to 3000 m + custom input
- Acclimatization toggle for effective surface pressure correction
- VPM-B altitude-adjusted critical radii: `r_alt = r₀ × (P_SL / P_alt)^(1/3)`

**Gas management:**

- Bottom gas, travel gas, and multiple deco gases — each with real-time MOD display
- **Gas Table** — one-click view of MOD and MND (narcotic depth `((3.5/fN₂)−1)×10`) for all 9 configured mixes
- SAC-based gas consumption in litres or cu ft, converting correctly on unit switch
- Auto switch depths based on MOD or manually set

**New in v2.8.x:**

- **Deco Slate export** — compact waterproof dive slate format alongside Copy/TXT/PDF, including Emergency plan slate
- **Named Presets** — save up to 20 named configurations to localStorage, reload instantly
- **Gas Table** — MOD + MND for all configured mixes in one view
- **Surface Interval sub-tab** — dedicated tissue off-gassing calculator in the main nav
- Export button order standardized: **Copy → SLATE → TXT → PDF** across all plan types
- END column always shown (toggle removed — it's always relevant)

**Quality assurance:**

- **147-check static audit** (`audit.py`) across 20+ code groups — run before every commit
- HTML regression test suite (`tests-massive.html`) covering algorithm switching, VPM-B/GFS GF UI, SAC unit conversion, gas volume display, Gas Table formulas, Slate output, Preset persistence, END column correctness, and more
- Knowledge Base of 18 reference PDFs including Baker's original VPM FORTRAN source, EUBS proceedings, and published Bühlmann/VPM comparisons

**Links:**

- Web version (try now, no install): https://three-cats-lsp.github.io/LSP_D-planner/
- Android APK: https://raw.githubusercontent.com/Three-Cats-LSP/LSP_D-planner/main/Android%20Apk/LSP_D-planner.apk
- GitHub (open source): https://github.com/Three-Cats-LSP/LSP_D-planner

It's free, open source, and runs entirely offline once installed. Happy to go deep on the algorithm implementation or answer any questions about the methodology.

---

## Instagram Caption

A proper deco planner. No subscriptions. No account. Just your dive. 🌊

LSP D-Planner v2.8.7 is out — a free Android app (and web app) for real dive planning, built by @threecats_lsp for divers who actually care about their deco.

─────────────────────

🧮 ALGORITHMS
Bühlmann ZHL-16C + Gradient Factors
VPM-B and VPM-B/GFS hybrid
Full trimix support (O₂/He/N₂)

📊 PLANNING TOOLS
Multi-dive day planner — residual N₂ tracked
Surface Interval calculator — tissue off-gassing in real time
CNS + OTU oxygen toxicity tracking
Gas consumption (SAC, cylinder sizing)
Travel gas with auto switch depths
Gas Table — MOD + narcotic depth for all mixes
Altitude diving support

📋 EXPORT
Deco Slate — compact waterproof slate format
Copy / TXT / PDF — full deco schedule export
Emergency plan with its own Slate export

⭐ PRESETS
Save up to 20 named dive configs
Reload with one tap — stored locally, works offline

📱 THE APP
Native Android APK — works completely offline
No account, no subscription, always free
Open source on GitHub
END column always visible in deco table

─────────────────────

Try it in your browser right now 👇
🔗 three-cats-lsp.github.io/LSP_D-planner

Download the Android APK from our GitHub (link in bio)

Built by divers, for divers. 🤿

─────────────────────

#scuba #diveplanning #technicaldiving #decompression #trimix #deco #scubadiving #techscuba #underwaterworld #diver #nitrox #openwater #diverlife #scubagear #decoplanning #buehlmann #vpmb #gasmixture #divecomputer #freediving

---

## Facebook Post

We just released LSP D-Planner v2.8.7 — a free dive planning app for Android, and we wanted to share what's new with the community.

It started as a tool we built for ourselves because we wanted something we actually trusted for planning deco dives. It's grown into a capable planner, and v2.8.x brought a big batch of features.

Here's what it does:

For recreational divers, it gives you a solid NDL table, a multi-dive day planner that tracks residual nitrogen across surface intervals, a dedicated **Surface Interval calculator** showing tissue off-gassing state after any given interval, CNS oxygen toxicity tracking, and MOD calculations for nitrox mixes.

For technical divers, it goes deeper: Bühlmann ZHL-16C with configurable Gradient Factors, VPM-B, and a VPM-B/GFS hybrid. Full trimix support with O₂/He/N₂ entry, helium half-time selection (Bühlmann 2003 or Baker), **Equivalent Narcotic Depth (END)** always visible throughout the deco schedule, travel gas, gas consumption planning with SAC rates and cylinder sizing, altitude diving with VPM-B critical radii correction, and repetitive dive bubble state carry.

**New in v2.8.x:**

→ **Gas Table** — MOD and narcotic depth (MND) for all 9 configured gas mixes in one view
→ **Deco Slate** — export your plan as a compact waterproof dive slate format alongside the standard PDF and TXT options. The Emergency contingency plan also has its own slate export.
→ **Named Presets** — save up to 20 named dive configurations to local storage and reload them with one tap
→ **Surface Interval sub-tab** — dedicated calculator showing tissue saturation state after a surface interval, now a permanent tab in the main planner navigation
→ Export button order standardized across all plan types: Copy → SLATE → TXT → PDF
→ END column always shown in the deco table (no toggle needed — it's always useful)

Deco plans export as PDF, TXT, or the new compact Slate format so you can print them, keep them on your phone, or write them on a real slate.

The Android app is a native APK — it runs fully offline, requires no account, has no subscription, and costs nothing. The same app also runs in any browser if you want to try it before installing.

It's also completely open source, with a 147-check static audit suite and an HTML regression test file — we take the accuracy seriously.

Try it in your browser: https://three-cats-lsp.github.io/LSP_D-planner/
Download the Android APK: https://raw.githubusercontent.com/Three-Cats-LSP/LSP_D-planner/main/Android%20Apk/LSP_D-planner.apk
Source code and full changelog: https://github.com/Three-Cats-LSP/LSP_D-planner

It's free, open source, and always will be. If you try it, we'd genuinely love to hear what you think — feedback from real divers is how this thing gets better.

— Three Cats LSP (@threecats_lsp)
