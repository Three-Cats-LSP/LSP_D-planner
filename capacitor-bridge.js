/**
 * capacitor-bridge.js
 *
 * Intercepts blob <a download> clicks produced by exportTXT() and exportPDF()
 * and saves the file via @capacitor/filesystem, then shares via @capacitor/share.
 *
 * On the web / PWA this file does nothing — the normal <a download> path runs as-is.
 *
 * STRATEGY
 * --------
 * 1. Write file to Directory.EXTERNAL (app-scoped external dir).
 *    Path: Android/data/com.threecats.lsp.dplanner/files/<filename>
 *    No storage permissions needed on any Android version.
 *    The file STAYS there permanently — user can also access via USB.
 *
 * 2. Pass the returned file:// URI to @capacitor/share Share.share().
 *    The Share plugin converts it to a content:// URI via FileProvider internally
 *    and shows the native Android share sheet.
 *    User can tap: "Save to Downloads", "Files", Google Drive, email, etc.
 *
 * 3. Toast confirms the permanent save location regardless of share outcome.
 *
 * WHY NOT FileOpener:
 *    FileOpener uses ACTION_VIEW which requires a specific viewer app to handle
 *    the content:// URI. If no PDF viewer is installed it fails silently.
 *    Share (ACTION_SEND) presents all capable apps and always works.
 *
 * WHY NOT Directory.CACHE:
 *    Cache is app-private — user cannot browse to it. Files are deleted by Android
 *    when storage is low. EXTERNAL survives and is visible to the user.
 *
 * WHY NOT Directory.Documents / Directory.ExternalStorage:
 *    Requires MANAGE_EXTERNAL_STORAGE on Android 11+ — not granted by default.
 */

(function () {
  // Only activate inside Capacitor (Android app)
  if (!window.Capacitor || !window.Capacitor.isNativePlatform()) return;

  const FS = 'Filesystem';
  const SH = 'Share';

  // Helper: read a blob as base64 string
  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Helper: show a brief toast (reuses app's showExportToast if available)
  function notify(msg) {
    if (typeof window.showExportToast === 'function') {
      window.showExportToast(msg);
      return;
    }
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = [
      'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%)',
      'background:rgba(0,200,255,0.92)', 'color:#000', 'padding:8px 20px',
      'border-radius:20px', 'font-size:13px', 'z-index:99999',
      'pointer-events:none', 'max-width:80vw', 'text-align:center'
    ].join(';');
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3500);
  }

  // Write blob to Directory.EXTERNAL (app-scoped, no permission needed, permanent).
  // Returns the file:// URI string, or null on failure.
  async function writeExternal(base64Data, filename) {
    try {
      const result = await Capacitor.Plugins[FS].writeFile({
        path: filename,
        data: base64Data,
        directory: 'EXTERNAL',
        recursive: true
      });
      console.log('[CapBridge] Saved to EXTERNAL:', result.uri);
      return result.uri; // file:///sdcard/Android/data/.../files/<filename>
    } catch (err) {
      console.error('[CapBridge] writeFile EXTERNAL failed:', err);
      return null;
    }
  }

  // Show native share sheet for a file:// URI.
  // Share plugin converts it to content:// via FileProvider internally.
  async function shareFile(fileUri, filename) {
    const plugin = Capacitor.Plugins[SH];
    if (!plugin || typeof plugin.share !== 'function') {
      console.warn('[CapBridge] Share plugin not available');
      return false;
    }
    try {
      await plugin.share({
        title: filename,
        url: fileUri,
        dialogTitle: 'Save ' + filename
      });
      return true;
    } catch (err) {
      // User dismissed the sheet — that's fine, file is already saved to EXTERNAL
      console.warn('[CapBridge] Share dismissed or failed:', err);
      return false;
    }
  }

  // Main handler called for every intercepted blob download
  async function saveAndOpen(blob, filename) {
    // Encode blob
    let base64Data;
    try {
      base64Data = await blobToBase64(blob);
    } catch (err) {
      console.error('[CapBridge] blobToBase64 failed:', err);
      notify('Export failed — could not read file data');
      return;
    }

    // Write to permanent EXTERNAL location first
    const fileUri = await writeExternal(base64Data, filename);
    if (!fileUri) {
      notify('Export failed — could not write file');
      return;
    }

    // Confirm saved (file is already on device regardless of what happens next)
    notify('Saved: ' + filename);

    // Open share sheet so user can also send to Downloads / Drive / etc.
    await shareFile(fileUri, filename);
  }

  // Patch HTMLAnchorElement.prototype.click to intercept blob downloads
  const _origClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download && this.href && this.href.startsWith('blob:')) {
      fetch(this.href)
        .then(r => r.blob())
        .then(blob => saveAndOpen(blob, this.download))
        .catch(err => {
          console.error('[CapBridge] blob fetch failed:', err);
          _origClick.call(this);
        });
      return; // don't call original — we're handling it
    }
    _origClick.call(this);
  };

  console.log('[CapBridge] Bridge active — EXTERNAL write + Share sheet');
})();
