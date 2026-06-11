/**
 * capacitor-bridge.js
 *
 * Intercepts ALL blob download attempts from exportTXT() and exportPDF().
 *
 * jsPDF 2.5.1 uses a.dispatchEvent(new MouseEvent('click')) — NOT a.click().
 * So we patch BOTH methods on HTMLAnchorElement.
 *
 * FILES ARE SAVED TO:
 *   Primary:  /storage/emulated/0/Download/<filename>   (public Downloads folder)
 *             Uses Directory.EXTERNAL_STORAGE + path 'Download/<filename>'
 *             Requires WRITE_EXTERNAL_STORAGE (declared in manifest, maxSdkVersion=32)
 *             On Android 10+ (API 29+) this uses scoped storage — same visible result.
 *   Fallback: Directory.EXTERNAL (app-scoped, USB-visible, no permission needed)
 *   Last:     Directory.CACHE
 *
 * After saving, the Share sheet opens so user can also forward the file.
 * On web/PWA this entire file does nothing.
 */

(function () {
  if (!window.Capacitor || !window.Capacitor.isNativePlatform()) return;

  const FS = 'Filesystem';
  const SH = 'Share';

  // ── helpers ──────────────────────────────────────────────────────────────

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function notify(msg, isError) {
    console.log('[CapBridge]', msg);
    if (typeof window.showExportToast === 'function') {
      window.showExportToast(msg);
      return;
    }
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = [
      'position:fixed','bottom:24px','left:50%','transform:translateX(-50%)',
      'background:' + (isError ? 'rgba(220,50,50,0.95)' : 'rgba(0,200,255,0.92)'),
      'color:' + (isError ? '#fff' : '#000'),
      'padding:10px 22px','border-radius:20px','font-size:13px','z-index:99999',
      'pointer-events:none','max-width:85vw','text-align:center',
      'font-family:sans-serif','line-height:1.4'
    ].join(';');
    document.body.appendChild(div);
    setTimeout(() => div.remove(), isError ? 5000 : 3500);
  }

  // Request storage permission (needed for EXTERNAL_STORAGE on Android ≤ 12).
  // On Android 13+ this is a no-op (permission removed from system).
  async function ensurePermission() {
    const plugin = Capacitor.Plugins[FS];
    if (!plugin || typeof plugin.requestPermissions !== 'function') return true;
    try {
      const result = await plugin.requestPermissions();
      const status = result && result.publicStorage;
      if (status === 'denied') {
        notify('Storage permission denied — cannot save to Downloads', true);
        return false;
      }
      return true;
    } catch (e) {
      // Android 13+ throws here — that's fine, we don't need the permission
      console.log('[CapBridge] requestPermissions threw (API 33+, expected):', e && e.message);
      return true;
    }
  }

  // Try writing to a specific directory. Returns { uri, dir } or null.
  async function tryWrite(base64Data, filename, directory, path) {
    try {
      const result = await Capacitor.Plugins[FS].writeFile({
        path: path || filename,
        data: base64Data,
        directory: directory,
        recursive: true
      });
      console.log('[CapBridge] writeFile OK dir=' + directory + ' uri=' + result.uri);
      return { uri: result.uri, dir: directory };
    } catch (err) {
      console.warn('[CapBridge] writeFile FAILED dir=' + directory + ':', err && err.message ? err.message : err);
      return null;
    }
  }

  // Write to Downloads → app External → Cache (first success wins)
  async function saveFile(base64Data, filename) {
    // 1. Public Downloads folder (/sdcard/Download/)
    //    Works on all Android versions with WRITE_EXTERNAL_STORAGE permission
    let saved = await tryWrite(base64Data, filename, 'EXTERNAL_STORAGE', 'Download/' + filename);
    if (saved) return { ...saved, label: 'Downloads folder' };

    // 2. App-scoped external (Android/data/com.threecats.lsp.dplanner/files/)
    //    No permission needed, USB-visible
    saved = await tryWrite(base64Data, filename, 'EXTERNAL', filename);
    if (saved) return { ...saved, label: 'Android/data/com.threecats.lsp.dplanner/files/' };

    // 3. Last resort — app cache
    saved = await tryWrite(base64Data, filename, 'CACHE', filename);
    if (saved) return { ...saved, label: 'app cache (use Share to save permanently)' };

    return null;
  }

  // Open native Share sheet for a file:// URI
  async function shareFile(fileUri, filename) {
    const plugin = Capacitor.Plugins[SH];
    if (!plugin || typeof plugin.share !== 'function') return;
    try {
      await plugin.share({ title: filename, url: fileUri, dialogTitle: 'Open or share ' + filename });
    } catch (err) {
      const msg = (err && err.message ? err.message : String(err)).toLowerCase();
      if (!msg.includes('cancel') && !msg.includes('dismiss')) {
        notify('Share error: ' + msg, true);
      }
    }
  }

  // ── main handler ─────────────────────────────────────────────────────────

  async function handleBlobDownload(blob, filename) {
    let base64Data;
    try {
      base64Data = await blobToBase64(blob);
    } catch (err) {
      notify('Export failed: cannot read file — ' + err, true);
      return;
    }

    // Request permission first (shows dialog on Android ≤ 12 if not yet granted)
    const ok = await ensurePermission();
    if (!ok) return;

    const saved = await saveFile(base64Data, filename);
    if (!saved) {
      notify('Export failed — could not write to device', true);
      return;
    }

    notify('✓ Saved to ' + saved.label + ': ' + filename);

    // Also open Share sheet so user can forward/open in viewer
    await shareFile(saved.uri, filename);
  }

  // ── patch a.click() — used by exportTXT ──────────────────────────────────

  const _origClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download && this.href && this.href.startsWith('blob:')) {
      console.log('[CapBridge] a.click() intercepted:', this.download);
      const href = this.href, dl = this.download;
      fetch(href).then(r => r.blob()).then(b => handleBlobDownload(b, dl))
        .catch(err => { notify('Export error: ' + err, true); _origClick.call(this); });
      return;
    }
    _origClick.call(this);
  };

  // ── patch a.dispatchEvent() — used by jsPDF doc.save() ───────────────────

  const _origDispatch = HTMLAnchorElement.prototype.dispatchEvent;
  HTMLAnchorElement.prototype.dispatchEvent = function (event) {
    if (
      event instanceof MouseEvent && event.type === 'click' &&
      this.download && this.href && this.href.startsWith('blob:')
    ) {
      console.log('[CapBridge] a.dispatchEvent(click) intercepted:', this.download);
      const href = this.href, dl = this.download;
      fetch(href).then(r => r.blob()).then(b => handleBlobDownload(b, dl))
        .catch(err => { notify('Export error: ' + err, true); _origDispatch.call(this, event); });
      return true;
    }
    return _origDispatch.call(this, event);
  };

  console.log('[CapBridge] Active — saving to Downloads folder');
})();
