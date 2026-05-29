# LSP D-PLANNER — Milestone v5.7.1
**Date:** 2026-05-30
**Status:** ✅ RELEASE — Bug Fix

---

## Summary

v5.7.1 is a comprehensive bug fix release addressing unit conversion, export
formatting, and display consistency issues found during beta testing.

---

## Fixes

### Units — Imperial / Metric

- **Global units toggle** moved to header — single control affects all tabs
- **Safety stop buttons** now show `10 ft / 20 ft` when imperial
- **Rate dropdowns** (Descent/Ascent/Deco/Surface) show `ft/min` when imperial
- **Deco Step Size and Last Deco Stop** dropdowns show `ft` when imperial
- **Stats bar** — Depth, Last Stop, Step Size, END narcotic all unit-aware
- **Descent row** `0 → 538 ft` was double-converting rawD — fixed
- **Dive graph Y-axis** now shows `ft` ticks when imperial
- **GF curve Y-axis** now shows `ft` ticks when imperial
- **Changing units** now auto-recalculates deco plan so legend and table update
- **TXT export** — `du` was reading stale `localStorage` (never written) instead
  of the live `units` variable — all TXT exports now correctly unit-aware
- **PDF export** — Depth, Last Stop, Step Size stats fixed to `ft` when imperial
- **CNS tracker TXT** — depth was hardcoded `m`

### Copy Format

- **GF shows `—/—`** in copy — fixed to read from `mGF.low/high` directly
- **Dive graph** was cut off at 25min — `lastT` was reading the totals row
  (empty run time) instead of the last data row
- **Copy header** now shows plan type: `-- DECO PLAN --` / `-- EMERGENCY PLAN --`
- **Copy totals** split to two lines: `Run Time / Deco` then `CNS% / OTU`
- **`GSw`** replaced with `>>` in all copy and TXT outputs
- OTU added to copy totals line

### Contingency / Emergency Export

- Renamed `CONTINGENCY` → `EMERGENCY` throughout all exports
- TXT: `CONTINGENCY ASCENT SCHEDULE` → `EMERGENCY ASCENT SCHEDULE` with `-` divider
- TXT: Ascent rows show destination only (`Asc  24m`) not `Asc  50m→24m`
- TXT: Totals line now includes `Run Time / Deco / CNS% / OTU`
- Copy: `⇄` stripped from gas switch lines
- Copy: Emergency totals match deco plan format exactly

### Export Filenames

| Export | Format |
|--------|--------|
| Deco TXT | `LSP_2026-05-30_Deco_50m_25min_GF30-70.txt` |
| Emergency TXT | `LSP_2026-05-30_Contingency_50m_25min_Lost_EAN_50.txt` |
| Deco PDF | `LSP_2026-05-30_Deco_50m_25min_GF30-70.pdf` |
| Emergency PDF | `LSP_2026-05-30_Contingency_50m_25min_Lost_EAN_50.pdf` |
| Planner TXT | `LSP_2026-05-30_Plan_50m_25min.txt` |

### PDF

- **Totals row spacing**: `Run time: 61'13"  Deco time: 30'20"  CNS: 58.3%  OTU: 85`
- PDF filenames now match TXT naming convention

### Rates TXT Export

- Rates line reformatted:
  `Rates       : Descent: 18 m/min  Ascent: 9 m/min  Deco: 6 m/min  Surface: 3 m/min`

---

## Build
- Single-file PWA: `index.html` (6411 lines)
- Branched from v5.7.0 algorithm milestone
