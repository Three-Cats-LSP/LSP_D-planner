/**
 * capacitor-bridge.js
 *
 * Intercepts blob <a download> clicks produced by exportTXT() and exportPDF()
 * and saves the file to the device's Documents directory via @capacitor/filesystem
 * when running inside the Android app.
 *
 * On the web / PWA this file does nothing — the normal <a download> path runs as-is.
 *
 * HOW IT WORKS
 * ------------
 * exportTXT / exportPDF both do:
 *   const a = document.createElement('a');
 *   a.href = URL.createObjectURL(blob);
 *   a.download = 'filename.ext';
 *   document.body.appendChild(a);
 *   a.click();            <-- we intercept this
 *   document.body.removeChild(a);
 *   URL.revokeObjectURL(a.href);
 *
 * We patch HTMLAnchorElement.prototype.click so that when:
 *   - Capacitor is present (i.e. we are in the Android app), AND
 *   - the anchor has a `download` attribute, AND
 *   - the href is a blob: URL
 * we read the blob, base64-encode it, and write it via Filesystem.writeFile
 * instead of letting the browser try to "download" it (which silently fails
 * inside Capacitor's WebView).
 */

(function () {
  // Only activate inside Capacitor (Android app)
  if (!window.Capacitor || !window.Capacitor.isNativePlatform()) return;

  const PLUGIN_NAME = 'Filesystem';

  // Helper: read a blob as base64 string
  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // result is "data:<mime>;base64,<data>" — strip the prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Helper: show a brief toast-style message (reuses app's showExportToast if available)
  function notify(msg) {
    if (typeof window.showExportToast === 'function') {
      window.showExportToast(msg);
      return;
    }
    // Fallback: simple overlay
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = [
      'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%)',
      'background:rgba(0,200,255,0.92)', 'color:#000', 'padding:8px 20px',
      'border-radius:20px', 'font-size:13px', 'z-index:99999',
      'pointer-events:none', 'max-width:80vw', 'text-align:center'
    ].join(';');
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }

  // Save a blob to Documents/<filename> via Capacitor Filesystem
  async function saveViaCapacitor(blob, filename) {
    try {
      const base64Data = await blobToBase64(blob);
      await Capacitor.Plugins[PLUGIN_NAME].writeFile({
        path: filename,
        data: base64Data,
        directory: 'DOCUMENTS',   // Directory.Documents
        recursive: true
      });
      notify(`Saved to Documents: ${filename}`);
    } catch (err) {
      console.error('[CapBridge] writeFile failed:', err);
      // Graceful fallback: try sharing via native share sheet
      try {
        const url = URL.createObjectURL(blob);
        await Capacitor.Plugins['Share'].share({
          title: filename,
          url: url,
          dialogTitle: 'Save or share file'
        });
        URL.revokeObjectURL(url);
      } catch (shareErr) {
        console.error('[CapBridge] share fallback failed:', shareErr);
        notify('Save failed — try copying to clipboard instead');
      }
    }
  }

  // Patch HTMLAnchorElement.prototype.click
  const _origClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (
      this.download &&
      this.href &&
      this.href.startsWith('blob:')
    ) {
      // Fetch the blob from the object URL
      fetch(this.href)
        .then(r => r.blob())
        .then(blob => saveViaCapacitor(blob, this.download))
        .catch(err => {
          console.error('[CapBridge] blob fetch failed:', err);
          _origClick.call(this); // fall back to original behaviour
        });
      // Do NOT call the original click — we're handling it
      return;
    }
    _origClick.call(this);
  };

  console.log('[CapBridge] Filesystem save bridge active');
})();
