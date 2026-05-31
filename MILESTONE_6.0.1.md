# LSP D-PLANNER — Beta 6.0.1 Milestone

**Release date:** 31 May 2026  
**Version:** 6.0.1  
**Branch:** Beta 6  

---

## Summary

Beta 6.0.1 is a comprehensive polish release focusing on export quality, graph correctness, PDF improvements, and UI refinement. No algorithmic changes — all Bühlmann ZH-L16C calculations are unchanged from v5.8.5.

---

## What's New

### 🐛 Critical Fixes

**Dive Profile Graph — staircase corruption**
- Gas switch waypoints were appended out-of-time-order, causing diagonal lines crossing the graph ("fan" pattern). Fixed by sorting waypoints by time after injection.
- Profile line and gradient fill now exclude `gasswitch` type points (drawn as separate vertical markers).
- Tooltip interpolation uses path-only waypoints for correct depth readout.

**ASCII Export — ppO₂ in TXT/clipboard**
- `ppO₂` (U+2082 subscript) was leaking into TXT Note field from `calcContingency` msg string. Fixed at source + `clean()` safety net on `c.msg`.
- All three `clean()` instances (deco TXT, messenger deco, messenger contingency) now handle: `ppO₂→ppO2`, `O₂→O2`, `→>`, `—→-`, `≈→~`, `≥→>=`, `Bühlmann→Buhlmann`, plus expanded emoji strip list.

### 📄 TXT Export — Column Alignment

Full right-alignment pass on all numeric columns (deco + contingency modes):
- **Depth**: single-digit values (`6m`, `9m`) right-justified → ` 6m`
- **Stop**: short times ≤4 chars (`1:00`, `3:10`) right-justified → ` 1:00`
- **Run**: short times ≤4 chars (`2:48`) right-justified → ` 2:48`
- **EAD**: dash → ` -` (padStart 2), values → ` 8m` (padStart 3)
- **PPO2**: 3-char values → ` 0.7` (padStart 4)
- Header line corrected to 49 chars; separator matches at 49 dashes.
- Contingency TXT: added `shortMix()` to mix column (was outputting raw DOM text `AIR (21%)` instead of `AIR`).
- Deco TXT header: 2-space separators between fields (was 4-space).
- Gas switch `(switch @` spacing: single space before parenthesis.

### 📋 Messenger / Copy Export

- `EAN50` (no space) consistent across all `shortMix()` instances.
- Contingency messenger: totals now show `mm'ss"` formatted run/deco time and CNS% (was plain integer minutes, was missing CNS).
- Contingency `clean()` now includes digit-unit collapsing (`50 m → 50m`).

### 📊 Dive Profile Graph (Beta 6.0 features)

- **Interactive hover/touch**: crosshair + tooltip showing depth, time, gas, ppO2, CNS% at any point.
- **Gas switch vertical markers**: dashed cyan lines at switch depths with gas label.
- **Single merged deco zone**: one light background rectangle for full deco phase (replacing per-stop overlapping fills that created darkening bands).
- **Unit-aware axes**: depth labels show `m`/`ft` based on user preference in both profile graph and GF curve.

### 📑 PDF Export

- **Contingency PDF**: now includes a dive profile graph page (temporarily swaps in contingency rows, captures canvas, restores).
- **Section headers**: reduced from 13px → 10px; tighter padding.
- **Tissue saturation bars**: SVG `viewBox="0 0 400 10"` + `width:100%` — bars now fill full page width.
- **Footer overlap**: `padding-bottom: 40px` prevents last card overlapping fixed footer.

### 🎨 UI / Theme

- **Light theme yellow**: `#FAFA33` (Lemon) → `#FFBF00` (Amber) — better contrast on light backgrounds.
- **Light theme green**: `#7CFC00` (Lawn Green) → `#50C878` (Emerald Green).
- **Web table alignment**: Depth, Stop, Run, EAD, PPO2 columns right-aligned via CSS `nth-child`. Gas switch rows explicitly left-aligned (`!important`).
- **Settings row (mobile)**: changed from `justify-content: center` → `flex-start` — settings no longer center on small screens.
- **REF button**: moved from settings row → right end of main tabs-nav and Tools sub-nav (`margin-left:auto`).
- **PDF button icon**: replaced tiny document-page SVG with `inline-block` `16×16px` plain text span — same size as copy/TXT buttons, crisp on all devices.

---

## Audit

87 automated checks covering JS syntax, structure, TXT column formatting, ASCII cleanliness, messenger format, graph integrity, PDF variables, colours, UI layout, and export buttons.

Run before any future release:
```
python3 audit.py
```

---

## Files Changed

- `index.html` — all changes above
- `audit.py` — new, 87 checks
- `MILESTONE_6.0.1.md` — this file
- `CHANGELOG.md` — updated
- `VERSION` — `6.0.1`

---

*LSP D-PLANNER is a planning aid only. Not a substitute for training, certification, or a dive computer.*  
*Generated plans must be validated against your dive computer before any dive.*
