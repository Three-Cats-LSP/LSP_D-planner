# Deployment Guide

## For End Users

### Download and Use
1. Download index.html from releases
2. Save to preferred location
3. Open in web browser
4. Bookmark for quick access

### PWA Installation
1. Open index.html in mobile browser
2. Tap menu → "Add to Home Screen"
3. Choose app name
4. Tap "Add"
5. App appears on home screen

## For Developers

### Setting Up Development Environment
```bash
# Clone repository
git clone https://github.com/[username]/lsp-d-planner.git
cd lsp-d-planner

# Start local server
python3 -m http.server 8000

# Open in browser
http://localhost:8000/index.html
```

### Testing
- Chrome DevTools (F12)
- Firefox Developer Tools (F12)
- Safari Web Inspector
- Mobile device testing

### Building for Distribution
- Single index.html file
- No build process needed
- No dependencies to install
- Works as-is

## For GitHub Pages

### Enable GitHub Pages
1. Go to Repository Settings
2. Scroll to GitHub Pages
3. Select: Source → main branch / root
4. Click Save
5. Site published at: https://[username].github.io/lsp-d-planner

### Accessing on GitHub Pages
- Direct: https://[username].github.io/lsp-d-planner/index.html
- Or add index.html as default

## Updating

### Releasing New Version
1. Update version in package.json
2. Update CHANGELOG.md
3. Commit and push
4. Create GitHub release
5. Upload files
6. Publish release

### Testing Before Release
1. Test on multiple browsers
2. Test on mobile devices
3. Test all features:
   - REC mode
   - Bühlmann mode
   - Tools mode
   - Export formats
   - Emergency planning
4. Verify calculations
5. Check mobile responsiveness

