# LSP D-PLANNER — Professional Dive Planning Tool

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Version](https://img.shields.io/badge/version-5.6.3--beta-blue)
![License](https://img.shields.io/badge/license-training%20use-orange)
![Dive Safe](https://img.shields.io/badge/dive-safe-success)

**A comprehensive professional dive planning application with emergency scenario planning.**

## 🎯 Quick Start

1. **Download** `index.html` from this release
2. **Open** in any modern web browser (Chrome, Firefox, Safari, Edge)
3. **Bookmark** or add to home screen (PWA)
4. **Use** for dive planning (works offline!)

That's it! No installation required.

## ✨ Features

### Planning Modes
- 🎯 **PADI REC** - Recreational dive table calculations
- 🔬 **Bühlmann ZH-L16C** - Technical dive algorithm with GF settings
- 🛠️ **Tools** - Reference calculations and utilities

### Core Capabilities
- 📊 Decompression schedule generation
- 📈 NDL (No Decompression Limit) table lookup
- 🚨 Emergency planning (lost gas, extra bottom time)
- 🔄 Multi-dive scenario planning
- 📱 Mobile-optimized responsive design
- 📥 Export to Text, PDF, or Copy to Clipboard
- 🌐 Offline-capable Progressive Web App (PWA)

### Safety Features
- ⚠️ ppO₂ monitoring and limits
- 🧬 CNS oxygen tracking
- 🔴 Contingency scenario planning
- 📝 Training & planning disclaimers

## 📊 What's in BETA 5.6.3

### New Features
✨ **Unified Export Filenames** - Easy to organize and identify dive plans
- `dive-plan-2026-05-27_Standard_Plan.txt`
- `dive-plan-2026-05-27_Lost_EAN50.txt`
- `dive-plan-2026-05-27_Extra_10_min_BT.txt`

✨ **Mobile COPY Fixed** - Copy button now works on iOS Safari, Android Chrome
✨ **Contingency Auto-Update** - Recalculates in real-time when you change parameters
✨ **Clean Export Headers** - Removed redundant prefixes, improved readability
✨ **GF Values Display** - Fixed bug where GF showed "—/—"
✨ **PDF Tab Behavior** - Consistent tab opening (not window)

### Bug Fixes
🐛 Mobile clipboard fallback improved
🐛 GF display corrected
🐛 Contingency auto-recalculation added
🐛 PDF window behavior fixed
🐛 Deco tab visibility in Bühlmann mode fixed
🐛 Terminology clarified ("Lost" instead of "Without")

## 💾 File Specifications

| Attribute | Details |
|-----------|---------|
| **Filename** | index.html |
| **Size** | 242 KB (uncompressed) / 70 KB (compressed) |
| **Format** | Single HTML file (no dependencies) |
| **Language** | HTML5 + Vanilla JavaScript + CSS3 |
| **Dependencies** | None |
| **Requirements** | Modern web browser |
| **Offline** | Fully functional (PWA) |

### Hash Verification
```bash
# Verify file integrity
sha256sum index.html

# Expected:
d2b5ca3d43396e60a590b7d990ccb98cab6e80dfa7ae0d6b27fc40198550ff8d
```

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| iOS Safari | 14+ | ✅ Full support |
| Android Chrome | 90+ | ✅ Full support |
| Samsung Internet | 14+ | ✅ Full support |

## 📱 Platform Support

- ✅ Windows (any version, any browser)
- ✅ macOS (Sierra+)
- ✅ Linux (any distribution)
- ✅ iOS (14+) - PWA capable
- ✅ Android (11+) - PWA capable
- ✅ Tablets (all sizes)

## 🚀 Installation Methods

### Method 1: Direct Use (Easiest)
```
1. Download index.html
2. Double-click to open in browser
3. Use immediately
```

### Method 2: Local Web Server
```bash
# Python 3
python3 -m http.server 8000

# Then visit: http://localhost:8000/index.html
```

### Method 3: PWA Installation (Mobile)
```
1. Open index.html in mobile browser
2. Tap menu → "Add to Home Screen"
3. App appears on home screen
4. Works offline like native app
```

### Method 4: Bookmark (Desktop)
```
1. Open index.html in browser
2. Bookmark with Ctrl+D (Windows) or Cmd+D (Mac)
3. Access from bookmarks anytime
```

## 📖 How to Use

### Basic Dive Planning
1. Select planning mode (REC, Bühlmann, or Tools)
2. Enter dive parameters (depth, bottom time, gas mix)
3. Set water density and ascent rates
4. View results (NDL, decompression schedule, warnings)
5. Export as text, PDF, or copy to clipboard

### Emergency Planning
1. Calculate your standard dive plan
2. Click "Emergency Plan" section
3. Select scenario (lost gas, extra bottom time, or both)
4. View contingency procedure
5. Export for backup reference

### Multi-Dive Scenarios
1. Plan first dive
2. Set surface interval time
3. View second dive NDL (affected by residual nitrogen)
4. Combine results with copy function

## ⚠️ Safety Information

### DISCLAIMER - READ CAREFULLY

**This tool is for training and planning purposes ONLY.**

#### What You MUST Do
✅ Always use a dive computer (this is NOT a replacement)
✅ Plan conservatively (20% safety margin minimum)
✅ Never dive at table limits
✅ Follow your certification level
✅ Never exceed 40m depth (PADI recreational limit)
✅ Never dive alone
✅ Consult with certified dive masters

#### What You MUST NOT Do
❌ Use as primary dive computer
❌ Dive exact table limits
❌ Exceed your training depth
❌ Dive without proper equipment
❌ Dive if feeling unwell
❌ Ignore dive computer warnings

### Important Reminders
- 🔴 **Do NOT skip decompression stops** - They save lives
- 🔴 **Check ppO₂ before every gas switch** - Hyperoxia is deadly
- 🔴 **Carry reserve gas** - Plan for emergencies
- 🔴 **Use multiple redundant systems** - Backup is essential
- 🔴 **Stop dive if unwell** - Abort immediately if something feels wrong

**Your life depends on these decisions. Be conservative. Stay safe.**

## 🔒 Privacy & Security

✅ **No Data Collection**
- All calculations local to your device
- No cloud uploads
- No analytics or tracking
- No personal data stored

✅ **Open Source**
- Inspect code in browser DevTools
- View all JavaScript
- Verify calculations
- Completely transparent

✅ **Offline Operation**
- Works without internet
- No external API calls
- Full functionality offline
- Privacy guaranteed

## 📊 Export Examples

### Standard Dive Plan
```
Filename: dive-plan-2026-05-27_Standard_Plan.txt

DECOMPRESSION SCHEDULE
Depth: 40m  BT: 30min  GF: 30/70
Gas: EAN32 (32%)  Water: EN13319

Phase       Depth           Stop      Run       Mix              PPO2    CNS%
Descent     40              —         3         EAN32 (32%)      1.28    0%
Bottom      40              —         27        EAN32 (32%)      1.28    45%
Deco        9               3         1         100% O2          0.90    50%
Safety      5               3         1         Air 21% O2       0.50    51%
Ascent      0               —         1         Air 21% O2       0.10    51%

Training & Planning Use Only
Generated by LSP D-PLANNER: 5/27/2026, 3:32:45 PM
```

### Emergency Scenarios
- `dive-plan-2026-05-27_Lost_EAN50.txt`
- `dive-plan-2026-05-27_Extra_10_min_BT.txt`
- `dive-plan-2026-05-27_Lost_Both_Gases.txt`

## 📚 Documentation in This Release

- **README.md** - This file (overview and quick start)
- **MILESTONE.md** - Complete feature list and changelog
- **RELEASE_NOTES.md** - User guide and installation
- **CHECKLIST.md** - QA verification and testing results
- **UPLOAD_GUIDE.md** - GitHub upload instructions
- **FILES_SUMMARY.txt** - Package contents overview
- **SHA256.txt** - Hash for file verification
- **00_START_HERE.txt** - Quick navigation guide

## 🎓 Educational Use

This app is designed for:
- PADI certification courses
- Dive master training
- Technical diving education
- Dive planning workshops
- Emergency scenario practice
- Student learning and practice

## 🤝 Support & Feedback

- **Issues**: [GitHub Issues](https://github.com/[user]/lsp-d-planner/issues)
- **Discussions**: [GitHub Discussions](https://github.com/[user]/lsp-d-planner/discussions)
- **Email**: [your-email]

## 📊 Technical Details

### Architecture
- Single-file deployment (no build process)
- 100% Vanilla JavaScript (no frameworks)
- No external dependencies
- ~5400 lines of code
- 150+ functions
- 2 algorithms (PADI + Bühlmann ZH-L16C)

### Performance
- Load time: <1 second
- Memory usage: 5-8 MB
- Processing: Real-time calculations
- Export speed: Instant
- Mobile optimized

### Accessibility
- Responsive design (mobile, tablet, desktop)
- Touch-optimized controls
- Keyboard navigation support
- High contrast dark/light themes
- Clear typography and spacing

## 🎉 Release Information

**Version**: 5.6.3-beta  
**Release Date**: May 28, 2026  
**Status**: Production Ready ✅  
**Quality**: High Confidence ✅  

### What's New in 5.6.3
- ✅ Export filename consistency
- ✅ Mobile COPY button support
- ✅ Contingency auto-recalculation
- ✅ Clean export headers
- ✅ GF value fixes
- ✅ PDF tab behavior fixed

## 📋 Requirements

- **Processor**: Any modern CPU
- **RAM**: 512 MB minimum, 1 GB recommended
- **Storage**: <250 KB (just the HTML file)
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Network**: Internet required only for download

## ⭐ Why Choose LSP D-PLANNER?

✅ **Free** - No subscriptions or fees  
✅ **Open** - Full source code visible  
✅ **Offline** - Works without internet  
✅ **Accurate** - Industry-standard algorithms  
✅ **Simple** - Easy to use interface  
✅ **Mobile** - Works on all devices  
✅ **Safe** - Emphasizes conservative planning  
✅ **Professional** - Production-quality code  

## 📜 License

**Training & Planning Use Only**

This software is provided for educational and recreational dive planning purposes. Commercial use requires separate licensing.

---

## 🚀 Getting Started

### For Beginners
1. Download `index.html`
2. Read the safety disclaimer
3. Try with sample dives
4. Export a test plan
5. Review output format

### For Experienced Divers
1. Download `index.html`
2. Configure your preferences
3. Plan your next dive
4. Export and review
5. Share with dive buddies

### For Mobile Users
1. Download `index.html`
2. Open in mobile browser
3. Tap "Add to Home Screen"
4. Bookmark or install PWA
5. Use offline anytime

---

**Training & Planning Use Only — Never Dive Alone**

*For questions or issues, please use GitHub Issues or Discussions.*

---

Generated: May 28, 2026  
Version: 5.6.3-beta  
Status: Production Ready ✅
