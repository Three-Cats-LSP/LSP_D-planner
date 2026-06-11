/**
 * capacitor-bridge.js
 *
 * Intercepts ALL blob download attempts — both exportTXT (uses a.click()) and
 * exportPDF via jsPDF 2.5.1 (uses a.dispatchEvent(new MouseEvent('click'))).
 *
 * On the web / PWA this file does nothing.
 *
 * HOW jsPDF doc.save() WORKS INTERNALLY (jsPDF 2.5.1):
 *   1. Calls output('blob') to get the PDF as a Blob
 *   2. Creates <a href=blob: download=filename>
 *   3. Calls a.dispatchEvent(new MouseEvent('click'))  ← NOT a.click()
 *   So patching HTMLAnchorElement.prototype.click is NOT enough for PDF.
 *   We must ALSO patch dispatchEvent.
 *
 * WHAT WE PATCH:
 *   - HTMLAnchorElement.prototype.click         → catches exportTXT
 *   - HTMLAnchorElement.prototype.dispatchEvent → catches exportPDF (jsPDF)
 *
 * WHERE FILES ARE SAVED:
 *   We use Directory.EXTERNAL (getExternalFilesDir) which is app-scoped,
 *   needs no runtime permission on any Android version, and is accessible
 *   via USB at: Android/data/com.threecats.lsp.dplanner/files/
 *
 *   After saving we open the Share sheet (ACTION_SEND via @capacitor/share)
 *   so the user can also send to Downloads, Drive, email, etc.
 *   The Share plugin handles FileProvider content:// URI conversion internally.
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

  // Write to EXTERNAL (app-scoped, no permission, USB-visible).
  // Falls back to CACHE if EXTERNAL unavailable.
  async function writeFile(base64Data, filename) {
    for (const dir of ['EXTERNAL', 'CACHE']) {
      try {
        const result = await Capacitor.Plugins[FS].writeFile({
          path: filename,
          data: base64Data,
          directory: dir,
          recursive: true
        });
        console.log('[CapBridge] writeFile OK dir=' + dir + ' uri=' + result.uri);
        return { uri: result.uri, dir };
      } catch (err) {
        console.warn('[CapBridge] writeFile FAILED dir=' + dir + ':', err && err.message ? err.message : err);
      }
    }
    return null;
  }

  // Open native Share sheet
  async function shareFile(fileUri, filename) {
    const plugin = Capacitor.Plugins[SH];
    if (!plugin || typeof plugin.share !== 'function') {
      notify('Share plugin not available — file saved to Android/data/com.threecats.lsp.dplanner/files/', false);
      return;
    }
    try {
      console.log('[CapBridge] Share.share url=' + fileUri);
      await plugin.share({
        title: filename,
        url: fileUri,
        dialogTitle: 'Save ' + filename
      });
    } catch (err) {
      const msg = (err && err.message ? err.message : String(err)).toLowerCase();
      if (!msg.includes('cancel') && !msg.includes('dismiss')) {
        notify('Share error: ' + msg, true);
      }
    }
  }

  // ── core handler ─────────────────────────────────────────────────────────

  async function handleBlobDownload(blob, filename) {
    let base64Data;
    try {
      base64Data = await blobToBase64(blob);
    } catch (err) {
      notify('Export failed: cannot read file data — ' + err, true);
      return;
    }

    const saved = await writeFile(base64Data, filename);
    if (!saved) {
      notify('Export failed — could not write file to device', true);
      return;
    }

    const where = saved.dir === 'EXTERNAL'
      ? 'Android/data/com.threecats.lsp.dplanner/files/'
      : 'app cache';
    notify('Saved: ' + filename + '\n(' + where + ')');

    await shareFile(saved.uri, filename);
  }

  // ── intercept a.click() — used by exportTXT ──────────────────────────────

  const _origClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download && this.href && this.href.startsWith('blob:')) {
      console.log('[CapBridge] Intercepted a.click() download=' + this.download);
      const href = this.href;
      const dl   = this.download;
      fetch(href)
        .then(r => r.blob())
        .then(blob => handleBlobDownload(blob, dl))
        .catch(err => { notify('Export error: ' + err, true); _origClick.call(this); });
      return;
    }
    _origClick.call(this);
  };

  // ── intercept a.dispatchEvent(MouseEvent) — used by jsPDF doc.save() ────

  const _origDispatch = HTMLAnchorElement.prototype.dispatchEvent;
  HTMLAnchorElement.prototype.dispatchEvent = function (event) {
    if (
      event instanceof MouseEvent &&
      event.type === 'click' &&
      this.download &&
      this.href &&
      this.href.startsWith('blob:')
    ) {
      console.log('[CapBridge] Intercepted dispatchEvent click download=' + this.download);
      const href = this.href;
      const dl   = this.download;
      fetch(href)
        .then(r => r.blob())
        .then(blob => handleBlobDownload(blob, dl))
        .catch(err => { notify('Export error: ' + err, true); _origDispatch.call(this, event); });
      return true; // consumed
    }
    return _origDispatch.call(this, event);
  };

  console.log('[CapBridge] Active — patched click() + dispatchEvent() for blob downloads');
})();
