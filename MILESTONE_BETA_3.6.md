# 🎨 LSP D-PLANNER — BETA 3.6 MILESTONE

**Version:** Beta 3.6  
**Release Date:** May 26, 2026  
**Focus:** Design Polish + Graph Improvements  
**Status:** ✅ COMPLETE & PRODUCTION READY  
**Lines of Code:** 4,171  
**File Size:** 178 KB  

---

## 🎯 BETA 3.6 SUMMARY

Beta 3.6 is the most polished release yet — a comprehensive design overhaul of every UI component, HiDPI-sharp canvas graphs with smart label placement, mobile-optimised graph legends, smarter PDF page layout, and a cleaner tab order for Bühlmann mode.

---

## ✨ NEW FEATURES

### 1. Full UI Design Overhaul

**Header:**
- Brand icon: 52px → 44px, subtler glow animation
- Title font tighter, cleaner spacing

**Tab bar:**
- Horizontal scroll only (no wrap), scrollbar hidden
- Font: 10px 600 weight, tighter padding

**Cards:**
- `backdrop-filter` removed (performance + clarity)
- `card-title` switched Bebas Neue → Outfit 700 uppercase
- Slightly tighter padding (22px → 20px)
- Subtle top-edge gradient line

**Calculate button:**
- Bebas Neue → Outfit 700, 13px with letter-spacing
- Hover: lift + glow

**Stats cells:**
- Tighter (26px value, 8px label)
- Hover lifts slightly

**Alerts & info-boxes:**
- Alerts: Outfit font (more readable)
- Info-box: Outfit font, left accent border

**Result cards:**
- Title: Bebas Neue → Outfit 700 uppercase

### 2. HiDPI / Retina Sharp Graphs

Added `setupHiDPI()` — reads `devicePixelRatio`, scales canvas 2-3× then back down via CSS. Text renders at full screen resolution on all devices.

### 3. Graph Typography

Both graphs (Dive Profile + GF Curve):
- **Desktop:** `300 9px` grid labels, `500 10px` dot labels
- **Mobile (<480px):** `300 8px` grid labels, `300 8px` dot labels
- Line width: 2px desktop, 1.5px mobile
- Dot radius: 5px desktop, 3px mobile

### 4. Numbered Dots on Graphs

Every stop dot now has a white number inside it (1, 2, 3...) for easy reference between graph and legend.

### 5. Smart Label Placement

- Labels: upper-left of dot
- ppO₂: down-right (or down-left near right edge)
- Desktop: labels shown on graph with number prefix
- Mobile: dots only — labels in legend table below

### 6. Mobile Graph Legend

On mobile, a clean table appears below both graphs:

**Dive Profile legend:**
```
#  Stop         Run    ppO₂
1  60m          3min   —
2  21m - 2min   39min  1.50
3  18m - 2min   41min  1.40
```

**GF Curve legend:**
```
#  Stop         GF%
1  21m - 2min   32%
2  18m - 2min   35%
```

### 7. Bühlmann Tab Order Redesigned

```
Deco Schedule | Dive Planner | Multi Dive | CNS O₂ | NDL Tables | Reference
```
- **Deco Schedule** is now the default tab in Bühlmann mode
- Switching back to Rec → auto-returns to Dive Planner

### 8. Deco Schedule Section Order

```
Stats summary
Dive Profile Table + Icon Legend
Dive Profile Graph + Mobile Legend   ← moved below table
GF Gradient Factor Curve             ← moved before Tissue
Tissue Saturation
Compartment Detail
```

### 9. PDF Export — Smarter Page Layout

**Page 1:** Dive Plan Summary + Dive Profile Table + Legend  
**Page 2:** Dive Profile Graph + GF Gradient Factor Curve  
**Page 3:** Tissue Saturation  

- Gas switch row: green → blue (matching web table)

---

## 📝 CHANGELOG

### Added ✨
- `setupHiDPI()` canvas scaling function
- Numbered dots on both graphs
- Mobile graph legend (dive profile + GF curve)
- `gfCurveLegend` div in HTML
- `decoProfileLegend` shown/hidden based on screen width
- `num` property on waypoints for dot numbering
- Dot number rendered inside each dot

### Changed 🔄
- Complete CSS overhaul: header, tabs, cards, buttons, stats, alerts, info-box, result-cards
- `card-title`: Bebas Neue → Outfit 700
- `btn-calc`: Bebas Neue → Outfit 700 13px
- Graph fonts: HiDPI, weight 300/500, size-responsive
- Graph line widths: 2px desktop, 1.5px mobile
- Graph dot sizes: 5px desktop, 3px mobile
- Label position: upper-left (depth/time), down-right (ppO₂)
- Tab order: Deco Schedule first in Bühlmann
- Default tab: Deco Schedule (Bühlmann), Dive Planner (Rec)
- Dive Profile graph: moved below table
- GF Curve: moved before Tissue Saturation
- PDF page 2: Graph + GF Curve together
- PDF page 3: Tissue Saturation
- PDF gas switch: green → blue

### Fixed 🐛
- Blurry graph text on HiDPI/Retina screens
- Cluttered graph labels on mobile
- Duplicate `pdfLegend` breaking all JS/tabs
- Gas switch PDF color mismatch (green vs blue)
- ppO₂ label going off right edge of graph

---

## 📊 STATISTICS

| Metric | Beta 3.5.5 | Beta 3.6 | Change |
|--------|------------|----------|--------|
| Lines of code | 4,042 | 4,171 | +129 |
| File size | 171 KB | 178 KB | +7 KB |
| PDF pages | 4 | 3 | -1 |
| Breaking changes | 0 | 0 | — |

---

## 🔄 BACKWARDS COMPATIBLE

- ✅ All Beta 3.5.5 features preserved
- ✅ PADI RDP + Bühlmann unchanged
- ✅ PDF export improved, not broken
- ✅ Zero breaking changes

---

**Contact:** @threecats_lsp  
**License:** MIT  
🤿 *Sharpest. Cleanest. Best looking yet!*
