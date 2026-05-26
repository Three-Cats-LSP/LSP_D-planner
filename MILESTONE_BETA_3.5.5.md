# 🛠️ LSP D-PLANNER — BETA 3.5.5 MILESTONE

**Version:** Beta 3.5.5  
**Release Date:** May 26, 2026  
**Focus:** Mobile Polish + TXT Export Fixes  
**Status:** ✅ COMPLETE & PRODUCTION READY  
**Lines of Code:** 4,042  

---

## 🎯 BETA 3.5.5 SUMMARY

Beta 3.5.5 is a focused polish release consolidating Tissue Saturation and GF Curve into the Deco Schedule tab, fixing the TXT export comprehensively, and adding small UX improvements throughout.

---

## ✨ WHAT'S NEW

### 1. Tissue Sat + GF Curve Moved Into Deco Schedule

Both sections now appear automatically below the dive profile table after running a deco calculation — no more switching tabs:

```
Deco Schedule tab:
  ├── Input form
  ├── Dive Profile (stats + graph + table)
  ├── Tissue Saturation  ← now inline ✅
  └── GF Curve           ← now inline ✅
```

Tab bar simplified from 8 tabs to 6:
```
Before: Dive Planner | NDL | Multi | Tissue Sat. | Deco | GF Curve | CNS O₂ | Reference
After:  Dive Planner | NDL | Multi | Deco Schedule | CNS O₂ | Reference
```

### 2. TXT Export — Comprehensive Fix

**Purple bullet removed:**
- Was `🟣` emoji in the deco warning alert being captured by `innerText`
- Now all emoji stripped from summary text before export

**Icons replaced with text labels:**
- Before: garbled emoji characters
- After: `Descent`, `Bottom`, `Ascent`, `Deco`, `Safety`, `Gas Switch`

**New column structure:**
```
Phase     | Depth         | Stop    | Run     | Mix            | PPO2  | CNS%
──────────┼───────────────┼─────────┼─────────┼────────────────┼───────┼──────
Descent   | 0 → 60 m      | 2.7 min | 3 min   | AIR (21%)      | 0.84  | 0.7%
Bottom    | 60 m           | 30 min  | 33 min  | AIR (21%)      | 1.72  | 18.3%
Gas Switch| EAN 50 @ 23 m · ppO2 1.5
Deco      | 21 m           | 3 min   | 37 min  | EAN 50         | 1.40  | 2.0%
Safety    | 6 m            | 3 min   | 58 min  | EAN 50         | 1.06  | 0.2%
```

**Plain O2 and ppO2 throughout:**
- `O₂` → `O2` everywhere in TXT file
- `ppO₂` → `ppO2` everywhere in TXT file
- Applied to: table rows, summary, gas tags, reminders

**Gas Mixes section added:**
```
━━━ GAS MIXES ━━━
Bottom: AIR (21%) — 21% O2 @ surface→60m
Deco: EAN 50 — 50% O2 @ 23 m
Deco: 100% O2 — 100% O2 @ 6 m
```

### 3. Gas Switch Row "@" Symbol
- Changed `at 21 m` → `@ 21 m` in gas switch rows
- Removed first `·` separator: `⇄ EAN 50 @ 21 m · ppO2 1.40`

### 4. Compartment Detail — Always Table on Mobile
- Tissue table now permanently uses `table-view` class
- Renders as standard scrollable table on all screen sizes
- No cards layout for this data type

---

## 📝 CHANGELOG

### Added ✨
- Tissue Saturation inline in Deco Schedule tab
- GF Curve inline in Deco Schedule tab
- Gas Mixes section in TXT export
- `data-phase` used for TXT phase labels

### Changed 🔄
- Tab bar: 8 tabs → 6 tabs
- Gas switch: `at` → `@`, removed first `·`
- TXT export: new 7-column table with proper text labels
- TXT export: all emoji stripped from summary
- TXT export: `O₂` → `O2`, `ppO₂` → `ppO2` throughout
- Compartment Detail: always table view (never cards)

### Fixed 🐛
- Purple `🟣` bullet appearing in TXT export
- Icons showing as garbled characters in TXT
- `O₂` subscript rendering as unknown char in text files
- Tissue/GF curve required separate tab switch

### Removed ❌
- `Tissue Sat.` tab (content moved to Deco Schedule)
- `GF Curve` tab (content moved to Deco Schedule)

---

## 📊 STATISTICS

| Metric | Beta 3.5 | Beta 3.5.5 | Change |
|--------|----------|------------|--------|
| Lines of code | 4,012 | 4,042 | +30 |
| Tabs | 8 | 6 | -2 |
| TXT export columns | 6 | 7 | +1 |
| Breaking changes | 0 | 0 | — |

---

## 🔄 BACKWARDS COMPATIBLE

- ✅ All Beta 3.5 features preserved
- ✅ Light/Dark theme unchanged
- ✅ PDF export unchanged
- ✅ Mobile card/table toggle unchanged
- ✅ Zero breaking changes

---

**Contact:** @threecats_lsp  
**License:** MIT  
🤿 *Cleaner tabs. Cleaner exports. Better diving!*
